# Deploy Guide - Grupo SER na AWS

Este guia explica como fazer deploy da aplicação na AWS usando GitHub Actions.

## 📋 Pré-requisitos

Antes de fazer o primeiro deploy, certifique-se de que:

- [x] Infraestrutura AWS provisionada ([AWS-SETUP.md](./AWS-SETUP.md))
- [x] ECR repositories criados
- [x] ECS Cluster e Services configurados
- [x] Secrets configurados no GitHub
- [x] CloudFront distributions criadas

---

## 🔐 Configurar Secrets no GitHub

Acesse: `Settings → Secrets and variables → Actions → New repository secret`

### Secrets Necessários:

```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
CLOUDFRONT_DISTRIBUTION_ID=E...
```

**Como obter:**

```bash
# Criar IAM user para CI/CD
aws iam create-user --user-name github-actions-ci-cd

# Criar access keys
aws iam create-access-key --user-name github-actions-ci-cd

# Anexar policies necessárias
aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

aws iam attach-user-policy \
  --user-name github-actions-ci-cd \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess
```

---

## 🚀 Processo de Deploy

### Fluxo Automático (Recomendado)

O deploy é 100% automático usando **Conventional Commits** + **Semantic Release**:

```bash
# 1. Fazer alterações no código
git checkout -b feature/nova-funcionalidade

# 2. Commit usando conventional commits
git add .
git commit -m "feat: adiciona busca por filtros avançados"

# 3. Criar Pull Request
gh pr create --title "feat: adiciona busca por filtros avançados"

# 4. Após merge para main
# ✅ GitHub Actions automaticamente:
#    1. Analisa commits
#    2. Determina próxima versão (major.minor.patch)
#    3. Cria CHANGELOG
#    4. Cria tag (ex: v1.2.0)
#    5. Cria GitHub Release
#    6. Dispara deploy para AWS
```

### Conventional Commits

Siga o padrão para versioning automático:

| Tipo | Descrição | Versão |
|------|-----------|--------|
| `feat:` | Nova funcionalidade | **MINOR** (1.0.0 → 1.1.0) |
| `fix:` | Correção de bug | **PATCH** (1.0.0 → 1.0.1) |
| `perf:` | Melhoria de performance | **PATCH** |
| `refactor:` | Refatoração de código | **PATCH** |
| `docs:` | Apenas documentação | **PATCH** |
| `chore:` | Tarefas de build/config | Sem release |
| `test:` | Adicionar testes | Sem release |
| `style:` | Formatação de código | Sem release |

**BREAKING CHANGE:** Adicione `!` após o tipo para indicar major version:

```bash
git commit -m "feat!: migra API de cursos para GraphQL"
# Resultado: 1.0.0 → 2.0.0
```

**Exemplos:**

```bash
# MINOR: Nova feature
git commit -m "feat: adiciona filtro por modalidade de curso"

# PATCH: Bug fix
git commit -m "fix: corrige exibição de imagens no Safari"

# MAJOR: Breaking change
git commit -m "feat!: remove suporte para Next.js 14

BREAKING CHANGE: O projeto agora requer Next.js 15+"

# Sem release
git commit -m "chore: atualiza dependências do ESLint"
```

---

## 🏗️ Workflows Disponíveis

### 1. Semantic Release (Automático)

**Trigger:** Push para `main`

**Arquivo:** [.github/workflows/release.yml](.github/workflows/release.yml)

**O que faz:**
1. Analisa commits desde última release
2. Calcula próxima versão (semver)
3. Gera CHANGELOG.md
4. Cria Git tag (ex: `v1.2.3`)
5. Cria GitHub Release

**Resultado:** Nova tag dispara deploy automático do Next.js

---

### 2. Deploy Next.js (Automático via Tag)

**Trigger:** Tag `v*` (ex: `v1.0.0`, `v1.2.3`)

**Arquivo:** [.github/workflows/deploy-next.yml](.github/workflows/deploy-next.yml)

**Passos:**
1. Checkout do código
2. Build Docker image
3. Push para ECR
4. Atualiza ECS Task Definition
5. Deploy para ECS Fargate
6. Invalidate CloudFront cache

**Duração:** ~10-15 minutos

---

### 3. Deploy Strapi (Manual)

**Trigger:** Tag `strapi-v*` (ex: `strapi-v1.0.0`)

**Arquivo:** [.github/workflows/deploy-strapi.yml](.github/workflows/deploy-strapi.yml)

**Como usar:**

```bash
# Criar tag manualmente para Strapi
git tag strapi-v1.0.0 -m "Deploy Strapi 1.0.0"
git push origin strapi-v1.0.0
```

