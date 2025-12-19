# AWS Free Tier Setup - Deploy de Teste

Guia para fazer deploy na sua conta AWS pessoal usando o **Free Tier** para testar todo o fluxo antes de migrar para a conta do cliente.

---

## 💰 Custos Estimados (Free Tier)

### O que é GRATUITO por 12 meses:
- ✅ **EC2**: 750 horas/mês de t2.micro ou t3.micro
- ✅ **RDS**: 750 horas/mês de db.t2.micro ou db.t3.micro (20GB)
- ✅ **S3**: 5GB de armazenamento + 20.000 GET requests
- ✅ **ECS Fargate**: 20GB storage + 10GB transfer (sempre gratuito)
- ✅ **CloudFront**: 50GB de transferência + 2M requests
- ✅ **ALB**: Primeiros 750 horas/mês (primeiro ano)

### O que pode ter CUSTO MÍNIMO:
- ⚠️ **RDS Multi-AZ**: ~$15/mês (desabilitar para teste)
- ⚠️ **NAT Gateway**: ~$30/mês (usar apenas public subnets para teste)
- ⚠️ **CloudFront**: Após 50GB (unlikely em teste)

### ✅ Estimativa Total para Teste:
**$0-5/mês** se seguir este guia corretamente!

---

## 🚀 Setup Rápido (Step-by-Step)

### ⚠️ Importante: Como Copiar Comandos

Ao copiar comandos multi-linha deste guia:

**Opção 1 (Recomendada)**: Use os scripts automatizados
```bash
./scripts/deploy-aws-test.sh  # Deploy completo automatizado
./scripts/create-rds.sh        # Apenas criar RDS
```

**Opção 2**: Copie comandos em uma linha (sem `\`)
```bash
# ✅ CORRETO: Procure por "Opção 1: Comando em uma linha"
aws rds create-db-instance --db-instance-identifier ...

# ❌ ERRADO: Comandos multi-linha podem dar erro "dquote>"
aws rds create-db-instance \
  --db-instance-identifier ...
```

**Opção 3**: Salve em arquivo .sh e execute
```bash
# Copie o comando completo para um arquivo
cat > /tmp/create-rds.sh <<'EOF'
aws rds create-db-instance \
  --db-instance-identifier grupo-ser-test-db \
  ...
EOF

# Execute
bash /tmp/create-rds.sh
```

---

### Pré-requisitos

```bash
# 1. Instalar AWS CLI
brew install awscli  # macOS
# ou
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# 2. Instalar Docker Desktop
# macOS: https://docs.docker.com/desktop/install/mac-install/
# Baixe e instale Docker Desktop
# Abra o aplicativo e aguarde iniciar

# Verificar instalação do Docker
docker --version
# Deve mostrar: Docker version 24.x.x ou superior

# 3. Configurar credenciais AWS
aws configure
# AWS Access Key ID: (sua key)
# AWS Secret Access Key: (seu secret)
# Default region: us-east-1
# Default output: json

# 4. Verificar AWS
aws sts get-caller-identity
```

---

## 📦 Fase 1: Infraestrutura Base (Gratuita)

### 1.1 Criar VPC com Public Subnets Apenas

```bash
# Criar VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=grupo-ser-test-vpc}]' \
  --query 'Vpc.VpcId' \
  --output text)

echo "VPC ID: $VPC_ID"

# Habilitar DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support

# Criar Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=grupo-ser-test-igw}]' \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# Criar 2 Public Subnets (para ALB)
SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-test-public-1a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-test-public-1b}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# Auto-assign public IPs
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_1 --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_2 --map-public-ip-on-launch

# Criar Route Table
RTB_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=grupo-ser-test-public-rt}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Rota para Internet
aws ec2 create-route --route-table-id $RTB_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

# Associar subnets
aws ec2 associate-route-table --route-table-id $RTB_ID --subnet-id $SUBNET_1
aws ec2 associate-route-table --route-table-id $RTB_ID --subnet-id $SUBNET_2

