# Migration Guide: Yarn Workspaces + TurboRepo

This repository has been converted to a monorepo using **Yarn 4 (Berry)** and **TurboRepo**.

## Prerequisites

- **Node.js 22.x** (run `node -v` to check)
- **Corepack** enabled (comes with Node.js 16.10+)

## Migration Steps

### 1. Enable Corepack (if not already enabled)

```bash
corepack enable
```

### 2. Remove old lock files and node_modules

```bash
# From the repository root
rm -rf node_modules
rm -rf cms/node_modules cms/package-lock.json
rm -rf frontend/node_modules frontend/pnpm-lock.yaml
```

### 3. Install Yarn 4

Corepack will automatically use the version specified in `package.json` (`yarn@4.9.4`). No manual installation needed!

### 4. Install dependencies

```bash
yarn install
```

This will install dependencies for all workspaces (root, cms, and frontend).

**Note**: Corepack will automatically download and use Yarn 4.9.4 as specified in `package.json`.

### 5. Verify installation

```bash
yarn --version  # Should show 4.9.4
node -v         # Should show 22.x.x
```

## Project Structure

```
grupo-ser/
├── package.json          # Root workspace config
├── turbo.json           # TurboRepo pipeline config
├── .yarnrc.yml          # Yarn 4 configuration
├── .nvmrc               # Node version (22)
├── cms/                 # Strapi workspace
│   ├── package.json
│   └── .nvmrc
└── frontend/            # Next.js workspace
    ├── package.json
    └── .nvmrc
```

## Available Commands

### Root-level commands (run from repository root):

```bash
# Development
yarn dev                 # Run both cms and frontend in dev mode
yarn dev:cms            # Run only cms
yarn dev:frontend       # Run only frontend

# Building
yarn build              # Build all workspaces
yarn build:cms          # Build only cms
yarn build:frontend     # Build only frontend

# Production
yarn start              # Start all workspaces in production mode
yarn start:cms          # Start only cms
yarn start:frontend     # Start only frontend

# Quality checks
yarn lint               # Lint all workspaces
yarn typecheck          # Type-check all workspaces
yarn test               # Test all workspaces

# Cleanup
yarn clean              # Clean all build artifacts
```

### Workspace-specific commands:

```bash
# Run commands in specific workspace
yarn workspace cms dev
yarn workspace frontend test

# Or cd into workspace and run directly
cd cms && yarn dev
cd frontend && yarn test
```

## TurboRepo Benefits

TurboRepo provides:

1. **Intelligent caching**: Builds and tasks are cached and never recomputed
2. **Parallel execution**: Tasks run in parallel across workspaces
3. **Dependency awareness**: Tasks run in the correct order based on dependencies
4. **Remote caching**: (Optional) Share cache across team/CI

### Cache behavior:

- `dev` and `start`: No caching (persistent tasks)
- `build`, `lint`, `typecheck`, `test`: Fully cached
- Caching is based on file inputs, not time

## Node Version Management

All workspaces use **Node.js 22**. The `.nvmrc` files ensure consistency.

If using `nvm`:

```bash
nvm use  # In any directory (reads nearest .nvmrc)
```

If using `fnm`:

```bash
fnm use  # In any directory
```

## Yarn Workspaces

Dependencies are hoisted to the root `node_modules` when possible, with workspace-specific dependencies installed locally.

### Adding dependencies:

```bash
# To a specific workspace
yarn workspace cms add package-name
yarn workspace frontend add -D package-name

# To root (dev tools shared across workspaces)
yarn add -D package-name -W
```

### Removing dependencies:

```bash
yarn workspace cms remove package-name
```

## Environment Variables

Each workspace maintains its own `.env` files:

- `cms/.env` - Strapi configuration
- `frontend/.env.local` - Next.js configuration

## Troubleshooting

### Issue: `yarn: command not found`

**Solution**: Enable Corepack:

```bash
corepack enable
```

### Issue: Wrong Node version

**Solution**: Use Node 22:

```bash
nvm install 22
nvm use 22
```

### Issue: Dependency resolution errors

**Solution**: Clear cache and reinstall:

```bash
yarn cache clean
rm -rf node_modules cms/node_modules frontend/node_modules
yarn install
```

### Issue: TurboRepo cache issues

**Solution**: Clear Turbo cache:

```bash
yarn turbo clean
rm -rf .turbo
```

## CI/CD Considerations

### GitHub Actions example:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22

- name: Enable Corepack
  run: corepack enable

- name: Install dependencies
  run: yarn install --immutable

- name: Build
  run: yarn build

- name: Test
  run: yarn test
```

### Docker example:

```dockerfile
FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

COPY . .

RUN yarn build
```

## Key Differences from Previous Setup

| Aspect | Before | After |
|--------|--------|-------|
| CMS package manager | npm | Yarn 4 |
| Frontend package manager | pnpm | Yarn 4 |
| Monorepo tool | None | TurboRepo |
| Lock files | `package-lock.json`, `pnpm-lock.yaml` | `yarn.lock` |
| Node version | Mixed (18-22, 24) | Standardized (22) |
| Workspace management | Separate | Unified |

## Resources

- [Yarn 4 Documentation](https://yarnpkg.com/)
- [TurboRepo Documentation](https://turbo.build/repo/docs)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [TurboRepo Caching](https://turbo.build/repo/docs/core-concepts/caching)

## Questions?

Check the documentation links above or review the configuration files:
- `package.json` (root) - Workspace and script configuration
- `turbo.json` - Pipeline and caching configuration
- `.yarnrc.yml` - Yarn-specific settings

