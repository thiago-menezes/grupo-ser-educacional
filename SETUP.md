# Setup Instructions

## Prerequisites

This project requires:

- **Node.js 22+** (recommended: 22.x, specified in `.nvmrc`)
- **Yarn 4.9.4** (managed via Corepack)

## Quick Setup

1. **Install/Use Node.js 22**:

   ```bash
   # If using nvm (recommended)
   nvm install 22
   nvm use 22

   # Or use the .nvmrc file
   nvm use
   ```

2. **Enable Corepack and setup Yarn 4**:

   ```bash
   corepack enable
   corepack prepare yarn@4.9.4 --activate
   ```

   Or use the setup script:

   ```bash
   yarn setup
   ```

3. **Verify versions**:

   ```bash
   node --version  # Should be v22.x.x or higher
   yarn --version   # Should be 4.9.4
   ```

4. **Install dependencies**:
   ```bash
   yarn install
   ```

## Troubleshooting

### Node version mismatch

If you see `The engine "node" is incompatible`, ensure you're using Node 22:

```bash
nvm use 22
```

### Yarn version mismatch

If you see `The engine "yarn" is incompatible`, enable Corepack:

```bash
corepack enable
corepack prepare yarn@4.9.4 --activate
```

### Corepack not available

Corepack comes with Node.js 16.9+ and is enabled by default in Node.js 18+. If it's not available:

```bash
# Enable it manually
corepack enable
```

## CI/CD Setup

For CI/CD environments, ensure Corepack is enabled:

```yaml
# Example GitHub Actions
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "22"
    enable-corepack: true

- name: Install dependencies
  run: yarn install
```
