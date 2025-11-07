# Grupo SER Frontend

Base em Next.js 15 configurada exclusivamente com o fluxo de tematização
dinâmica do Reshaped. Todo o código legado de artigos, Strapi e Mock Server
foi removido para que o próximo desenvolvimento comece a partir de uma base
limpa orientada pela identidade visual das instituições.

## Stack essencial

- **Next.js 15 (App Router)** + **TypeScript**
- **Reshaped** para componentes e tokens design-system
- **NextAuth (Auth0)** já preparado via `src/libs/auth`
- **React Query + Axios** configurados em `src/libs/api`
- **Vitest + Testing Library** (tests focados em tematização)

## Como rodar

1. Copie `.env.example` para `.env.local` (já existe um arquivo de referência).
2. Defina `NEXT_PUBLIC_INSTITUTION` com o código desejado (`UNINASSAU`, `UNG`,
   etc).
3. Instale dependências: `pnpm install`.
4. Suba o projeto: `pnpm dev`.
5. Acesse `http://localhost:3000` para ver a página de tematização.

> ⚠️ Se alterar `NEXT_PUBLIC_INSTITUTION`, reinicie o servidor para regenerar o
> script de injeção de CSS.

## Estrutura atual

- `src/app/page.tsx` + `page.module.scss`: página única com painel de cores,
  tokens e componentes de referência.
- `src/app/layout.tsx`: injeta o script bloqueante gerado em
  `src/lib/themes/script-generator.ts`.
- `src/components/InstitutionThemeProvider.tsx`: limpa o CSS quando o React
  desmonta a árvore.
- `src/config/institutions.ts`: registro tipado das instituições, helpers e
  validações.
- `src/features/theme/__tests__`: suíte de integração garantindo que as cores,
  tokens e env vars funcionem como esperado.

## Próximos passos sugeridos

1. Clonar um novo feature folder em `src/features/` quando houver um módulo
   real (ex.: matrícula, boletos etc).
2. Consumir `makeQueryClient()` + `query/mutate` para integrar APIs.
3. Manter a página principal como referência visual e adicionar novos fluxos
   em rotas dedicadas.

Com isso o projeto está “cru” e pronto para receber a primeira feature sem
carregar rotas ou dependências que não fazem mais parte do escopo.
