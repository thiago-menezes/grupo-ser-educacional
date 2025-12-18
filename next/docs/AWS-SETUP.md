# AWS Infrastructure Setup Guide

Este guia detalha como provisionar toda a infraestrutura AWS necessária para o deploy do Grupo SER.

## 📋 Pré-requisitos

- [x] Conta AWS com permissões de administrador
- [x] AWS CLI instalado e configurado (`aws configure`)
- [x] Domínios registrados (unama.com.br, uninassau.com.br, etc)
- [x] Docker instalado localmente (para testes)

---

## 🏗️ Fase 3.1: Configuração Inicial

### 1. Criar VPC e Subnets

```bash
# Região: us-east-1
AWS_REGION=us-east-1

# Criar VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --region $AWS_REGION \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=grupo-ser-vpc}]' \
  --query 'Vpc.VpcId' \
  --output text)

echo "VPC ID: $VPC_ID"

# Habilitar DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support

# Criar Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --region $AWS_REGION \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=grupo-ser-igw}]' \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# Criar Subnets Públicas (2 AZs para alta disponibilidade)
SUBNET_PUB_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-public-1a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

SUBNET_PUB_B=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-public-1b}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# Criar Subnets Privadas (para ECS tasks)
SUBNET_PRIV_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.11.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-private-1a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

SUBNET_PRIV_B=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.12.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-private-1b}]' \
  --query 'Subnet.SubnetId' \
  --output text)

# Criar Subnets de Database (isoladas)
SUBNET_DB_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.21.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-db-1a}]' \
  --query 'Subnet.SubnetId' \
  --output text)

SUBNET_DB_B=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.22.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=grupo-ser-db-1b}]' \
  --query 'Subnet.SubnetId' \
  --output text)
```

### 2. Configurar Route Tables

```bash
# Route Table para subnets públicas
RTB_PUBLIC=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=grupo-ser-public-rtb}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

aws ec2 create-route --route-table-id $RTB_PUBLIC --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

aws ec2 associate-route-table --route-table-id $RTB_PUBLIC --subnet-id $SUBNET_PUB_A
aws ec2 associate-route-table --route-table-id $RTB_PUBLIC --subnet-id $SUBNET_PUB_B

# NAT Gateway para subnets privadas (tasks precisam acessar internet para pull de imagens)
EIP_NAT=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)

NAT_GW=$(aws ec2 create-nat-gateway \
  --subnet-id $SUBNET_PUB_A \
  --allocation-id $EIP_NAT \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=grupo-ser-nat}]' \
  --query 'NatGateway.NatGatewayId' \
  --output text)

# Aguardar NAT Gateway ficar disponível
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW

# Route Table para subnets privadas
RTB_PRIVATE=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=grupo-ser-private-rtb}]' \
  --query 'RouteTable.RouteTableId' \
  --output text)

aws ec2 create-route --route-table-id $RTB_PRIVATE --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_GW

aws ec2 associate-route-table --route-table-id $RTB_PRIVATE --subnet-id $SUBNET_PRIV_A
aws ec2 associate-route-table --route-table-id $RTB_PRIVATE --subnet-id $SUBNET_PRIV_B
```

---

## 🗄️ Fase 3.2: S3 Buckets

### 1. Bucket para Media Uploads do Strapi

```bash
BUCKET_NAME=strapi-media-uploads-grupo-ser

aws s3api create-bucket \
  --bucket $BUCKET_NAME \
  --region $AWS_REGION

# Habilitar versionamento
aws s3api put-bucket-versioning \
  --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled

# Habilitar encryption
aws s3api put-bucket-encryption \
  --bucket $BUCKET_NAME \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access (acesso via CloudFront apenas)
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Configurar CORS
aws s3api put-bucket-cors \
  --bucket $BUCKET_NAME \
  --cors-configuration file://s3-cors-config.json
```

**Arquivo `s3-cors-config.json`:**
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": [
        "https://unama.com.br",
        "https://uninassau.com.br",
        "https://ung.edu.br",
        "https://uninorte.com.br",
        "https://unifael.edu.br",
        "https://uni7.edu.br"
      ],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

---

## 🗃️ Fase 3.3: RDS PostgreSQL

