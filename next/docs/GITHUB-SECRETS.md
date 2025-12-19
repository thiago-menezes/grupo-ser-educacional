# GitHub Secrets - Configuração Completa

Este documento lista todos os secrets necessários para configurar no GitHub Actions.

---

## 📋 Como Configurar

Acesse: **Settings → Secrets and variables → Actions → New repository secret**

---

## 🔐 Secrets Obrigatórios

### 1. AWS Credentials

#### `AWS_ACCESS_KEY_ID`
- **Descrição**: Access Key ID do IAM user para CI/CD
- **Formato**: `AKIA...` (20 caracteres)
- **Como obter**:
```bash
aws iam create-user --user-name github-actions-ci-cd
aws iam create-access-key --user-name github-actions-ci-cd
```

#### `AWS_SECRET_ACCESS_KEY`
- **Descrição**: Secret Access Key do IAM user
- **Formato**: String alfanumérica (40 caracteres)
- **Como obter**: Retornado junto com o Access Key ID acima
- **⚠️ ATENÇÃO**: Salve imediatamente, não é possível recuperar depois

---

### 2. CloudFront

#### `CLOUDFRONT_DISTRIBUTION_ID`
- **Descrição**: ID da distribuição CloudFront do Next.js
- **Formato**: `E...` (ex: `E1234567890ABC`)
- **Como obter**:
```bash
aws cloudfront list-distributions \
  --query 'DistributionList.Items[?Comment==`Next.js Frontend`].Id' \
  --output text
```

---

### 3. Database (Para Task Definition do Strapi)

#### `DATABASE_URL`
- **Descrição**: Connection string completa do RDS PostgreSQL
- **Formato**: `postgresql://user:password@endpoint:5432/dbname`
- **Como obter**:
```bash
# Endpoint do RDS
aws rds describe-db-instances \
  --db-instance-identifier grupo-ser-strapi-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text

# Montar URL
postgresql://strapiuser:SENHA_AQUI@endpoint.us-east-1.rds.amazonaws.com:5432/strapi
```

---

### 4. Strapi Secrets

#### `STRAPI_APP_KEYS`
- **Descrição**: App keys do Strapi (separados por vírgula)
- **Formato**: `key1,key2,key3,key4`
- **Como gerar**:
```bash
# Gerar 4 keys
for i in {1..4}; do openssl rand -base64 32; done | tr '\n' ',' | sed 's/,$/\n/'
```

#### `STRAPI_API_TOKEN_SALT`
- **Descrição**: Salt para tokens de API
- **Como gerar**:
```bash
openssl rand -base64 32
```

#### `STRAPI_ADMIN_JWT_SECRET`
- **Descrição**: Secret para JWT do admin
- **Como gerar**:
```bash
openssl rand -base64 32
```

#### `STRAPI_TRANSFER_TOKEN_SALT`
- **Descrição**: Salt para transfer tokens
- **Como gerar**:
```bash
openssl rand -base64 32
```

#### `STRAPI_JWT_SECRET`
- **Descrição**: Secret JWT genérico
- **Como gerar**:
```bash
openssl rand -base64 32
```

---

### 5. S3 / Media Storage

#### `AWS_S3_BUCKET_NAME`
- **Descrição**: Nome do bucket S3 para uploads do Strapi
- **Formato**: `grupo-ser-strapi-media`
- **Como obter**:
```bash
aws s3 ls | grep strapi-media
```

---

### 6. Revalidation (ISR)

#### `REVALIDATION_SECRET`
- **Descrição**: Token compartilhado entre Strapi e Next.js para webhooks
- **Como gerar**:
```bash
openssl rand -base64 32
```
- **⚠️ IMPORTANTE**: Mesmo valor deve estar configurado em:
  - GitHub Secret (para deploy)
  - Variável de ambiente do ECS Task do Next.js
  - Variável de ambiente do ECS Task do Strapi

---

## 🎯 Checklist de Configuração

Use este checklist ao configurar os secrets:

- [ ] `AWS_ACCESS_KEY_ID` - Access key do IAM
- [ ] `AWS_SECRET_ACCESS_KEY` - Secret key do IAM
- [ ] `CLOUDFRONT_DISTRIBUTION_ID` - ID da distribuição CloudFront
- [ ] `DATABASE_URL` - Connection string do RDS
- [ ] `STRAPI_APP_KEYS` - 4 keys separadas por vírgula
- [ ] `STRAPI_API_TOKEN_SALT` - Salt de API tokens
- [ ] `STRAPI_ADMIN_JWT_SECRET` - Secret JWT do admin
- [ ] `STRAPI_TRANSFER_TOKEN_SALT` - Salt de transfer tokens
- [ ] `STRAPI_JWT_SECRET` - Secret JWT genérico
- [ ] `AWS_S3_BUCKET_NAME` - Nome do bucket S3
- [ ] `REVALIDATION_SECRET` - Token de revalidação ISR

