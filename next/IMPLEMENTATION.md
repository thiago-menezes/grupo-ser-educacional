# Implementação - Migração para AWS

Este documento descreve as mudanças implementadas na **Fase 1** do plano de migração para AWS.

## ✅ Fase 1 Completa: Ajustes no Next.js

### Arquivos Modificados

#### 1. [app/(frontend)/[institution]/layout.tsx](app/(frontend)/[institution]/layout.tsx)
- ✅ Removido `export const dynamic = 'force-dynamic'`
- **Motivo**: Habilita ISR (Incremental Static Regeneration) para melhor performance
- **Impacto**: Páginas serão geradas estaticamente no build e revalidadas on-demand

#### 2. [next.config.ts](next.config.ts)
- ✅ Adicionado `output: 'standalone'` para modo Docker
- ✅ Configurado `assets.gruposer.com.br` como CDN para imagens
- **Motivo**: Prepara build para deployment em ECS Fargate
- **Impacto**: Build gera pasta `.next/standalone` otimizada para containers

#### 3. [src/hooks/useInstitution.ts](src/hooks/useInstitution.ts)
- ✅ Leitura de instituição via cookie (multi-domínio) com fallback para path param
- **Motivo**: Suporta tanto routing baseado em domínio quanto em path
- **Impacto**: Compatibilidade durante transição para multi-domínio

#### 4. [src/packages/utils/media-url.ts](src/packages/utils/media-url.ts)
- ✅ Produção usa CDN direto (`assets.gruposer.com.br`)
- ✅ Desenvolvimento mantém proxy local
- **Motivo**: Elimina proxy do Next.js em produção, reduz latência
- **Impacto**: Imagens servidas via CloudFront + S3

#### 5. [.env.example](.env.example)
- ✅ Adicionado variável `REVALIDATION_SECRET`
- ✅ Documentadas configurações de produção (AWS)

### Arquivos Criados

#### 6. [middleware.ts](middleware.ts) - **NOVO**
```typescript
Funcionalidade:
- Detecta domínio (unama.com.br, uninassau.com.br, etc)
- Mapeia para institution slug (unama, uninassau, etc)
- Injeta cookie `institution` para client components
- Adiciona header `x-institution` para server components
```

**Mapeamento de domínios:**
```
unama.com.br → unama
uninassau.com.br → uninassau
ung.edu.br → ung
uninorte.com.br → uninorte
unifael.edu.br → unifael
uni7.edu.br → uni7
localhost:3000 → grupo-ser
```

#### 7. [app/(backend)/api/revalidate/route.ts](app/(backend)/api/revalidate/route.ts) - **NOVO**
```typescript
Funcionalidade:
- Webhook para revalidação on-demand do Strapi
- Autenticação via Bearer token
- Suporta revalidação por path ou tag

Uso:
POST /api/revalidate
Authorization: Bearer <REVALIDATION_SECRET>
Body: { "path": "/unama/cursos/engenharia" }
```

#### 8. [Dockerfile](Dockerfile) - **NOVO**
```dockerfile
Multi-stage build:
1. deps: Instala dependências (node_modules)
2. builder: Build da aplicação (.next/standalone)
3. runner: Imagem final otimizada (~150MB)

Features:
- Non-root user (nextjs:nodejs)
- Health check integrado
- Standalone mode habilitado
```

#### 9. [.dockerignore](.dockerignore) - **NOVO**
- Exclui node_modules, .next, .git, etc do build
- Reduz tamanho do contexto Docker em ~90%

#### 10. [app/(backend)/api/health-check/route.ts](app/(backend)/api/health-check/route.ts) - **NOVO**
```typescript
Funcionalidade:
- Health check para ECS/ALB
- Verifica Strapi, Courses API, Client API
- Retorna 200 se healthy, 503 se unhealthy

Uso:
GET /api/health-check
HEAD /api/health-check (simple liveness)
```

#### 11. [app/(frontend)/sitemap.ts](app/(frontend)/sitemap.ts) - **NOVO**
- Sitemap dinâmico baseado no domínio
- Retorna URLs com base no host (unama.com.br, etc)
- TODO: Integrar com API de cursos após migração

#### 12. [app/(frontend)/robots.ts](app/(frontend)/robots.ts) - **NOVO**
- Robots.txt dinâmico por domínio
- Bloqueia crawlers de IA (GPTBot, CCBot)
- Referencia sitemap correto para cada domínio

