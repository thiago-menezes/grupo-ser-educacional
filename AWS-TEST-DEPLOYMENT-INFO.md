# AWS Free Tier Deployment - Informações

Data de Deploy: 2025-12-18

## 🚀 Status do Deploy

✅ Deploy concluído com sucesso!

Todos os recursos AWS foram criados e as aplicações estão sendo inicializadas.

---

## 🌐 URLs da Aplicação

### Next.js (Frontend)
**URL**: http://grupo-ser-test-next-alb-1794822298.us-east-1.elb.amazonaws.com

- Health Check: http://grupo-ser-test-next-alb-1794822298.us-east-1.elb.amazonaws.com/api/health
- Portas: 80 (ALB) → 3000 (Container)

### Strapi (CMS)
**URL**: http://grupo-ser-test-strapi-alb-980925625.us-east-1.elb.amazonaws.com

- Health Check: http://grupo-ser-test-strapi-alb-980925625.us-east-1.elb.amazonaws.com/api/health
- Admin: http://grupo-ser-test-strapi-alb-980925625.us-east-1.elb.amazonaws.com/admin
- Portas: 80 (ALB) → 1337 (Container)

⏳ **Aguarde 2-3 minutos** para os containers terminarem de inicializar.

---

## 🔐 Credenciais e Secrets

### Database (RDS PostgreSQL)
```
Endpoint: grupo-ser-test-db.c8tsus2kknfl.us-east-1.rds.amazonaws.com
Port: 5432
Database: postgres
Username: postgres
Password: ChangeMeL8er123!

DATABASE_URL: postgresql://postgres:ChangeMeL8er123!@grupo-ser-test-db.c8tsus2kknfl.us-east-1.rds.amazonaws.com:5432/postgres
```

⚠️ **IMPORTANTE**: Mude a senha após o deploy em produção!

### Strapi Secrets

```bash
# Strapi App Keys (4 keys separadas por vírgula)
APP_KEYS=X0Bxe7qfipYwhPCxcNL0iQ==,FnRhYV0aHCZ50Xt0fgj/+A==,HnzwXjcRikQe2sJs+3OZeQ==,CAl+zkOHlm66ZFYrLhm9ig==

# API Token Salt
API_TOKEN_SALT=29ypEK4yIOqbtKqYbLvQSw==

# Admin JWT Secret
ADMIN_JWT_SECRET=TwDT7w1KM57MgDhV0VVxQA==

# JWT Secret
JWT_SECRET=uRf81Gr8UWXhFqlDQcUn6Q==

# Revalidation Secret (para ISR do Next.js)
REVALIDATION_SECRET=052d9ce5fcef47ffc236981adc7a8761cc3f7a46bec41f093e2025e7cd19ba84
```

### S3 Bucket para Media
```
Bucket Name: grupo-ser-test-media
Region: us-east-1
```

---

## 📋 Recursos AWS Criados

### Rede (VPC)
- **VPC**: `vpc-04f8e9ba7a472c23c` (grupo-ser-test-vpc)
- **Subnets**:
  - `subnet-0fc77c49d310ac947` (us-east-1a)
  - `subnet-02508966c6d05719a` (us-east-1b)

### Security Groups
- **ALB SG**: `sg-0a3c2616b8119a421`
- **ECS SG**: `sg-04346c450955ea364`
- **RDS SG**: `sg-02643f46818c59112`

### Load Balancers
- **Next.js ALB**: grupo-ser-test-next-alb
  - ARN: `arn:aws:elasticloadbalancing:us-east-1:703082531046:loadbalancer/app/grupo-ser-test-next-alb/ec0d70639fdb3197`
  - Target Group: `grupo-ser-test-next-tg`

- **Strapi ALB**: grupo-ser-test-strapi-alb
  - ARN: `arn:aws:elasticloadbalancing:us-east-1:703082531046:loadbalancer/app/grupo-ser-test-strapi-alb/e157045b23a50522`
  - Target Group: `grupo-ser-test-strapi-tg`

