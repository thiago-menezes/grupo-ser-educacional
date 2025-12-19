#!/bin/bash

##############################################################################
# Deploy Grupo SER no AWS Free Tier (Teste)
#
# Este script automatiza o deploy completo da aplicação na AWS usando
# recursos do Free Tier para minimizar custos.
#
# Custo estimado: $0-5/mês
# Tempo estimado: 30-45 minutos
##############################################################################

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar pré-requisitos
check_prerequisites() {
    log_info "Verificando pré-requisitos..."

    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI não encontrado. Instale com: brew install awscli"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        log_warning "Docker não encontrado."
        echo ""
        echo "Para fazer deploy completo, você precisa do Docker."
        echo ""
        echo "Opções:"
        echo "  1. Instalar Docker Desktop: https://docs.docker.com/desktop/install/mac-install/"
        echo "  2. Provisionar apenas infraestrutura (sem imagens Docker)"
        echo "  3. Fazer deploy depois via GitHub Actions"
        echo ""
        read -p "Deseja continuar sem Docker? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Operação cancelada"
            exit 0
        fi
        SKIP_DOCKER=true
    else
        # Verificar se Docker está rodando
        if ! docker info &> /dev/null; then
            log_warning "Docker instalado mas não está rodando."
            echo ""
            echo "Abra Docker Desktop e aguarde iniciar."
            echo "Depois execute este script novamente."
            exit 1
        fi
        SKIP_DOCKER=false
    fi

    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS não configurado. Execute: aws configure"
        exit 1
    fi

    log_success "Pré-requisitos OK"
}

# Configurações
AWS_REGION="us-east-1"
PROJECT_NAME="grupo-ser-test"
DB_PASSWORD="ChangeMeL8er123!"

# Exportar variáveis para uso posterior
export AWS_REGION PROJECT_NAME DB_PASSWORD

##############################################################################
# FASE 1: VPC e Networking
##############################################################################
setup_vpc() {
    log_info "Criando VPC e networking..."

    # Criar VPC
    VPC_ID=$(aws ec2 create-vpc \
        --cidr-block 10.0.0.0/16 \
        --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=${PROJECT_NAME}-vpc}]" \
        --query 'Vpc.VpcId' \
        --output text)

    log_info "VPC criada: $VPC_ID"

    # Habilitar DNS
    aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
    aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support

    # Internet Gateway
    IGW_ID=$(aws ec2 create-internet-gateway \
        --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=${PROJECT_NAME}-igw}]" \
        --query 'InternetGateway.InternetGatewayId' \
        --output text)

    aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

    # Subnets
    SUBNET_1=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.1.0/24 \
        --availability-zone ${AWS_REGION}a \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-1a}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    SUBNET_2=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.2.0/24 \
        --availability-zone ${AWS_REGION}b \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-1b}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    # Auto-assign public IPs
    aws ec2 modify-subnet-attribute --subnet-id $SUBNET_1 --map-public-ip-on-launch
    aws ec2 modify-subnet-attribute --subnet-id $SUBNET_2 --map-public-ip-on-launch

    # Route Table
    RTB_ID=$(aws ec2 create-route-table \
        --vpc-id $VPC_ID \
        --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-rt}]" \
        --query 'RouteTable.RouteTableId' \
        --output text)

    aws ec2 create-route --route-table-id $RTB_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
    aws ec2 associate-route-table --route-table-id $RTB_ID --subnet-id $SUBNET_1
    aws ec2 associate-route-table --route-table-id $RTB_ID --subnet-id $SUBNET_2

    # Exportar para próximas fases
    export VPC_ID SUBNET_1 SUBNET_2 IGW_ID RTB_ID

    log_success "VPC e networking configurados"
}

##############################################################################
# FASE 2: Security Groups
##############################################################################
setup_security_groups() {
    log_info "Criando Security Groups..."

    # ALB Security Group
    ALB_SG=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-alb-sg \
        --description "ALB Security Group" \
        --vpc-id $VPC_ID \
        --query 'GroupId' \
        --output text)

    aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

    # ECS Security Group
    ECS_SG=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-ecs-sg \
        --description "ECS Tasks Security Group" \
        --vpc-id $VPC_ID \
        --query 'GroupId' \
        --output text)

    aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 3000 --source-group $ALB_SG
    aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 1337 --source-group $ALB_SG

    # RDS Security Group
    RDS_SG=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-rds-sg \
        --description "RDS Security Group" \
        --vpc-id $VPC_ID \
        --query 'GroupId' \
        --output text)

    aws ec2 authorize-security-group-ingress --group-id $RDS_SG --protocol tcp --port 5432 --source-group $ECS_SG

    export ALB_SG ECS_SG RDS_SG

    log_success "Security Groups criados"
}