echo "Subnets: $SUBNET_1, $SUBNET_2"
```

**💰 Custo**: $0/mês

---

### 1.2 Criar Security Groups

```bash
# Security Group para ALB
ALB_SG=$(aws ec2 create-security-group \
  --group-name grupo-ser-test-alb-sg \
  --description "ALB Security Group for Grupo SER Test" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

# Security Group para ECS Tasks
ECS_SG=$(aws ec2 create-security-group \
  --group-name grupo-ser-test-ecs-sg \
  --description "ECS Tasks Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 3000 --source-group $ALB_SG
aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 1337 --source-group $ALB_SG

# Security Group para RDS
RDS_SG=$(aws ec2 create-security-group \
  --group-name grupo-ser-test-rds-sg \
  --description "RDS Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress --group-id $RDS_SG --protocol tcp --port 5432 --source-group $ECS_SG

echo "Security Groups created: ALB=$ALB_SG, ECS=$ECS_SG, RDS=$RDS_SG"
```

**💰 Custo**: $0/mês

---

## 🗄️ Fase 2: Database (RDS PostgreSQL - Free Tier)

### 💡 Dica: Verificar Versões Disponíveis

Se encontrar erro de versão, verifique as versões disponíveis:

```bash
# Listar versões PostgreSQL 15.x disponíveis
aws rds describe-db-engine-versions \
  --engine postgres \
  --query 'DBEngineVersions[].[EngineVersion]' \
  --output text | grep "^15\." | sort -V

# Ou versões 16.x
aws rds describe-db-engine-versions \
  --engine postgres \
  --query 'DBEngineVersions[].[EngineVersion]' \
  --output text | grep "^16\." | sort -V
```

### 2.1 Criar RDS Single-AZ (Gratuito)

```bash
# Criar DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name grupo-ser-test-db-subnet \
  --db-subnet-group-description "Grupo SER Test DB Subnet Group" \
  --subnet-ids $SUBNET_1 $SUBNET_2

# Criar RDS PostgreSQL (FREE TIER)
# Opção 1: Comando em uma linha (mais seguro para copiar/colar)
aws rds create-db-instance --db-instance-identifier grupo-ser-test-db --db-instance-class db.t3.micro --engine postgres --engine-version 15.15 --master-username postgres --master-user-password ChangeMeL8er123! --allocated-storage 20 --storage-type gp2 --vpc-security-group-ids $RDS_SG --db-subnet-group-name grupo-ser-test-db-subnet --publicly-accessible --backup-retention-period 0 --no-multi-az --no-deletion-protection --tags Key=Name,Value=grupo-ser-test-db

# Opção 2: Multi-linha (copie tudo de uma vez, incluindo a última linha)
: <<'END_COMMENT'
aws rds create-db-instance \
  --db-instance-identifier grupo-ser-test-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.15 \
  --master-username postgres \
  --master-user-password ChangeMeL8er123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids $RDS_SG \
  --db-subnet-group-name grupo-ser-test-db-subnet \
  --publicly-accessible \
  --backup-retention-period 0 \
  --no-multi-az \
  --no-deletion-protection \
  --tags Key=Name,Value=grupo-ser-test-db
END_COMMENT

echo "⏳ RDS criando... (leva ~10 minutos)"
echo "Acompanhe: aws rds describe-db-instances --db-instance-identifier grupo-ser-test-db --query 'DBInstances[0].DBInstanceStatus'"

# Aguardar disponibilidade
aws rds wait db-instance-available --db-instance-identifier grupo-ser-test-db

# Obter endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier grupo-ser-test-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

echo "✅ Database pronto!"
echo "DATABASE_URL=postgresql://postgres:ChangeMeL8er123!@$DB_ENDPOINT:5432/postgres"
```

**💰 Custo**: $0/mês (750 horas free tier = 31 dias 24/7)

⚠️ **IMPORTANTE**:
- `--no-multi-az` = gratuito
- `--backup-retention-period 0` = sem backups automáticos (economia)
- `db.t3.micro` = dentro do free tier

---

## 📦 Fase 3: S3 e ECR

### 3.1 Criar S3 Bucket (Gratuito)

```bash
# Bucket para media uploads do Strapi
aws s3 mb s3://grupo-ser-test-media --region us-east-1

# Configurar CORS
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

aws s3api put-bucket-cors --bucket grupo-ser-test-media --cors-configuration file:///tmp/cors.json

# Bloquear acesso público (segurança)
aws s3api put-public-access-block \
  --bucket grupo-ser-test-media \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "✅ S3 bucket criado: s3://grupo-ser-test-media"
```

**💰 Custo**: $0/mês (5GB free tier)

---

### 3.2 Criar ECR Repositories

```bash
# Repository para Next.js
aws ecr create-repository \
  --repository-name grupo-ser/next-test \
  --image-scanning-configuration scanOnPush=true \
  --region us-east-1

# Repository para Strapi
aws ecr create-repository \
  --repository-name grupo-ser/strapi-test \
  --image-scanning-configuration scanOnPush=true \
  --region us-east-1

# Obter URIs e exportar como variáveis de ambiente
NEXT_ECR=$(aws ecr describe-repositories --repository-names grupo-ser/next-test --query 'repositories[0].repositoryUri' --output text)
STRAPI_ECR=$(aws ecr describe-repositories --repository-names grupo-ser/strapi-test --query 'repositories[0].repositoryUri' --output text)

# IMPORTANTE: Exportar as variáveis para uso nos próximos comandos
export NEXT_ECR
export STRAPI_ECR

echo "✅ ECR Repositories criados:"
echo "Next.js: $NEXT_ECR"
echo "Strapi: $STRAPI_ECR"
echo ""
echo "⚠️  IMPORTANTE: As variáveis foram exportadas para esta sessão do terminal"
echo "Se abrir um novo terminal, execute novamente:"
echo "export NEXT_ECR=$NEXT_ECR"
echo "export STRAPI_ECR=$STRAPI_ECR"
```

**Alternativa: Usar script de verificação**
```bash
# Script que configura as variáveis automaticamente
./scripts/verify-ecr.sh

# Depois copie e cole o comando export mostrado
```

**💰 Custo**: $0/mês (500MB free tier + primeiros 50GB gratuitos)

---

## 🐳 Fase 4: Build e Push de Imagens

### ⚠️ Docker Necessário

Esta fase requer Docker instalado e rodando. Se você não tem Docker:

**Opção 1: Instalar Docker** (Recomendado para teste completo)
```bash
# macOS: Baixe Docker Desktop
open https://docs.docker.com/desktop/install/mac-install/

# Após instalar, abra Docker Desktop e aguarde iniciar
# Verifique se está rodando:
docker --version
```

**Opção 2: Pular esta fase** (Deploy via GitHub Actions depois)
```bash
# Se não quiser instalar Docker agora, você pode:
# 1. Provisionar apenas a infraestrutura (Fases 1-3, 5-8)
# 2. Fazer build e deploy via GitHub Actions depois
# 3. Ir direto para a seção "Fase 5: ECS Cluster"

# Neste caso, as imagens serão criadas automaticamente
# quando você fizer push do código para o GitHub
```

**Opção 3: Usar script automatizado**
```bash
# O script ./scripts/deploy-aws-test.sh verifica se Docker está instalado
# e oferece opções caso não esteja
./scripts/deploy-aws-test.sh
```

### 4.1 Build e Push Next.js

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Build da imagem Next.js
cd /Users/thiago/Projects/grupo-ser/grupo-ser/next
docker build -t grupo-ser-next:latest .

# Tag e push
docker tag grupo-ser-next:latest $NEXT_ECR:latest
docker push $NEXT_ECR:latest

echo "✅ Next.js image pushed to ECR"
```

---

### 4.2 Build e Push Strapi

```bash
# Build da imagem Strapi
cd /Users/thiago/Projects/grupo-ser/grupo-ser/strapi
docker build -t grupo-ser-strapi:latest .

# Tag e push
docker tag grupo-ser-strapi:latest $STRAPI_ECR:latest
docker push $STRAPI_ECR:latest

echo "✅ Strapi image pushed to ECR"
```

**💰 Custo**: $0 (data transfer gratuita)

---

## 🚢 Fase 5: ECS Cluster e Services (Fargate Spot - Mais Barato)

### 5.1 Criar ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name grupo-ser-test-cluster \
  --capacity-providers FARGATE_SPOT FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=4 capacityProvider=FARGATE,weight=1

echo "✅ ECS Cluster criado"
```

---

### 5.2 Criar IAM Role para ECS Tasks

```bash
# Task Execution Role
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

aws iam create-role \
  --role-name ecsTaskExecutionRole-test \
  --assume-role-policy-document file:///tmp/ecs-trust-policy.json

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-test \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Task Role (para S3 access)
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
        "arn:aws:s3:::grupo-ser-test-media",
        "arn:aws:s3:::grupo-ser-test-media/*"
      ]
    }
  ]
}
EOF

