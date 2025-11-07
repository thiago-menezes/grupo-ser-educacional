# CLAUDE.md

Guia rápido para qualquer agente trabalhar neste repositório após a limpeza das
features antigas. O foco atual é manter o projeto **cru** com a
tematização multi-institucional funcionando e pronto para receber a primeira
feature real.

## Visão geral

- **Framework**: Next.js 15 (App Router) + TypeScript.
- **Design System**: Reshaped (tema Slate + tokens gerados dinamicamente).
- **Estado / Data**: React Query + Axios (`src/libs/api`).
- **Autenticação**: NextAuth v5 (Auth0) em `src/libs/auth`.
- **Testes**: Vitest + Testing Library (ver `src/features/theme/__tests__`).
- **Rotas dinâmicas**: `/ung`, `/uninassau`, etc. com tematização por slug.
- **UI atual**: painel de tematização em `src/app/[institution]/page.tsx`.
- **Nada de Strapi**: todas as integrações/clients antigos foram removidos.

## Comandos úteis

```bash
pnpm dev          # Next.js + Turbopack
pnpm build        # Build produção
pnpm start        # Servir build
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint
pnpm test         # Vitest (passWithNoTests = true)
pnpm test:unit    # *.spec.{ts,tsx}
pnpm test:integration  # *.integration.spec.{ts,tsx}
```

## Arquitetura relevante

```
src/
├── app/
│   ├── [institution]/           # Rotas dinâmicas por instituição
│   │   ├── layout.tsx           # Injeta script de tema baseado no slug
│   │   ├── page.tsx             # Painel de tematização
│   │   └── page.module.scss     # Estilos do painel
│   ├── layout.tsx               # Layout raiz (sem lógica de tema)
│   ├── providers.tsx            # NextAuth + React Query + Reshaped
│   └── page.tsx                 # Redireciona para instituição padrão
├── components/
│   └── InstitutionThemeProvider.tsx  # Remove o <style> do tema no unmount
├── config/
│   └── institutions.ts          # Registro tipado das instituições
├── lib/
│   └── themes/
│       ├── generator.ts         # Usa Reshaped para gerar o CSS
│       └── script-generator.ts  # Cria o IIFE usado no layout
├── libs/
│   ├── api/                     # Axios + React Query helpers
│   ├── auth/                    # Configuração NextAuth/Auth0
│   └── testing/                 # Custom render + helpers
└── features/
    └── theme/__tests__/         # Testes de integração do fluxo de tema
```

## Fluxo de tematização

1. Usuário acessa uma rota institucional (ex: `/ung`, `/uninassau`)
2. O layout em `app/[institution]/layout.tsx` valida o slug e retorna 404 se inválido
3. `generateThemeInjectionScript(slug)` cria um script inline que roda **antes**
   do primeiro paint (SSR)
4. O script injeta um `<style id="institution-theme">` com o CSS gerado por
   `generateInstitutionThemeCSS()`
5. `InstitutionThemeProvider` apenas remove o `<style>` durante hot reload /
   unmount para evitar acúmulo
6. A página `[institution]/page.tsx` mostra a paleta atual, tokens e exemplos visuais
7. A rota raiz `/` redireciona automaticamente para a instituição padrão

## API / Estado

- Use `createApiClient()` / `apiClient` de `src/libs/api/axios.ts`.
- Helpers `query()` / `mutate()` encapsulam métodos GET/POST com tipagem.
- `makeQueryClient()` já está configurado para reuso em providers/testes.
- Não existe mais client Strapi. Quando precisar falar com outros serviços,
  crie módulos específicos dentro da nova feature.

## Autenticação

- `src/libs/auth/index.ts` exporta `auth`, `signIn`, `signOut` e handlers
  (`GET/POST`) usados na rota `src/app/api/auth/[...nextauth]/route.ts`.
- Sessão guarda `accessToken` (JWT) e `SessionUser`. Tipos extras estão em
  `src/types/next-auth.d.ts`.
- A página inicial não exige login, mas o stack está pronto para rotas
  protegidas.

## Variáveis de ambiente

| Variável                  | Uso                                                |
|---------------------------|----------------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`| Base das requisições Axios                         |
| `AUTH_URL`                | URL pública do NextAuth                            |
| `AUTH_SECRET`             | Secret do NextAuth                                 |
| `AUTH_TRUST_HOST`         | Normalmente `true` em dev                          |
| `AUTH0_ISSUER`/`ID`/`SECRET` | Credenciais Auth0                              |
| `MOCK_SERVER`             | Sem uso no momento, mas mantido no template        |

> **NOTA:** `NEXT_PUBLIC_INSTITUTION` foi **removida**. A instituição agora é
> determinada pelo slug da URL (ex: `/ung`, `/uninassau`). A variável ainda
> funciona como fallback legacy, mas o recomendado é usar rotas dinâmicas.

## Testes

- Use `pnpm test` ou execute apenas o arquivo
  `src/features/theme/__tests__/institution-theme.integration.spec.tsx`.
- O custom `render` em `src/libs/testing/testing-wrapper.tsx` já injeta todos
  os providers (Session, Reshaped, React Query).
- Não existe mais setup de Prism/Strapi; o arquivo `vitest.integration.setup.ts`
  foi removido.

## Quando criar novas features

1. Abra uma pasta em `src/features/<nome>/` com `api/`, `hooks/`, `index.tsx`.
2. Adicione rotas correspondentes dentro de `src/app/[institution]/`.
3. As rotas automaticamente herdam o tema da instituição pelo slug.
4. Continue referenciando o painel de tematização para garantir consistência das cores.
5. Atualize `README.md` e este arquivo com qualquer decisão estrutural nova.

## Rotas disponíveis

- `/` - Redireciona automaticamente para `/uninassau` (instituição padrão)
- `/ung` - Painel de tematização da UNG
- `/uninassau` - Painel de tematização da UNINASSAU
- `/uninorte` - Painel de tematização da UNINORTE
- `/unifael` - Painel de tematização da UNIFAEL
- `/unama` - Painel de tematização da UNAMA

**Adicionar nova instituição:**
1. Adicione a configuração em `src/config/institutions.ts`
2. Acesse automaticamente via `/<codigo-lowercase>`
3. Não precisa criar rotas manualmente - o layout dinâmico cuida disso

Com essas informações você deve conseguir trabalhar no repositório sem tropeçar
em artefatos antigos. Mantemos tudo lean até que o primeiro módulo real entre
em desenvolvimento.