---

## 🔒 Permissões IAM Necessárias

O IAM user `github-actions-ci-cd` deve ter as seguintes policies:

```bash
# ECR - Push de imagens Docker
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

# ECS - Deploy de tasks
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# CloudFront - Invalidation de cache
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

# ELB - Para health checks
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/ElasticLoadBalancingReadOnly
```

---

## 🧪 Validar Secrets

### 1. Testar AWS Credentials

```bash
# Configure as credenciais localmente
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"

# Teste básico
aws sts get-caller-identity

# Deve retornar:
{
  "UserId": "AIDA...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/github-actions-ci-cd"
}
```

### 2. Testar Acesso ECR

```bash
aws ecr describe-repositories --region us-east-1
```

### 3. Testar Acesso ECS

```bash
aws ecs list-clusters --region us-east-1
```

### 4. Testar Acesso CloudFront

```bash
aws cloudfront list-distributions --region us-east-1
```

---

## 🛟 Troubleshooting

### Secret não funciona após deploy

**Problema**: Deploy falha com erro de credenciais

**Solução**:
1. Verificar se secret existe:
   ```bash
   gh secret list
   ```

2. Re-criar secret com valor correto:
   ```bash
   gh secret set AWS_ACCESS_KEY_ID
   # Cole o valor e pressione Enter
   ```

3. Disparar novo workflow:
   ```bash
   git tag -f v1.0.0
   git push origin v1.0.0 --force
   ```

---

### IAM user sem permissões

**Problema**: Deploy falha com `AccessDenied`

**Solução**:
```bash
# Verificar policies anexadas
aws iam list-attached-user-policies --user-name github-actions-ci-cd

# Anexar policy faltante
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/PolicyName
```

---

### CloudFront Distribution ID incorreto

**Problema**: Invalidation falha

**Solução**:
```bash
# Listar todas as distributions
aws cloudfront list-distributions \
  --query 'DistributionList.Items[*].[Id,Comment]' \
  --output table

# Atualizar secret
gh secret set CLOUDFRONT_DISTRIBUTION_ID -b "E1234567890ABC"
```

---

### Database URL mal formatada

**Problema**: Strapi não conecta ao RDS

**Solução**:
```bash
# Formato correto
postgresql://USERNAME:PASSWORD@ENDPOINT:5432/DATABASE

# Exemplo
postgresql://strapiuser:MyP@ssw0rd123@grupo-ser-db.abc123.us-east-1.rds.amazonaws.com:5432/strapi

# ⚠️ Escapar caracteres especiais na senha:
# @ → %40
# : → %3A
# / → %2F
```

---

## 📊 Rotação de Secrets

### Quando Rotacionar

- ✅ A cada 90 dias (AWS credentials)
- ✅ Quando um colaborador sai da equipe
- ✅ Suspeita de vazamento
- ✅ Após incidente de segurança

### Como Rotacionar AWS Credentials

```bash
# 1. Criar nova access key
aws iam create-access-key --user-name github-actions-ci-cd

# 2. Atualizar secrets no GitHub
gh secret set AWS_ACCESS_KEY_ID -b "AKIA_NEW..."
gh secret set AWS_SECRET_ACCESS_KEY -b "NEW_SECRET..."

# 3. Testar novo deploy
git tag v1.0.1-test
git push origin v1.0.1-test

# 4. Se funcionar, deletar access key antiga
aws iam delete-access-key \
  --user-name github-actions-ci-cd \
  --access-key-id AKIA_OLD...
```

### Como Rotacionar Strapi Secrets

```bash
# 1. Gerar novos secrets
openssl rand -base64 32

# 2. Atualizar no GitHub
gh secret set STRAPI_JWT_SECRET -b "NEW_SECRET..."

# 3. Atualizar task definition do ECS
aws ecs register-task-definition ...

# 4. Deploy via tag
git tag strapi-v1.0.1
git push origin strapi-v1.0.1
```

---

## 📚 Referências

- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Strapi Environment Variables](https://docs.strapi.io/dev-docs/configurations/environment)

---

**Status**: ✅ Documentação completa
**Última atualização**: 2024-12-18