aws iam create-role \
  --role-name ecsTaskRole-test \
  --assume-role-policy-document file:///tmp/ecs-trust-policy.json

aws iam put-role-policy \
  --role-name ecsTaskRole-test \
  --policy-name S3Access \
  --policy-document file:///tmp/s3-policy.json

EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole-test --query 'Role.Arn' --output text)
TASK_ROLE_ARN=$(aws iam get-role --role-name ecsTaskRole-test --query 'Role.Arn' --output text)

echo "✅ IAM Roles criadas"
```

---

### 5.3 Criar Application Load Balancers

```bash
# ALB para Next.js
NEXT_ALB_ARN=$(aws elbv2 create-load-balancer \
  --name grupo-ser-test-next-alb \
  --subnets $SUBNET_1 $SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Target Group para Next.js
NEXT_TG_ARN=$(aws elbv2 create-target-group \
  --name grupo-ser-test-next-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-enabled \
  --health-check-path /api/health-check \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Listener HTTP:80
aws elbv2 create-listener \
  --load-balancer-arn $NEXT_ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$NEXT_TG_ARN

# ALB para Strapi
STRAPI_ALB_ARN=$(aws elbv2 create-load-balancer \
  --name grupo-ser-test-strapi-alb \
  --subnets $SUBNET_1 $SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Target Group para Strapi
STRAPI_TG_ARN=$(aws elbv2 create-target-group \
  --name grupo-ser-test-strapi-tg \
  --protocol HTTP \
  --port 1337 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-enabled \
  --health-check-path /_health \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Listener HTTP:80
aws elbv2 create-listener \
  --load-balancer-arn $STRAPI_ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$STRAPI_TG_ARN

# Obter DNS names
NEXT_ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $NEXT_ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)
STRAPI_ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $STRAPI_ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)

echo "✅ ALBs criados:"
echo "Next.js: http://$NEXT_ALB_DNS"
echo "Strapi: http://$STRAPI_ALB_DNS"
```

**💰 Custo**: $0/mês (750 horas free tier no primeiro ano)

---

### 5.4 Criar CloudWatch Log Groups

```bash
aws logs create-log-group --log-group-name /ecs/next-test
aws logs create-log-group --log-group-name /ecs/strapi-test

# Retenção de 3 dias (economia)
aws logs put-retention-policy --log-group-name /ecs/next-test --retention-in-days 3
aws logs put-retention-policy --log-group-name /ecs/strapi-test --retention-in-days 3
```

**💰 Custo**: $0/mês (5GB free tier)

---

### 5.5 Criar Task Definitions

#### Strapi Task Definition

```bash
cat > /tmp/strapi-task-def.json <<EOF
{
  "family": "grupo-ser-test-strapi",
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
      "portMappings": [
        {
          "containerPort": 1337,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "HOST", "value": "0.0.0.0"},
        {"name": "PORT", "value": "1337"},
        {"name": "DATABASE_CLIENT", "value": "postgres"},
        {"name": "DATABASE_HOST", "value": "$DB_ENDPOINT"},
        {"name": "DATABASE_PORT", "value": "5432"},
        {"name": "DATABASE_NAME", "value": "postgres"},
        {"name": "DATABASE_USERNAME", "value": "postgres"},
        {"name": "DATABASE_PASSWORD", "value": "ChangeMeL8er123!"},
        {"name": "DATABASE_SSL", "value": "false"},
        {"name": "AWS_REGION", "value": "us-east-1"},
        {"name": "AWS_BUCKET", "value": "grupo-ser-test-media"},
        {"name": "APP_KEYS", "value": "$(openssl rand -base64 32)"},
        {"name": "API_TOKEN_SALT", "value": "$(openssl rand -base64 32)"},
        {"name": "ADMIN_JWT_SECRET", "value": "$(openssl rand -base64 32)"},
        {"name": "JWT_SECRET", "value": "$(openssl rand -base64 32)"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/strapi-test",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/strapi-task-def.json

echo "✅ Strapi task definition criada"
```

#### Next.js Task Definition

```bash
cat > /tmp/next-task-def.json <<EOF
{
  "family": "grupo-ser-test-next",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "next-app",
      "image": "$NEXT_ECR:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "STRAPI_URL", "value": "http://$STRAPI_ALB_DNS"},
        {"name": "NEXT_PUBLIC_STRAPI_URL", "value": "http://$STRAPI_ALB_DNS"},
        {"name": "REVALIDATION_SECRET", "value": "$(openssl rand -base64 32)"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/next-test",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/next-task-def.json

echo "✅ Next.js task definition criada"
```

---

### 5.6 Criar ECS Services

```bash
# Service Strapi (1 task)
aws ecs create-service \
  --cluster grupo-ser-test-cluster \
  --service-name strapi-test-service \
  --task-definition grupo-ser-test-strapi \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=$STRAPI_TG_ARN,containerName=strapi-app,containerPort=1337

echo "⏳ Strapi service criando..."

# Aguardar Strapi estar healthy
aws ecs wait services-stable --cluster grupo-ser-test-cluster --services strapi-test-service

# Service Next.js (1 task)
aws ecs create-service \
  --cluster grupo-ser-test-cluster \
  --service-name next-test-service \
  --task-definition grupo-ser-test-next \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=$NEXT_TG_ARN,containerName=next-app,containerPort=3000

echo "⏳ Next.js service criando..."

# Aguardar Next.js estar healthy
aws ecs wait services-stable --cluster grupo-ser-test-cluster --services next-test-service

echo "✅ Services criados e rodando!"
```

**💰 Custo**: $0/mês (dentro do free tier do Fargate)

---

## 🧪 Fase 6: Testar o Deploy

```bash
# Testar Strapi
echo "Testing Strapi..."
curl http://$STRAPI_ALB_DNS/_health

# Deve retornar: {"status":"ok",...}

# Testar Next.js
echo "Testing Next.js..."
curl http://$NEXT_ALB_DNS/api/health-check

# Deve retornar: {"status":"ok",...}

# Acessar no navegador
echo "🌐 URLs de Teste:"
echo "Next.js: http://$NEXT_ALB_DNS"
echo "Strapi Admin: http://$STRAPI_ALB_DNS/admin"
```

---

## 🔄 Migração para Conta do Cliente

Quando estiver tudo testado, migrar para conta do cliente é simples:

### Opção 1: Exportar/Importar Task Definitions

```bash
# 1. Exportar configurações testadas
aws ecs describe-task-definition \
  --task-definition grupo-ser-test-next:1 \
  --query 'taskDefinition' > next-task-def-final.json

aws ecs describe-task-definition \
  --task-definition grupo-ser-test-strapi:1 \
  --query 'taskDefinition' > strapi-task-def-final.json

# 2. Na conta do cliente, apenas registrar as mesmas task definitions
# (alterar apenas ECR repository URIs e secrets)
```

### Opção 2: Terraform (Recomendado)

```bash
# Criar Terraform config baseado na infra testada
# Aplicar na conta do cliente:
terraform init
terraform plan
terraform apply
```

### Opção 3: GitHub Actions

```bash
# Simplesmente mudar os secrets no GitHub:
gh secret set AWS_ACCESS_KEY_ID -b "CLIENTE_KEY"
gh secret set AWS_SECRET_ACCESS_KEY -b "CLIENTE_SECRET"

# Fazer novo deploy
git tag v1.0.0
git push origin v1.0.0
```

---

## 🧹 Cleanup (Destruir Tudo)

Quando terminar os testes, destrua tudo para evitar custos:

```bash
# 1. Deletar ECS Services
aws ecs update-service --cluster grupo-ser-test-cluster --service next-test-service --desired-count 0
aws ecs update-service --cluster grupo-ser-test-cluster --service strapi-test-service --desired-count 0
aws ecs delete-service --cluster grupo-ser-test-cluster --service next-test-service --force
aws ecs delete-service --cluster grupo-ser-test-cluster --service strapi-test-service --force

# 2. Deletar ECS Cluster
aws ecs delete-cluster --cluster grupo-ser-test-cluster

# 3. Deletar ALBs
aws elbv2 delete-load-balancer --load-balancer-arn $NEXT_ALB_ARN
aws elbv2 delete-load-balancer --load-balancer-arn $STRAPI_ALB_ARN
aws elbv2 delete-target-group --target-group-arn $NEXT_TG_ARN
aws elbv2 delete-target-group --target-group-arn $STRAPI_TG_ARN

# 4. Deletar RDS (IMPORTANTE!)
aws rds delete-db-instance \
  --db-instance-identifier grupo-ser-test-db \
  --skip-final-snapshot

# 5. Deletar S3 (esvaziar primeiro)
aws s3 rm s3://grupo-ser-test-media --recursive
aws s3 rb s3://grupo-ser-test-media

# 6. Deletar ECR (esvaziar primeiro)
aws ecr delete-repository --repository-name grupo-ser/next-test --force
aws ecr delete-repository --repository-name grupo-ser/strapi-test --force

# 7. Deletar Security Groups
aws ec2 delete-security-group --group-id $ECS_SG
aws ec2 delete-security-group --group-id $RDS_SG
aws ec2 delete-security-group --group-id $ALB_SG

# 8. Deletar VPC e recursos
aws ec2 delete-subnet --subnet-id $SUBNET_1
aws ec2 delete-subnet --subnet-id $SUBNET_2
aws ec2 delete-route-table --route-table-id $RTB_ID
aws ec2 detach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID
aws ec2 delete-vpc --vpc-id $VPC_ID

echo "✅ Tudo deletado! Custo = $0"
```

---

## 💡 Dicas para Economizar

### Durante o Teste:
1. ✅ Use apenas 1 task por service (minimum)
2. ✅ Use FARGATE_SPOT (70% mais barato)
3. ✅ Use db.t3.micro single-AZ
4. ✅ Desabilite Multi-AZ no RDS
5. ✅ Use apenas public subnets (sem NAT Gateway)
6. ✅ Configure logs com retenção de 3 dias

### Monitorar Custos:
```bash
# Ver custos atuais
aws ce get-cost-and-usage \
  --time-period Start=2024-12-01,End=2024-12-18 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

---

## 📊 Resumo de Recursos (Free Tier)

| Recurso | Tipo | Free Tier | Custo/mês |
|---------|------|-----------|-----------|
| VPC | - | ✅ Ilimitado | $0 |
| Subnets | Public | ✅ Ilimitado | $0 |
| Security Groups | - | ✅ Ilimitado | $0 |
| RDS | db.t3.micro | ✅ 750h/mês | $0 |
| S3 | Standard | ✅ 5GB | $0 |
| ECR | - | ✅ 500MB | $0 |
| ECS Fargate | - | ✅ 20GB | $0 |
| ALB | - | ✅ 750h/mês | $0 |
| CloudWatch Logs | - | ✅ 5GB | $0 |
| **TOTAL** | | | **~$0-5** |

---

## 🎯 Próximos Passos

1. ✅ Execute este script completo
2. ✅ Teste todas as funcionalidades
3. ✅ Configure GitHub Actions para CI/CD
4. ✅ Documente qualquer ajuste necessário
5. ✅ Quando pronto, migre para conta do cliente

---

**Status**: 🚀 Pronto para deploy de teste
**Estimativa de tempo**: 30-45 minutos
**Custo estimado**: $0-5/mês

**Documentação relacionada**:
- [AWS-SETUP.md](AWS-SETUP.md) - Setup completo para produção
- [DEPLOY.md](DEPLOY.md) - CI/CD com GitHub Actions
- [GITHUB-SECRETS.md](GITHUB-SECRETS.md) - Configuração de secrets
