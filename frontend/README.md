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
2. Instale dependências: `pnpm install`.
3. Suba o projeto: `pnpm dev`.
4. Acesse uma das rotas institucionais:
   - `http://localhost:3000/ung` - UNG
   - `http://localhost:3000/uninassau` - UNINASSAU
   - `http://localhost:3000/uninorte` - UNINORTE
   - `http://localhost:3000/` - Redireciona para a instituição padrão

> **Nota:** A tematização agora funciona por **slug na URL** (`/ung`, `/uninassau`)
> em vez de variável de ambiente. A var `NEXT_PUBLIC_INSTITUTION` ainda funciona
> como fallback legacy, mas não é mais necessária.

## Estrutura atual

- `src/app/[institution]/page.tsx` + `page.module.scss`: página de tematização
  com painel de cores, tokens e componentes de referência.
- `src/app/[institution]/layout.tsx`: valida o slug e injeta o script de tema
  específico da instituição.
- `src/app/page.tsx`: redireciona para a instituição padrão.
- `src/app/layout.tsx`: layout raiz sem lógica de tema (providers gerais).
- `src/components/InstitutionThemeProvider.tsx`: limpa o CSS quando o React
  desmonta a árvore.
- `src/config/institutions.ts`: registro tipado das instituições, helpers e
  validações.
- `src/features/theme/__tests__`: suíte de integração garantindo que as cores,
  tokens e rotas dinâmicas funcionem como esperado.

## Próximos passos sugeridos

1. Clonar um novo feature folder em `src/features/` quando houver um módulo
   real (ex.: matrícula, boletos etc).
2. Adicionar novas rotas dentro de `src/app/[institution]/` para herdar
   automaticamente o tema da instituição.
3. Consumir `makeQueryClient()` + `query/mutate` para integrar APIs.
4. Manter o painel de tematização como referência visual para consistência de cores.

## Adicionar nova instituição

1. Adicione a configuração em `src/config/institutions.ts`:
   ```typescript
   NOVA_INSTITUICAO: {
     name: 'Nome Completo',
     code: 'NOVA_INSTITUICAO',
     primary: '#HEX_COR_PRIMARIA',
     secondary: '#HEX_COR_SECUNDARIA',
   }
   ```
2. Acesse automaticamente via `/nova_instituicao` (lowercase do code)
3. Não precisa criar rotas - o layout dinâmico `[institution]` cuida disso

Com isso o projeto está “cru” e pronto para receber a primeira feature sem
carregar rotas ou dependências que não fazem mais parte do escopo.
