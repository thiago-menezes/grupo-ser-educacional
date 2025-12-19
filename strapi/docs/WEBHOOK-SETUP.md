# Webhook Configuration for Next.js ISR

Este guia explica como configurar webhooks no Strapi para disparar revalidação on-demand no Next.js.

---

## 📋 Pré-requisitos

- [x] Next.js com endpoint `/api/revalidate` configurado
- [x] Strapi admin access
- [x] `REVALIDATION_SECRET` configurado em ambos (Next.js e Strapi)

---

## 🔧 Configurar Webhook no Strapi Admin

### 1. Acessar Settings → Webhooks

```
https://cms.gruposer.com.br/admin/settings/webhooks
```

### 2. Click em "Create new webhook"

### 3. Preencher Formulário

**Name:** `Revalidate Next.js ISR`

**URL:** `https://unama.com.br/api/revalidate`
- ⚠️ Use o domínio principal (qualquer um serve, middleware redireciona)

**Headers:**
```json
{
  "Authorization": "Bearer <REVALIDATION_SECRET>",
  "Content-Type": "application/json"
}
```

**Events:** Selecionar todos os eventos relevantes
- ✅ `entry.create`
- ✅ `entry.update`
- ✅ `entry.delete`
- ✅ `entry.publish`
- ✅ `entry.unpublish`

**Status:** `Enabled`

---

## 📝 Exemplos de Body por Tipo de Conteúdo

### Revalidar Página de Curso

Quando curso é criado/atualizado:

```json
{
  "path": "/cursos/{{ entry.slug }}",
  "tag": "courses"
}
```

### Revalidar Homepage de Instituição

Quando banner é atualizado:

```json
{
  "path": "/",
  "tag": "home-banners"
}
```

### Revalidar Todas as Páginas de uma Tag

```json
{
  "tag": "institution-unama"
}
```

---

## 🔐 Gerar REVALIDATION_SECRET

```bash
# Gerar secret aleatório
openssl rand -base64 32

# Exemplo de output:
# 8xK3m9Lp2Qw7Rt5Ys6Zv4Bn1Cx0Df8Eg3Hj5Kl7Mn9Pq1Rs3Tu6Vw8Xy0Za2Bc4=

# Adicionar ao .env do Next.js
echo "REVALIDATION_SECRET=8xK3m9Lp2Qw7Rt5Ys6Zv4Bn1Cx0Df8Eg3Hj5Kl7Mn9Pq1Rs3Tu6Vw8Xy0Za2Bc4=" >> .env.production

# Adicionar ao .env do Strapi
echo "REVALIDATION_SECRET=8xK3m9Lp2Qw7Rt5Ys6Zv4Bn1Cx0Df8Eg3Hj5Kl7Mn9Pq1Rs3Tu6Vw8Xy0Za2Bc4=" >> .env.production
```

---

## 🧪 Testar Webhook

### Via Strapi Admin

1. Acesse o webhook criado
2. Click em "Trigger"
3. Verifique nos logs do Next.js

### Via cURL

```bash
curl -X POST https://unama.com.br/api/revalidate \
  -H "Authorization: Bearer <REVALIDATION_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/cursos/engenharia-civil",
    "tag": "courses"
  }'

# Resposta esperada:
{
  "revalidated": true,
  "now": 1702901234567,
  "items": ["path: /cursos/engenharia-civil", "tag: courses"]
}
```

---

## 📊 Monitorar Webhooks

### Ver Logs no Strapi

Strapi mantém histórico de webhooks disparados:

```
Settings → Webhooks → <webhook-name> → View logs
```

Você verá:
- ✅ Status code (200, 401, 500, etc)
- ⏱️ Response time
- 📄 Response body

### Ver Logs no Next.js

```bash
# CloudWatch Logs (produção)
aws logs tail /ecs/next-frontend --follow --filter-pattern "Revalidated"

# Local development
tail -f .next/server/revalidate.log
```

Exemplo de log:
```
2024-12-18T10:30:45.123Z Revalidated path: /cursos/engenharia-civil
2024-12-18T10:30:45.456Z Revalidated tag: courses
```

---

## 🔁 Estratégias de Revalidação

### 1. Revalidação por Path (Específica)

**Quando usar:** Atualização de conteúdo específico

**Exemplo:** Curso "Engenharia Civil" foi atualizado

```json
{
  "path": "/cursos/engenharia-civil"
}
```

**Resultado:** Apenas a página `/cursos/engenharia-civil` é revalidada

---

### 2. Revalidação por Tag (Em massa)

**Quando usar:** Mudança que afeta múltiplas páginas

**Exemplo:** Logo da instituição mudou

```json
{
  "tag": "institution-unama"
}
```

**Resultado:** Todas as páginas com tag `institution-unama` são revalidadas

---

### 3. Revalidação Híbrida

**Quando usar:** Atualização que afeta página específica + lista

**Exemplo:** Novo curso adicionado

```json
{
  "path": "/cursos/novo-curso",
  "tag": "courses-list"
}
```

**Resultado:**
- Página do curso é gerada
- Lista de cursos é atualizada

---

## 🎯 Boas Práticas

### ✅ DO:
- Use `path` para revalidações específicas
- Use `tag` para revalidações em massa
- Monitore logs de webhook regularmente
- Teste webhook após criação

### ❌ DON'T:
- Não revalide tudo (`/*`) em cada update
- Não compartilhe `REVALIDATION_SECRET` publicamente
- Não crie múltiplos webhooks para o mesmo evento
- Não esqueça de habilitar webhook após criação

---

## 🛟 Troubleshooting

### Webhook retorna 401 Unauthorized

**Causa:** `REVALIDATION_SECRET` incorreto ou ausente

**Solução:**
```bash
# Verificar secret no Next.js
echo $REVALIDATION_SECRET

# Verificar header do webhook
# Deve ser: Authorization: Bearer <SECRET>
```

---

### Webhook retorna 500 Internal Server Error

**Causa:** Erro no Next.js ao processar revalidação

**Solução:**
```bash
# Ver logs do Next.js
aws logs tail /ecs/next-frontend --follow

# Verificar se path existe
curl https://unama.com.br/cursos/engenharia-civil
```

---

### Webhook não dispara

**Causa:** Webhook desabilitado ou evento não selecionado

**Solução:**
1. Verificar se webhook está `Enabled`
2. Verificar se evento correto está selecionado
3. Testar manualmente via "Trigger"

---

### Página não atualiza após revalidação

**Causa:** Cache do CloudFront não foi invalidado

**Solução:**
```bash
# Invalidar cache manualmente
aws cloudfront create-invalidation \
  --distribution-id <DIST_ID> \
  --paths "/cursos/engenharia-civil"

# Ou aguardar TTL do CloudFront (5 minutos)
```

---

## 📚 Referências

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Strapi Webhooks](https://docs.strapi.io/dev-docs/configurations/webhooks)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)

---

**Status:** ✅ Webhook Configurado
**Última atualização:** 2024-12-18
