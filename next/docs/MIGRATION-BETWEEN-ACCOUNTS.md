# Migração Entre Contas AWS

Guia para migrar a aplicação da sua conta de teste para a conta do cliente.

---

## 📋 Visão Geral

Após testar todo o fluxo na sua conta AWS pessoal, você pode migrar para a conta do cliente de 3 formas:

1. **GitHub Actions** (Recomendado) - Apenas trocar secrets
2. **Infrastructure as Code** - Exportar/recriar com Terraform
3. **Manual** - Recriar recursos usando AWS Console

---

## 🚀 Método 1: GitHub Actions (Mais Simples)

Este é o método mais rápido e recomendado.

### Passo 1: Preparar Conta do Cliente

Na **conta do cliente AWS**:

```bash
# 1. Configurar AWS CLI com credenciais do cliente
aws configure --profile cliente
# AWS Access Key ID: (do cliente)
# AWS Secret Access Key: (do cliente)
# Default region: us-east-1

# 2. Criar infraestrutura base
cd /Users/thiago/Projects/grupo-ser/grupo-ser
./scripts/deploy-aws-test.sh

# Ou criar manualmente seguindo: docs/AWS-SETUP.md
```

### Passo 2: Atualizar GitHub Secrets

```bash
# Exportar valores da conta de teste (para referência)
echo "=== VALORES ATUAIS (TESTE) ===" > /tmp/aws-values.txt
gh secret list >> /tmp/aws-values.txt

# Configurar novos secrets com credenciais do cliente
gh secret set AWS_ACCESS_KEY_ID
# Cole a Access Key do cliente e pressione Enter

gh secret set AWS_SECRET_ACCESS_KEY
# Cole a Secret Key do cliente e pressione Enter

gh secret set CLOUDFRONT_DISTRIBUTION_ID
# Cole o Distribution ID do CloudFront do cliente

gh secret set DATABASE_URL
# postgresql://user:pass@endpoint.rds.amazonaws.com:5432/dbname

# Outros secrets necessários (ver GITHUB-SECRETS.md)
gh secret set STRAPI_APP_KEYS
gh secret set STRAPI_API_TOKEN_SALT
gh secret set STRAPI_ADMIN_JWT_SECRET
gh secret set STRAPI_JWT_SECRET
gh secret set AWS_S3_BUCKET_NAME
gh secret set REVALIDATION_SECRET
```

### Passo 3: Atualizar Workflows

Se os nomes dos recursos forem diferentes, atualize os workflows:

```bash
# Editar .github/workflows/deploy-next.yml
vim .github/workflows/deploy-next.yml

# Atualizar:
# - ECR_REPOSITORY (se mudou)
# - ECS_SERVICE (se mudou)
# - ECS_CLUSTER (se mudou)
# - ECS_TASK_DEFINITION (se mudou)
```

### Passo 4: Fazer Deploy

```bash
# Commit das alterações (se houver)
git add .github/workflows/
git commit -m "chore: update AWS configuration for production"
git push origin main

# Criar release (dispara deploy automático)
git tag v1.0.0
git push origin v1.0.0

# Acompanhar deploy
open https://github.com/seu-usuario/grupo-ser/actions
```

**✅ Pronto!** A aplicação estará rodando na conta do cliente.

---

## 🏗️ Método 2: Infrastructure as Code (Terraform)

Para ter controle total e versionamento da infraestrutura.

### Passo 1: Exportar Configurações Atuais

```bash
# Na conta de teste, exportar task definitions
aws ecs describe-task-definition \
  --task-definition grupo-ser-test-next:1 \
  --query 'taskDefinition' > /tmp/next-task-def.json

aws ecs describe-task-definition \
  --task-definition grupo-ser-test-strapi:1 \
  --query 'taskDefinition' > /tmp/strapi-task-def.json

# Exportar configurações de rede
aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=grupo-ser-test-vpc" > /tmp/vpc.json

# Exportar security groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=VPC_ID" > /tmp/security-groups.json
```

### Passo 2: Criar Terraform Config

```bash
# Criar diretório terraform
mkdir -p terraform/
cd terraform/

# Criar main.tf
cat > main.tf <<'EOF'
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variáveis
variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "grupo-ser-prod"
}

variable "db_password" {
  sensitive = true
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Subnets
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-1a"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-1b"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# Security Groups
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "ALB Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg"
  description = "ECS Tasks Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    from_port       = 1337
    to_port         = 1337
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "RDS Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }
}

# RDS
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-db"
  engine                 = "postgres"
  engine_version         = "15.15"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  db_name                = "postgres"
  username               = "postgres"
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = true
  skip_final_snapshot    = true
  backup_retention_period = 0
  multi_az               = false

  tags = {
    Name = "${var.project_name}-db"
  }
}

# Outputs
output "vpc_id" {
  value = aws_vpc.main.id
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "subnet_ids" {
  value = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}
EOF

# Criar variables
cat > terraform.tfvars <<EOF
aws_region   = "us-east-1"
project_name = "grupo-ser-prod"
db_password  = "SenhaSeguraDoCliente123!"
EOF
```

### Passo 3: Aplicar na Conta do Cliente

```bash
# Configurar credenciais do cliente
export AWS_PROFILE=cliente

# Inicializar Terraform
terraform init

# Planejar mudanças
terraform plan

# Aplicar (criar recursos)
terraform apply

# Capturar outputs
terraform output > /tmp/terraform-outputs.txt
```