```bash
# Criar DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name grupo-ser-db-subnet-group \
  --db-subnet-group-description "Subnet group for Grupo SER RDS" \
  --subnet-ids $SUBNET_DB_A $SUBNET_DB_B

# Criar Security Group para RDS
SG_RDS=$(aws ec2 create-security-group \
  --group-name grupo-ser-rds-sg \
  --description "Security group for RDS PostgreSQL" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Permitir PostgreSQL apenas do Security Group do ECS (será criado depois)
# aws ec2 authorize-security-group-ingress \
#   --group-id $SG_RDS \
#   --protocol tcp \
#   --port 5432 \
#   --source-group $SG_ECS

# Criar RDS PostgreSQL Multi-AZ
aws rds create-db-instance \
  --db-instance-identifier grupo-ser-strapi-db \
  --db-instance-class db.t4g.small \
  --engine postgres \
  --engine-version 16.1 \
  --master-username strapiuser \
  --master-user-password "CHANGE-ME-STRONG-PASSWORD" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --db-subnet-group-name grupo-ser-db-subnet-group \
  --vpc-security-group-ids $SG_RDS \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --copy-tags-to-snapshot \
  --deletion-protection

# Aguardar RDS ficar disponível (pode levar 10-15 minutos)
aws rds wait db-instance-available --db-instance-identifier grupo-ser-strapi-db

# Obter endpoint do RDS
RDS_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier grupo-ser-strapi-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

echo "RDS Endpoint: $RDS_ENDPOINT"
```

---

## 🐳 Fase 3.4: ECR (Container Registry)

```bash
# Criar repositório para Next.js
aws ecr create-repository \
  --repository-name grupo-ser/next \
  --image-scanning-configuration scanOnPush=true \
  --region $AWS_REGION

# Criar repositório para Strapi
aws ecr create-repository \
  --repository-name grupo-ser/strapi \
  --image-scanning-configuration scanOnPush=true \
  --region $AWS_REGION

# Configurar lifecycle policy (manter apenas últimas 10 imagens)
aws ecr put-lifecycle-policy \
  --repository-name grupo-ser/next \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json

aws ecr put-lifecycle-policy \
  --repository-name grupo-ser/strapi \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json
```

**Arquivo `ecr-lifecycle-policy.json`:**
```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

---

## 🔐 Fase 3.5: Secrets Manager

```bash
# Gerar secrets aleatórios
REVALIDATION_SECRET=$(openssl rand -base64 32)
APP_KEYS=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Criar secret para Next.js
aws secretsmanager create-secret \
  --name grupo-ser/next/production \
  --description "Next.js production secrets" \
  --secret-string "{
    \"STRAPI_URL\": \"https://cms.gruposer.com.br\",
    \"STRAPI_TOKEN\": \"<SERA-GERADO-NO-STRAPI>\",
    \"API_BASE_URL\": \"https://lps-nvps.sereducacional.com\",
    \"COURSES_API_BASE_URL\": \"<COURSES-API-URL>\",
    \"REVALIDATION_SECRET\": \"$REVALIDATION_SECRET\",
    \"APP_BASE_URL\": \"https://unama.com.br\"
  }"

# Criar secret para Strapi
aws secretsmanager create-secret \
  --name grupo-ser/strapi/production \
  --description "Strapi production secrets" \
  --secret-string "{
    \"DATABASE_URL\": \"postgresql://strapiuser:CHANGE-ME-STRONG-PASSWORD@$RDS_ENDPOINT:5432/strapi\",
    \"APP_KEYS\": \"$APP_KEYS\",
    \"API_TOKEN_SALT\": \"$API_TOKEN_SALT\",
    \"ADMIN_JWT_SECRET\": \"$ADMIN_JWT_SECRET\",
    \"TRANSFER_TOKEN_SALT\": \"$TRANSFER_TOKEN_SALT\",
    \"JWT_SECRET\": \"$JWT_SECRET\",
    \"AWS_ACCESS_KEY_ID\": \"<SERA-CONFIGURADO>\",
    \"AWS_SECRET_ACCESS_KEY\": \"<SERA-CONFIGURADO>\",
    \"AWS_REGION\": \"us-east-1\",
    \"AWS_BUCKET\": \"$BUCKET_NAME\",
    \"CDN_URL\": \"https://assets.gruposer.com.br\",
    \"NEXT_REVALIDATION_URL\": \"https://unama.com.br/api/revalidate\",
    \"REVALIDATION_SECRET\": \"$REVALIDATION_SECRET\"
  }"
```

---

## ☁️ Fase 3.6: ECS Fargate

### 1. Criar Cluster

```bash
aws ecs create-cluster \
  --cluster-name grupo-ser-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --settings name=containerInsights,value=enabled
```

### 2. Criar IAM Roles

**Task Execution Role (para ECS puxar imagens e secrets):**
```bash
# Criar role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://ecs-task-execution-trust-policy.json

# Anexar policies
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

**Task Role (para tasks acessarem recursos AWS):**
```bash
# Para Strapi (acesso ao S3)
aws iam create-role \
  --role-name strapiTaskRole \
  --assume-role-policy-document file://ecs-task-trust-policy.json

aws iam put-role-policy \
  --role-name strapiTaskRole \
  --policy-name S3AccessPolicy \
  --policy-document file://strapi-s3-policy.json
```