### ECS (Fargate)
- **Cluster**: grupo-ser-test
- **Services**:
  - `grupo-ser-test-next` (256 CPU, 512 MB RAM)
  - `grupo-ser-test-strapi` (512 CPU, 1024 MB RAM)

### ECR Repositories
- `703082531046.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/next-test`
- `703082531046.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/strapi-test`

### RDS Database
- **Instance**: grupo-ser-test-db
- **Class**: db.t3.micro (Free Tier)
- **Engine**: PostgreSQL 15.15
- **Storage**: 20 GB gp2
- **Multi-AZ**: Não (para economia)
- **Backups**: Desabilitados (Free Tier test)

### S3
- **Bucket**: grupo-ser-test-media
- **CORS**: Configurado para acesso público de leitura

### IAM Roles
- **ecsTaskExecutionRole**: Para ECS puxar imagens do ECR
- **ecsTaskRole**: Para Strapi acessar S3

---

## 💰 Estimativa de Custo

### Custos Mensais (Free Tier)

| Recurso | Uso | Custo Free Tier |
|---------|-----|-----------------|
| ECS Fargate | 1 Next (256 CPU) + 1 Strapi (512 CPU) | $0-5/mês (depende do uso) |
| RDS db.t3.micro | 750h/mês | **$0** (Free Tier) |
| S3 | < 5GB | **$0** (Free Tier) |
| ALB | 750h/mês | **$0** (Free Tier) |
| Data Transfer | < 15GB/mês | **$0** (Free Tier) |
| ECR | 500MB/mês | **$0** (Free Tier) |

**Total Estimado**: $0-5/mês

⚠️ **ATENÇÃO**:
- Fargate não está no Free Tier permanente
- Após 12 meses, custos aumentam
- Monitore o billing no AWS Console

---

## 🧪 Como Testar

### 1. Verificar Health Checks

```bash
# Next.js
curl http://grupo-ser-test-next-alb-1794822298.us-east-1.elb.amazonaws.com/api/health

# Strapi
curl http://grupo-ser-test-strapi-alb-980925625.us-east-1.elb.amazonaws.com/api/health
```

Deve retornar: `{"status":"ok"}`

### 2. Acessar Strapi Admin

1. Abra: http://grupo-ser-test-strapi-alb-980925625.us-east-1.elb.amazonaws.com/admin
2. Crie sua conta de administrador (primeiro acesso)
3. Configure Content Types e adicione conteúdo

### 3. Testar Next.js

1. Abra: http://grupo-ser-test-next-alb-1794822298.us-east-1.elb.amazonaws.com
2. Navegue pelas páginas
3. Teste o multi-domínio (você precisará configurar DNS custom)

### 4. Testar Upload de Imagens

1. No Strapi Admin, faça upload de uma imagem
2. Verifique se foi salva no S3:

```bash
aws s3 ls s3://grupo-ser-test-media/ --recursive
```

### 5. Testar ISR Revalidation

```bash
# Fazer uma alteração no Strapi
# O Strapi chamará o webhook do Next.js automaticamente
# Verifique os logs:
aws logs tail /ecs/grupo-ser-test-next --follow
```

---

## 📊 Monitoramento

### Verificar Status dos Containers

```bash
# Status dos services
aws ecs describe-services \
  --cluster grupo-ser-test \
  --services grupo-ser-test-next grupo-ser-test-strapi \
  --query 'services[].[serviceName,status,runningCount,desiredCount]' \
  --output table

# Tasks rodando
aws ecs list-tasks --cluster grupo-ser-test
```

### Ver Logs

```bash
# Logs do Next.js
aws logs tail /ecs/grupo-ser-test-next --follow

# Logs do Strapi
aws logs tail /ecs/grupo-ser-test-strapi --follow
```

### Verificar Target Health

```bash
# Next.js
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:703082531046:targetgroup/grupo-ser-test-next-tg/d7b2633b02d24ea7

# Strapi
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:703082531046:targetgroup/grupo-ser-test-strapi-tg/92bf33bd2b0d30d2
```

