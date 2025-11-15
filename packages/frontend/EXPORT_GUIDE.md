# Export Guide - Barrel Export Pattern

This package uses a **barrel export pattern** to simplify exports and make it easier to add new components, features, and hooks without constantly updating the main `index.ts` file.

## How It Works

Instead of manually exporting everything in `src/index.ts`, we use **barrel files** (index.ts) in each directory that automatically re-export everything from that directory.

## Directory Structure

```
src/
  index.ts                    # Main entry point - just imports from barrels
  components/
    index.ts                  # Barrel: exports all components
    breadcrumb/
      index.tsx               # Component exports itself + types
    course-card/
      index.tsx               # Component exports itself + types
    ...
  features/
    index.ts                  # Barrel: exports all features
    home/
      index.ts                # Barrel: exports all home features
      areas-selector/
        index.tsx             # Feature exports itself + types
    ...
  hooks/
    index.ts                  # Barrel: exports all hooks
    useGeolocation.ts         # Hook exports itself
    ...
  libs/
    index.ts                  # Barrel: exports all libs
    ...
  seo/
    index.ts                  # Already exists, exports SEO utilities
```

## Adding New Components/Features/Hooks

### 1. Create Your Component/Feature/Hook

Create your new file in the appropriate directory:

```typescript
// src/components/my-new-component/index.tsx
export function MyNewComponent() {
  return <div>Hello</div>;
}

export type { MyNewComponentProps } from './types';
```

### 2. Add to the Barrel File

**For Components:**
Add to `src/components/index.ts`:

```typescript
export * from './my-new-component';
```

**For Features:**
Add to `src/features/[feature-group]/index.ts` (or create one):

```typescript
export * from './my-new-feature';
```

Then add to `src/features/index.ts`:

```typescript
export * from './[feature-group]';
```

**For Hooks:**
Add to `src/hooks/index.ts`:

```typescript
export * from './myNewHook';
```

### 3. That's It!

The main `src/index.ts` automatically re-exports everything from the barrel files, so your new component/feature/hook is immediately available:

```typescript
import { MyNewComponent } from '@grupo-ser/frontend';
```

## Benefits

✅ **No need to update main index.ts** - Just add to the appropriate barrel file  
✅ **Organized by category** - Components, features, hooks are grouped  
✅ **Easy to find** - Know where to add exports based on what you're creating  
✅ **Type-safe** - All types are automatically exported  
✅ **Scalable** - Works great as the package grows

## Important Notes

- **Always export types** from component/feature index files:

  ```typescript
  export type { MyComponentProps } from './types';
  ```

- **Use `export *` in barrel files** - This automatically re-exports everything

- **Keep barrel files simple** - They should only contain `export *` statements

- **Internal imports still use relative paths** - Barrel exports are only for the public API