Continua na próxima seção...

---

## ⚖️ Fase 3.7: Application Load Balancers

### 1. Security Groups

```bash
# Security Group para ALB (público)
SG_ALB=$(aws ec2 create-security-group \
  --group-name grupo-ser-alb-sg \
  --description "Security group for Application Load Balancers" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Permitir HTTP e HTTPS de internet
aws ec2 authorize-security-group-ingress --group-id $SG_ALB --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ALB --protocol tcp --port 443 --cidr 0.0.0.0/0

# Security Group para ECS Tasks
SG_ECS=$(aws ec2 create-security-group \
  --group-name grupo-ser-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Permitir tráfego apenas do ALB
aws ec2 authorize-security-group-ingress --group-id $SG_ECS --protocol tcp --port 3000 --source-group $SG_ALB
aws ec2 authorize-security-group-ingress --group-id $SG_ECS --protocol tcp --port 1337 --source-group $SG_ALB

# Agora configurar acesso do ECS ao RDS
aws ec2 authorize-security-group-ingress --group-id $SG_RDS --protocol tcp --port 5432 --source-group $SG_ECS
```

### 2. Criar ALB para Next.js

```bash
ALB_NEXT=$(aws elbv2 create-load-balancer \
  --name grupo-ser-next-alb \
  --subnets $SUBNET_PUB_A $SUBNET_PUB_B \
  --security-groups $SG_ALB \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Criar Target Group
TG_NEXT=$(aws elbv2 create-target-group \
  --name grupo-ser-next-tg \
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

# Listener HTTPS (requer certificado ACM - criar depois)
# aws elbv2 create-listener \
#   --load-balancer-arn $ALB_NEXT \
#   --protocol HTTPS \
#   --port 443 \
#   --certificates CertificateArn=<ACM_CERT_ARN> \
#   --default-actions Type=forward,TargetGroupArn=$TG_NEXT
```

---

## 🌐 Fase 3.8: CloudFront & ACM

### 1. Solicitar Certificado SSL (ACM)

⚠️ **IMPORTANTE**: Certificados para CloudFront devem ser criados em `us-east-1`

```bash
# Certificado multi-domain para frontend
aws acm request-certificate \
  --domain-name unama.com.br \
  --subject-alternative-names \
    www.unama.com.br \
    uninassau.com.br \
    www.uninassau.com.br \
    ung.edu.br \
    www.ung.edu.br \
    uninorte.com.br \
    www.uninorte.com.br \
    unifael.edu.br \
    www.unifael.edu.br \
    uni7.edu.br \
    www.uni7.edu.br \
  --validation-method DNS \
  --region us-east-1

# Certificado wildcard para subdomínios
aws acm request-certificate \
  --domain-name gruposer.com.br \
  --subject-alternative-names *.gruposer.com.br \
  --validation-method DNS \
  --region us-east-1
```

**Validação DNS**: Você receberá CNAME records que precisam ser adicionados no DNS. Aguarde validação antes de continuar.

### 2. Criar CloudFront Distribution (Assets CDN)

Criar arquivo `cloudfront-assets-config.json` e executar:

```bash
aws cloudfront create-distribution --cli-input-json file://cloudfront-assets-config.json
```

Configuração detalhada no arquivo de exemplo fornecido separadamente.

---

## 🚀 Próximas Etapas

Após provisionar a infraestrutura básica:

1. **Deploy inicial manual** (via Docker local → ECR → ECS)
2. **Configurar GitHub Actions** (automatizar deploys)
3. **Configurar Route 53** ou DNS externo
4. **Testes de carga e ajustes**
5. **Migração gradual de tráfego**

---

## 📊 Estimativa de Custos (Mensal)

| Recurso | Quantidade | Custo Estimado |
|---------|-----------|---------------|
| ECS Fargate (Next.js) | 2 tasks, 0.5 vCPU, 1GB | $35 |
| ECS Fargate (Strapi) | 1 task, 1 vCPU, 2GB | $35 |
| RDS PostgreSQL | db.t4g.small, Multi-AZ | $60 |
| NAT Gateway | 1 | $32 |
| S3 | 50GB + requests | $2 |
| CloudFront | 100GB transfer | $10 |
| ALB | 2 | $35 |
| Route 53 | 7 hosted zones | $4 |
| **Total** | | **~$213/mês** |

---

## 🛟 Suporte e Troubleshooting

- Logs: CloudWatch Logs Groups `/ecs/next-frontend` e `/ecs/strapi-backend`
- Monitoring: CloudWatch Container Insights
- Alarms: Configurar para CPU > 80%, Memory > 85%, 5xx errors
