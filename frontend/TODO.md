# Roadmap imediato

## Estado atual

- ✅ Projeto reduzido para uma única rota (`src/app/page.tsx`) com painel de
  tematização.
- ✅ Injeção de tema V2.1 (script bloqueante no `layout.tsx` +
  `InstitutionThemeProvider` para cleanup).
- ✅ NextAuth, React Query, Axios e Reshaped prontos para uso assim que a
  primeira feature for criada.

## Próximos passos sugeridos

1. **Confirmar paletas oficiais**  
   Os campos `primary`/`secondary` de algumas instituições ainda usam
   placeholders. Atualize `src/config/institutions.ts` com os hex definitivos
   antes de liberar para squads.

2. **Criar a primeira feature real**  
   - Crie uma nova pasta em `src/features/<feature-name>/`.
   - Use `src/libs/api/axios.ts` + React Query para buscar dados.
   - Adicione testes seguindo o padrão de `src/features/theme/__tests__`.

3. **Autenticação / RBAC**  
   Se a primeira feature exigir sessão, implemente o fluxo no App Router usando
   `auth()` (NextAuth) e proteja as rotas com middlewares ou layouts
   específicos.

4. **Documentação contínua**  
   - Atualize `THEMING.md` quando novas instituições/variações surgirem.
   - Registre no README cada feature criada para manter o onboard simples.

5. **Higiene de dependências**  
   Sempre que uma lib deixar de ser usada, remova via `pnpm remove` para
   manter o bundle pequeno. O projeto já está limpo de Strapi/Prism.

Esse arquivo é apenas um guia leve. Use-o como checklist inicial e adapte ao
backlog real da squad.