**Passos:**
1. Build Dockerfile do Strapi
2. Push para ECR
3. Deploy para ECS
4. Aguarda migrations
5. Health check

---

## 📊 Monitoramento de Deploy

### Via GitHub Actions

Acesse: `Actions → Deploy Next.js to AWS ECS`

Você verá:
- ✅ Build status
- 📦 ECR image URI
- ⚙️ ECS deployment status
- 🌐 CloudFront invalidation

### Via AWS Console

**ECS:**
```
https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/grupo-ser-production/services/next-frontend-service
```

**CloudWatch Logs:**
```
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fecs$252Fnext-frontend
```

**CloudFront Invalidations:**
```
https://console.aws.amazon.com/cloudfront/v3/home#/distributions/<DISTRIBUTION_ID>/invalidations
```

---

## 🧪 Testar Deploy Localmente

### 1. Build Local da Imagem Docker

```bash
# Build
docker build -t grupo-ser-next:test .

# Rodar localmente
docker run -p 3000:3000 \
  -e STRAPI_URL=http://host.docker.internal:1337 \
  -e REVALIDATION_SECRET=test-secret \
  grupo-ser-next:test

# Testar
curl http://localhost:3000/api/health-check
```

### 2. Simular Deploy para ECR (Dry Run)

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Tag imagem
docker tag grupo-ser-next:test <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/next:test

# Push (ATENÇÃO: Não fazer em produção sem aprovação!)
# docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/grupo-ser/next:test
```

---

## 🔄 Rollback

### Rollback via GitHub (Recomendado)

```bash
# Listar tags
git tag -l

# Fazer rollback para versão anterior
git tag v1.2.3-rollback v1.2.2 -m "Rollback to v1.2.2"
git push origin v1.2.3-rollback
```

O GitHub Actions irá automaticamente fazer deploy da versão antiga.

### Rollback Manual via ECS

```bash
# Listar task definitions
aws ecs list-task-definitions \
  --family-prefix next-frontend \
  --sort DESC

# Atualizar service para task definition anterior
aws ecs update-service \
  --cluster grupo-ser-production \
  --service next-frontend-service \
  --task-definition next-frontend:10  # Versão anterior
```

### Rollback de DNS (Emergência)

Se houver falha crítica, alterar DNS para infraestrutura antiga:

```bash
# Route 53
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://rollback-dns.json
```

---

## 🛟 Troubleshooting

### Deploy falha no build Docker

```bash
# Verificar logs do GitHub Actions
# Actions → Deploy Next.js → Build step

# Problema comum: falta de espaço em disco
# Solução: Clean up do runner (automático no GitHub)
```

### Deploy falha no ECS

```bash
# Verificar logs do ECS task
aws ecs describe-tasks \
  --cluster grupo-ser-production \
  --tasks <TASK_ARN>

# Ver logs no CloudWatch
aws logs tail /ecs/next-frontend --follow
```

### CloudFront invalidation falha

```bash
# Listar invalidations
aws cloudfront list-invalidations \
  --distribution-id <DISTRIBUTION_ID>

# Criar invalidation manual
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

### Health check falha após deploy

```bash
# Verificar se container está rodando
aws ecs list-tasks \
  --cluster grupo-ser-production \
  --service-name next-frontend-service

# Verificar logs em tempo real
aws logs tail /ecs/next-frontend --follow --since 5m

# Testar health check direto no ALB
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names grupo-ser-next-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

curl http://$ALB_DNS/api/health-check
```

---

## 📈 Métricas de Deploy

### Tempo Médio de Deploy

| Componente | Duração | Downtime |
|-----------|---------|----------|
| Next.js Build | ~5 min | 0s (blue-green) |
| ECR Push | ~2 min | 0s |
| ECS Deploy | ~3 min | 0s (rolling update) |
| CloudFront Invalidation | ~5 min | 0s (gradual) |
| **Total** | **~15 min** | **0s** |

### Frequência de Deploys

- **Staging:** A cada commit em `develop`
- **Production:** A cada tag de release (média: 2-3x/semana)

---

## 🎯 Checklist Pré-Deploy

Antes de fazer deploy para produção:

- [ ] Código passa em `yarn typecheck`
- [ ] Testes unitários passam
- [ ] Build Docker local funciona
- [ ] Health check retorna 200
- [ ] Variáveis de ambiente atualizadas
- [ ] CHANGELOG revisado
- [ ] Stakeholders notificados
- [ ] Backup do RDS recente (< 24h)

---

## 📚 Links Úteis

- [AWS Setup Guide](./AWS-SETUP.md)
- [System Design](../SYSTEM-DESIGN.md)
- [Implementation Guide](../IMPLEMENTATION.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)

---

**Status:** ✅ CI/CD Configurado
**Última atualização:** 2024-12-18