### Passo 4: Completar Setup

Após criar a infraestrutura base com Terraform, complete o setup:

```bash
# Criar ECR, ECS, ALB, etc. (recursos não incluídos no Terraform acima)
# Ou adicione-os ao main.tf

# Deploy via GitHub Actions
git tag v1.0.0-prod
git push origin v1.0.0-prod
```

**Vantagens**:
- ✅ Infraestrutura versionada
- ✅ Fácil recriar em outra região/conta
- ✅ Documentação como código

---

## 🖱️ Método 3: Manual via AWS Console

Se preferir usar a interface gráfica.

### Resumo dos Passos:

1. **VPC**: Criar nova VPC com subnets públicas
2. **Security Groups**: Criar SGs para ALB, ECS, RDS
3. **RDS**: Provisionar PostgreSQL db.t3.micro
4. **S3**: Criar bucket para media
5. **ECR**: Criar repositories para Next.js e Strapi
6. **IAM**: Criar roles para ECS tasks
7. **ECS**: Criar cluster Fargate
8. **ALB**: Criar load balancers
9. **ECS Services**: Deploy Next.js e Strapi

Siga o guia detalhado: [AWS-SETUP.md](AWS-SETUP.md)

---

## 🔄 Migração de Dados

### Database (Strapi)

```bash
# 1. Fazer dump do database de teste
pg_dump -h TEST_RDS_ENDPOINT \
  -U postgres \
  -d postgres \
  -f /tmp/strapi-backup.sql

# 2. Restaurar no database do cliente
psql -h PROD_RDS_ENDPOINT \
  -U postgres \
  -d postgres \
  -f /tmp/strapi-backup.sql
```

### S3 Media Files

```bash
# Sync entre buckets
aws s3 sync \
  s3://grupo-ser-test-media \
  s3://grupo-ser-prod-media \
  --source-region us-east-1 \
  --region us-east-1
```

### Secrets e Configurações

```bash
# Copiar task definitions
aws ecs describe-task-definition \
  --task-definition grupo-ser-test-next:1 \
  --profile test > /tmp/next-td.json

# Editar valores (ECR, secrets, etc)
vim /tmp/next-td.json

# Registrar na conta do cliente
aws ecs register-task-definition \
  --cli-input-json file:///tmp/next-td.json \
  --profile cliente
```

---

## ✅ Checklist de Migração

Use este checklist para garantir que tudo foi migrado:

### Infraestrutura
- [ ] VPC e Subnets criadas na conta do cliente
- [ ] Security Groups configurados
- [ ] RDS PostgreSQL provisionado
- [ ] S3 buckets criados
- [ ] ECR repositories criados
- [ ] IAM roles criadas
- [ ] ECS Cluster configurado
- [ ] Load Balancers criados
- [ ] CloudFront distributions criadas (opcional)
- [ ] Route 53 configurado (opcional)

### Dados
- [ ] Database migrado (dump/restore)
- [ ] Media files copiados para novo S3
- [ ] Secrets atualizados (novos valores gerados)

### CI/CD
- [ ] GitHub secrets atualizados
- [ ] Workflows testados
- [ ] Deploy manual bem-sucedido
- [ ] Deploy automático testado

### Validação
- [ ] Next.js health check OK
- [ ] Strapi health check OK
- [ ] Strapi admin acessível
- [ ] Upload de media funciona
- [ ] Webhooks configurados
- [ ] ISR revalidation testado
- [ ] Multi-domínio testado

---

## 🧹 Cleanup da Conta de Teste

Após migração bem-sucedida, limpe a conta de teste:

```bash
# Deletar todos os recursos de teste
cd /Users/thiago/Projects/grupo-ser/grupo-ser
./scripts/cleanup-aws-test.sh

# Confirmar que não há recursos cobrando
aws ce get-cost-and-usage \
  --time-period Start=2024-12-01,End=2024-12-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

---

## 💡 Dicas

### Economia de Custos

Para conta do cliente em **produção**, considere:

- ✅ Use RDS Multi-AZ (alta disponibilidade)
- ✅ Habilite backups automáticos (retenção: 7 dias)
- ✅ Configure auto-scaling no ECS (min: 2, max: 10)
- ✅ Use CloudFront para cache global
- ✅ Configure S3 lifecycle policies (delete após 90 dias)

### Segurança

- ✅ Rotacione secrets a cada 90 dias
- ✅ Habilite MFA na conta AWS
- ✅ Use SSL/TLS (certificados ACM)
- ✅ Configure WAF no CloudFront (proteção DDoS)
- ✅ Habilite CloudTrail (auditoria)

### Monitoramento

- ✅ Configure CloudWatch Alarms
- ✅ Habilite Container Insights no ECS
- ✅ Configure SNS para alertas
- ✅ Use CloudWatch Dashboards

---

## 📚 Referências

- [AWS-SETUP.md](AWS-SETUP.md) - Setup completo
- [AWS-FREE-TIER-SETUP.md](AWS-FREE-TIER-SETUP.md) - Setup de teste
- [GITHUB-SECRETS.md](GITHUB-SECRETS.md) - Configuração de secrets
- [DEPLOY.md](DEPLOY.md) - CI/CD e deploys

---

**Status**: ✅ Documentação completa
**Última atualização**: 2024-12-18