##############################################################################
# FASE 3: RDS Database
##############################################################################
setup_rds() {
    log_info "Criando RDS PostgreSQL..."

    # DB Subnet Group
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${PROJECT_NAME}-db-subnet \
        --db-subnet-group-description "DB Subnet Group" \
        --subnet-ids $SUBNET_1 $SUBNET_2 \
        > /dev/null

    # Criar RDS
    aws rds create-db-instance \
        --db-instance-identifier ${PROJECT_NAME}-db \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.15 \
        --master-username postgres \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --storage-type gp2 \
        --vpc-security-group-ids $RDS_SG \
        --db-subnet-group-name ${PROJECT_NAME}-db-subnet \
        --publicly-accessible \
        --backup-retention-period 0 \
        --no-multi-az \
        --no-deletion-protection \
        --tags Key=Name,Value=${PROJECT_NAME}-db \
        > /dev/null

    log_info "Aguardando RDS ficar disponível (isso leva ~10 minutos)..."
    aws rds wait db-instance-available --db-instance-identifier ${PROJECT_NAME}-db

    # Obter endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier ${PROJECT_NAME}-db \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)

    export DB_ENDPOINT

    log_success "RDS pronto: $DB_ENDPOINT"
}

##############################################################################
# FASE 4: S3 e ECR
##############################################################################
setup_storage() {
    log_info "Criando S3 e ECR..."

    # S3 Bucket
    BUCKET_NAME="${PROJECT_NAME}-media-$(date +%s)"
    aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

    # CORS
    cat > /tmp/cors.json <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

    aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file:///tmp/cors.json

    # Bloquear acesso público
    aws s3api put-public-access-block \
        --bucket $BUCKET_NAME \
        --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

    # ECR Repositories
    aws ecr create-repository \
        --repository-name ${PROJECT_NAME}/next \
        --image-scanning-configuration scanOnPush=true \
        > /dev/null

    aws ecr create-repository \
        --repository-name ${PROJECT_NAME}/strapi \
        --image-scanning-configuration scanOnPush=true \
        > /dev/null

    NEXT_ECR=$(aws ecr describe-repositories --repository-names ${PROJECT_NAME}/next --query 'repositories[0].repositoryUri' --output text)
    STRAPI_ECR=$(aws ecr describe-repositories --repository-names ${PROJECT_NAME}/strapi --query 'repositories[0].repositoryUri' --output text)

    export BUCKET_NAME NEXT_ECR STRAPI_ECR

    log_success "S3 e ECR criados"
}

##############################################################################
# FASE 5: Build e Push Docker Images
##############################################################################
build_and_push_images() {
    if [ "$SKIP_DOCKER" = true ]; then
        log_warning "Pulando build de imagens Docker (Docker não disponível)"
        log_info "Você precisará fazer build via GitHub Actions ou instalar Docker"
        return 0
    fi

    log_info "Building e fazendo push das imagens Docker..."

    # Login no ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

    # Build Next.js
    log_info "Building Next.js..."
    cd "$(dirname "$0")/../next"
    docker build -t ${PROJECT_NAME}-next:latest . --platform linux/amd64
    docker tag ${PROJECT_NAME}-next:latest $NEXT_ECR:latest
    docker push $NEXT_ECR:latest

    # Build Strapi
    log_info "Building Strapi..."
    cd "$(dirname "$0")/../strapi"
    docker build -t ${PROJECT_NAME}-strapi:latest . --platform linux/amd64
    docker tag ${PROJECT_NAME}-strapi:latest $STRAPI_ECR:latest
    docker push $STRAPI_ECR:latest

    cd "$(dirname "$0")"

    log_success "Imagens pushed para ECR"
}

##############################################################################
# FASE 6: ECS Cluster e IAM Roles
##############################################################################
setup_ecs_cluster() {
    log_info "Criando ECS Cluster..."

    aws ecs create-cluster \
        --cluster-name ${PROJECT_NAME}-cluster \
        --capacity-providers FARGATE_SPOT FARGATE \
        --default-capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=4 capacityProvider=FARGATE,weight=1 \
        > /dev/null

    # IAM Roles
    cat > /tmp/ecs-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Task Execution Role
    aws iam create-role \
        --role-name ${PROJECT_NAME}-execution-role \
        --assume-role-policy-document file:///tmp/ecs-trust-policy.json \
        > /dev/null 2>&1 || true

    aws iam attach-role-policy \
        --role-name ${PROJECT_NAME}-execution-role \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
        > /dev/null 2>&1 || true

    # Task Role (S3 access)
    cat > /tmp/s3-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${BUCKET_NAME}",
        "arn:aws:s3:::${BUCKET_NAME}/*"
      ]
    }
  ]
}
EOF

    aws iam create-role \
        --role-name ${PROJECT_NAME}-task-role \
        --assume-role-policy-document file:///tmp/ecs-trust-policy.json \
        > /dev/null 2>&1 || true

    aws iam put-role-policy \
        --role-name ${PROJECT_NAME}-task-role \
        --policy-name S3Access \
        --policy-document file:///tmp/s3-policy.json \
        > /dev/null 2>&1 || true

    # Aguardar propagação das roles
    sleep 10

    EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ${PROJECT_NAME}-execution-role --query 'Role.Arn' --output text)
    TASK_ROLE_ARN=$(aws iam get-role --role-name ${PROJECT_NAME}-task-role --query 'Role.Arn' --output text)

    export EXECUTION_ROLE_ARN TASK_ROLE_ARN

    log_success "ECS Cluster e IAM Roles criados"
}