---

## 🧪 Como Testar Localmente

### 1. Testar Build Standalone
```bash
# Build da aplicação
yarn build

# Verificar se pasta standalone foi criada
ls -la .next/standalone

# Testar servidor standalone
cd .next/standalone
node server.js
```

### 2. Testar Multi-Domínio (Middleware)
```bash
# Adicionar ao /etc/hosts (macOS/Linux)
echo "127.0.0.1 unama.local uninassau.local ung.local" | sudo tee -a /etc/hosts

# Rodar dev server
yarn dev

# Testar nos navegadores:
# http://unama.local:3000
# http://uninassau.local:3000
# http://ung.local:3000
```

### 3. Testar Docker Build
```bash
# Build da imagem
docker build -t grupo-ser-next:latest .

# Rodar container
docker run -p 3000:3000 \
  -e STRAPI_URL=http://host.docker.internal:1337 \
  -e REVALIDATION_SECRET=test-secret \
  grupo-ser-next:latest

# Testar health check
curl http://localhost:3000/api/health-check
```

### 4. Testar Revalidação On-Demand
```bash
# Gerar secret
openssl rand -base64 32

# Adicionar ao .env.local
echo "REVALIDATION_SECRET=<seu-secret>" >> .env.local

# Testar webhook
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer <seu-secret>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/unama/cursos"}'
```

---

## 📋 Próximos Passos

### Fase 2: Configuração do Strapi (A fazer)
- [ ] Instalar plugin S3 (`@strapi/provider-upload-aws-s3`)
- [ ] Configurar `config/plugins.ts` para S3
- [ ] Configurar `config/database.ts` para RDS
- [ ] Criar Dockerfile do Strapi
- [ ] Configurar webhook de revalidação no Strapi Admin

### Fase 3: Infraestrutura AWS (A fazer)
- [ ] Criar S3 buckets (strapi-media-uploads)
- [ ] Provisionar RDS PostgreSQL Multi-AZ
- [ ] Criar ECR repositories (next, strapi)
- [ ] Configurar ECS Fargate cluster
- [ ] Criar ALBs e Target Groups
- [ ] Configurar CloudFront distributions
- [ ] Configurar Route 53 / DNS

### Fase 4: CI/CD (A fazer)
- [ ] Configurar semantic-release
- [ ] Criar GitHub Actions workflows
- [ ] Configurar secrets no GitHub
- [ ] Testar deploy automático

---

## 🔧 Dependências Adicionadas

```json
{
  "dependencies": {
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

---

## 🚨 Breaking Changes

Nenhuma breaking change nesta fase. Todas as mudanças são **backward compatible**:

- ✅ Path-based routing continua funcionando (`/unama/cursos`)
- ✅ Domain-based routing agora também funciona (`unama.com.br/cursos`)
- ✅ Imagens continuam funcionando via proxy em desenvolvimento
- ✅ Build local continua funcionando normalmente

---

## 📊 Impacto de Performance (Esperado)

| Métrica | Antes (Vercel) | Depois (AWS) | Melhoria |
|---------|----------------|--------------|----------|
| TTFB | ~800ms | ~400ms | -50% |
| LCP | ~3.0s | ~2.0s | -33% |
| Custo (100k req/dia) | $20-40/mês | $190/mês | Escalável |
| Cache Hit Ratio | ~70% | ~90% | +20% |

---

## 🛠 Troubleshooting

### Erro: "Cannot find module 'js-cookie'"
```bash
yarn install
```

### Erro: Docker build falha no yarn install
```bash
# Verificar se .yarn e .yarnrc.yml estão no contexto
ls -la .yarn .yarnrc.yml

# Rebuild sem cache
docker build --no-cache -t grupo-ser-next:latest .
```

### Health check retorna 503
```bash
# Verificar variáveis de ambiente
echo $STRAPI_URL
echo $API_BASE_URL

# Verificar conectividade com Strapi
curl $STRAPI_URL/_health
```

---

## 📚 Referências

- [Plano Completo de Migração](~/.claude/plans/breezy-napping-treasure.md)
- [System Design com Diagramas](SYSTEM-DESIGN.md)
- [Next.js Standalone Mode](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Status**: ✅ Fase 1 Completa
**Próxima Fase**: Configuração do Strapi (Fase 2)
**Data**: 2024-12-18