---

## 🔄 Atualizar Aplicação

### Método 1: GitHub Actions (Recomendado)

Veja: [next/docs/GITHUB-SECRETS.md](next/docs/GITHUB-SECRETS.md)

Configure os secrets no GitHub e faça push/tag para deploy automático.

### Método 2: Manual via ECR

```bash
# 1. Build nova imagem
cd next/
docker build -t grupo-ser-next:latest .

# 2. Tag para ECR
docker tag grupo-ser-next:latest \
  703082531046.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/next-test:latest

# 3. Push para ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  703082531046.dkr.ecr.us-east-1.amazonaws.com

docker push 703082531046.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/next-test:latest

# 4. Force redeploy
aws ecs update-service \
  --cluster grupo-ser-test \
  --service grupo-ser-test-next \
  --force-new-deployment
```

---

## 🧹 Limpar Recursos (Quando Terminar os Testes)

Para deletar **TODOS** os recursos e evitar cobranças:

```bash
cd /Users/thiago/Projects/grupo-ser/grupo-ser
./scripts/cleanup-aws-test.sh
```

⚠️ **ATENÇÃO**: Este script deleta:
- ECS Services e Cluster
- Load Balancers e Target Groups
- Task Definitions
- ECR Repositories e imagens
- RDS Database (**SEM** snapshot final)
- S3 Bucket e arquivos
- VPC, Subnets, Security Groups
- IAM Roles criadas

---

## 🔀 Migrar para Conta do Cliente

Quando estiver pronto para migrar para a conta de produção do cliente:

Veja: [next/docs/MIGRATION-BETWEEN-ACCOUNTS.md](next/docs/MIGRATION-BETWEEN-ACCOUNTS.md)

**Resumo**:
1. Configure AWS CLI com credenciais do cliente
2. Execute `./scripts/deploy-aws-test.sh` na conta do cliente
3. Atualize GitHub Secrets com novos valores
4. Faça deploy via GitHub Actions

---

## 📚 Documentação Adicional

- [AWS-FREE-TIER-SETUP.md](next/docs/AWS-FREE-TIER-SETUP.md) - Setup completo passo a passo
- [GITHUB-SECRETS.md](next/docs/GITHUB-SECRETS.md) - Configurar CI/CD
- [MIGRATION-BETWEEN-ACCOUNTS.md](next/docs/MIGRATION-BETWEEN-ACCOUNTS.md) - Migrar para produção

---

## ❓ Troubleshooting

### Containers não iniciam

```bash
# Verificar eventos do service
aws ecs describe-services \
  --cluster grupo-ser-test \
  --services grupo-ser-test-strapi \
  --query 'services[0].events[0:5]'

# Ver logs
aws logs tail /ecs/grupo-ser-test-strapi --follow
```

### Health Check falha

```bash
# Verificar target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:703082531046:targetgroup/grupo-ser-test-strapi-tg/92bf33bd2b0d30d2

# Possíveis causas:
# - Container ainda inicializando (aguarde 2-3 min)
# - Porta errada no security group
# - Health check path incorreto
# - Database connection error (check logs)
```

### Database connection refused

```bash
# Verificar se RDS está disponível
aws rds describe-db-instances \
  --db-instance-identifier grupo-ser-test-db \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address]'

# Verificar security group
# Certifique-se que ECS SG pode acessar RDS SG na porta 5432
```

### S3 upload falha

```bash
# Verificar IAM role
aws iam get-role-policy \
  --role-name ecsTaskRole \
  --policy-name GrupoSerS3Access

# Verificar bucket existe
aws s3 ls s3://grupo-ser-test-media/

# Testar upload manual
echo "test" > /tmp/test.txt
aws s3 cp /tmp/test.txt s3://grupo-ser-test-media/
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do CloudWatch
2. Consulte a documentação em `/next/docs/`
3. Abra uma issue no GitHub do projeto

---

**Status**: ✅ Deploy concluído
**Última atualização**: 2025-12-18 21:59 BRT