##############################################################################
# FASE 7: Load Balancers
##############################################################################
setup_load_balancers() {
    log_info "Criando Load Balancers..."

    # CloudWatch Log Groups
    aws logs create-log-group --log-group-name /ecs/${PROJECT_NAME}-next > /dev/null 2>&1 || true
    aws logs create-log-group --log-group-name /ecs/${PROJECT_NAME}-strapi > /dev/null 2>&1 || true
    aws logs put-retention-policy --log-group-name /ecs/${PROJECT_NAME}-next --retention-in-days 3
    aws logs put-retention-policy --log-group-name /ecs/${PROJECT_NAME}-strapi --retention-in-days 3

    # ALB Next.js
    NEXT_ALB_ARN=$(aws elbv2 create-load-balancer \
        --name ${PROJECT_NAME}-next-alb \
        --subnets $SUBNET_1 $SUBNET_2 \
        --security-groups $ALB_SG \
        --scheme internet-facing \
        --type application \
        --query 'LoadBalancers[0].LoadBalancerArn' \
        --output text)

    NEXT_TG_ARN=$(aws elbv2 create-target-group \
        --name ${PROJECT_NAME}-next-tg \
        --protocol HTTP \
        --port 3000 \
        --vpc-id $VPC_ID \
        --target-type ip \
        --health-check-path /api/health-check \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    aws elbv2 create-listener \
        --load-balancer-arn $NEXT_ALB_ARN \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=$NEXT_TG_ARN \
        > /dev/null

    # ALB Strapi
    STRAPI_ALB_ARN=$(aws elbv2 create-load-balancer \
        --name ${PROJECT_NAME}-strapi-alb \
        --subnets $SUBNET_1 $SUBNET_2 \
        --security-groups $ALB_SG \
        --scheme internet-facing \
        --type application \
        --query 'LoadBalancers[0].LoadBalancerArn' \
        --output text)

    STRAPI_TG_ARN=$(aws elbv2 create-target-group \
        --name ${PROJECT_NAME}-strapi-tg \
        --protocol HTTP \
        --port 1337 \
        --vpc-id $VPC_ID \
        --target-type ip \
        --health-check-path /_health \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    aws elbv2 create-listener \
        --load-balancer-arn $STRAPI_ALB_ARN \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=$STRAPI_TG_ARN \
        > /dev/null

    # Aguardar ALBs ficarem ativos
    log_info "Aguardando ALBs ficarem ativos..."
    aws elbv2 wait load-balancer-available --load-balancer-arns $NEXT_ALB_ARN
    aws elbv2 wait load-balancer-available --load-balancer-arns $STRAPI_ALB_ARN

    NEXT_ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $NEXT_ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)
    STRAPI_ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $STRAPI_ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)

    export NEXT_TG_ARN STRAPI_TG_ARN NEXT_ALB_DNS STRAPI_ALB_DNS

    log_success "Load Balancers criados"
}

