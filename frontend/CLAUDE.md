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
- **UI atual**: página única em `src/app/page.tsx` com painel de cores/tokens.
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
│   ├── layout.tsx               # Injeta script bloqueante com o CSS do tema
│   ├── providers.tsx            # NextAuth + React Query + Reshaped
│   ├── page.tsx                 # Única página (painel de tematização)
│   └── page.module.scss         # Estilos do painel
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

1. `NEXT_PUBLIC_INSTITUTION` define a instituição ativa.
2. `getCurrentInstitution()` lê/env upper-case o valor.
3. `generateThemeInjectionScript()` cria um script inline que roda **antes**
   do primeiro paint (SSR).
4. O script injeta um `<style id="institution-theme">` com o CSS gerado por
   `generateInstitutionThemeCSS()`.
5. `InstitutionThemeProvider` apenas remove o `<style>` durante hot reload /
   unmount para evitar acúmulo.
6. A página `/` mostra a paleta atual, tokens e exemplos visuais.

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
| `NEXT_PUBLIC_INSTITUTION` | Código da instituição ativa (UNINASSAU, UNG, etc.) |
| `AUTH_URL`                | URL pública do NextAuth                            |
| `AUTH_SECRET`             | Secret do NextAuth                                 |
| `AUTH_TRUST_HOST`         | Normalmente `true` em dev                          |
| `AUTH0_ISSUER`/`ID`/`SECRET` | Credenciais Auth0                              |
| `MOCK_SERVER`             | Sem uso no momento, mas mantido no template        |

> Sempre reinicie o dev server após alterar `NEXT_PUBLIC_INSTITUTION`, pois o
> script bloqueante é gerado no lado do servidor.

## Testes

- Use `pnpm test` ou execute apenas o arquivo
  `src/features/theme/__tests__/institution-theme.integration.spec.tsx`.
- O custom `render` em `src/libs/testing/testing-wrapper.tsx` já injeta todos
  os providers (Session, Reshaped, React Query).
- Não existe mais setup de Prism/Strapi; o arquivo `vitest.integration.setup.ts`
  foi removido.

## Quando criar novas features

1. Abra uma pasta em `src/features/<nome>/` com `api/`, `hooks/`, `index.tsx`.
2. Adicione rotas correspondentes dentro de `src/app/`.
3. Continue referenciando o painel `/` para garantir consistência das cores.
4. Atualize `README.md` e este arquivo com qualquer decisão estrutural nova.

Com essas informações você deve conseguir trabalhar no repositório sem tropeçar
em artefatos antigos. Mantemos tudo lean até que o primeiro módulo real entre
em desenvolvimento.