##############################################################################
# FASE 8: ECS Services
##############################################################################
deploy_services() {
    log_info "Criando ECS Services..."

    # Gerar secrets
    REVALIDATION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    APP_KEYS=$(for i in {1..4}; do openssl rand -base64 32; done | tr '\n' ',' | sed 's/,$//')
    API_TOKEN_SALT=$(openssl rand -base64 32 | tr -d '\n')
    ADMIN_JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')

    # Task Definition Strapi
    cat > /tmp/strapi-task-def.json <<EOF
{
  "family": "${PROJECT_NAME}-strapi",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "strapi-app",
      "image": "$STRAPI_ECR:latest",
      "portMappings": [{"containerPort": 1337, "protocol": "tcp"}],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "HOST", "value": "0.0.0.0"},
        {"name": "PORT", "value": "1337"},
        {"name": "DATABASE_CLIENT", "value": "postgres"},
        {"name": "DATABASE_HOST", "value": "$DB_ENDPOINT"},
        {"name": "DATABASE_PORT", "value": "5432"},
        {"name": "DATABASE_NAME", "value": "postgres"},
        {"name": "DATABASE_USERNAME", "value": "postgres"},
        {"name": "DATABASE_PASSWORD", "value": "$DB_PASSWORD"},
        {"name": "DATABASE_SSL", "value": "false"},
        {"name": "AWS_REGION", "value": "$AWS_REGION"},
        {"name": "AWS_BUCKET", "value": "$BUCKET_NAME"},
        {"name": "APP_KEYS", "value": "$APP_KEYS"},
        {"name": "API_TOKEN_SALT", "value": "$API_TOKEN_SALT"},
        {"name": "ADMIN_JWT_SECRET", "value": "$ADMIN_JWT_SECRET"},
        {"name": "JWT_SECRET", "value": "$JWT_SECRET"},
        {"name": "REVALIDATION_SECRET", "value": "$REVALIDATION_SECRET"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${PROJECT_NAME}-strapi",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

    aws ecs register-task-definition --cli-input-json file:///tmp/strapi-task-def.json > /dev/null

    # Task Definition Next.js
    cat > /tmp/next-task-def.json <<EOF
{
  "family": "${PROJECT_NAME}-next",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "next-app",
      "image": "$NEXT_ECR:latest",
      "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "STRAPI_URL", "value": "http://$STRAPI_ALB_DNS"},
        {"name": "NEXT_PUBLIC_STRAPI_URL", "value": "http://$STRAPI_ALB_DNS"},
        {"name": "REVALIDATION_SECRET", "value": "$REVALIDATION_SECRET"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${PROJECT_NAME}-next",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

    aws ecs register-task-definition --cli-input-json file:///tmp/next-task-def.json > /dev/null

    # Service Strapi
    aws ecs create-service \
        --cluster ${PROJECT_NAME}-cluster \
        --service-name strapi-service \
        --task-definition ${PROJECT_NAME}-strapi \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
        --load-balancers targetGroupArn=$STRAPI_TG_ARN,containerName=strapi-app,containerPort=1337 \
        > /dev/null

    log_info "Aguardando Strapi service ficar estável..."
    aws ecs wait services-stable --cluster ${PROJECT_NAME}-cluster --services strapi-service

    # Service Next.js
    aws ecs create-service \
        --cluster ${PROJECT_NAME}-cluster \
        --service-name next-service \
        --task-definition ${PROJECT_NAME}-next \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
        --load-balancers targetGroupArn=$NEXT_TG_ARN,containerName=next-app,containerPort=3000 \
        > /dev/null

    log_info "Aguardando Next.js service ficar estável..."
    aws ecs wait services-stable --cluster ${PROJECT_NAME}-cluster --services next-service

    log_success "ECS Services deployados"
}

##############################################################################
# FASE 9: Testes
##############################################################################
test_deployment() {
    log_info "Testando deployment..."

    sleep 30  # Aguardar health checks

    # Testar Strapi
    log_info "Testing Strapi health..."
    STRAPI_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://$STRAPI_ALB_DNS/_health || echo "000")

    if [ "$STRAPI_HEALTH" == "200" ]; then
        log_success "Strapi health check: OK"
    else
        log_warning "Strapi health check: $STRAPI_HEALTH (pode levar mais tempo)"
    fi

    # Testar Next.js
    log_info "Testing Next.js health..."
    NEXT_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://$NEXT_ALB_DNS/api/health-check || echo "000")

    if [ "$NEXT_HEALTH" == "200" ]; then
        log_success "Next.js health check: OK"
    else
        log_warning "Next.js health check: $NEXT_HEALTH (pode levar mais tempo)"
    fi
}

##############################################################################
# MAIN
##############################################################################
main() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║       Deploy Grupo SER - AWS Free Tier (Teste)            ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""

    check_prerequisites

    log_warning "Este script irá criar recursos na sua conta AWS."
    log_warning "Custo estimado: \$0-5/mês usando Free Tier"
    echo ""
    read -p "Deseja continuar? (y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Operação cancelada"
        exit 0
    fi

    echo ""
    log_info "Iniciando deploy..."
    echo ""

    setup_vpc
    setup_security_groups
    setup_rds
    setup_storage
    build_and_push_images
    setup_ecs_cluster
    setup_load_balancers
    deploy_services
    test_deployment

    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                  ✅ DEPLOY COMPLETO!                       ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    log_success "Next.js: http://$NEXT_ALB_DNS"
    log_success "Strapi Admin: http://$STRAPI_ALB_DNS/admin"
    echo ""
    log_info "Próximos passos:"
    echo "  1. Acesse o Strapi Admin e crie o primeiro usuário"
    echo "  2. Configure os webhooks (ver docs/WEBHOOK-SETUP.md)"
    echo "  3. Teste todas as funcionalidades"
    echo "  4. Quando pronto, migre para conta do cliente"
    echo ""
    log_warning "Para destruir tudo: ./scripts/cleanup-aws-test.sh"
    echo ""
}

# Executar
main
