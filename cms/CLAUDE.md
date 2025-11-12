# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Strapi 5.29.0** CMS application for Grupo SER. Strapi is a headless CMS that provides both an admin panel and a REST/GraphQL API for managing content.

### Multi-Tenant Architecture

This CMS manages content for **7 different educational institutions** within Grupo SER. The architecture uses a single Strapi instance with institution-scoped content:

- **Institution Model**: Base entity representing each educational institution (with slug, code, branding)
- **Content Filtering**: Frontend applications filter content by institution using environment variables
- **Shared Components**: All institutions share the same component library but have institution-specific content

## Development Commands

### Running the application
```bash
yarn dev:cms         # Start with hot-reload (development) - from root
yarn develop         # Start with hot-reload (development) - from cms directory
yarn start:cms       # Start in production mode (no hot-reload) - from root
yarn start           # Start in production mode (no hot-reload) - from cms directory
yarn build:cms       # Build the admin panel - from root
yarn build           # Build the admin panel - from cms directory
```

### Database seeding
```bash
yarn workspace cms seed:example # Seed database with example data from data/data.json
```

### Strapi CLI
```bash
yarn workspace cms strapi       # Access Strapi CLI
yarn workspace cms console      # Open Strapi console
yarn workspace cms deploy       # Deploy to Strapi Cloud
```

### Upgrades
```bash
yarn workspace cms upgrade      # Upgrade Strapi to latest version
yarn workspace cms upgrade:dry  # Check what would be upgraded
```

## Architecture

### Database Configuration
- **Default:** SQLite (stored in `.tmp/data.db`)
- **Supported:** MySQL, PostgreSQL, SQLite
- Database client is configured via `DATABASE_CLIENT` environment variable
- All database configuration is in [config/database.ts](config/database.ts)
- Connection pooling is configurable via environment variables

### Content Type Structure

This project follows Strapi's standard architecture:

**API Endpoints** (`src/api/`):
Each content type has a dedicated folder with:
- `content-types/`: Schema definitions (JSON)
- `controllers/`: Request handlers (uses Strapi factories)
- `services/`: Business logic (uses Strapi factories)
- `routes/`: API route definitions

**Content Types:**

*Multi-Tenant Core:*
- `institution`: Educational institutions (7 total) with slug, code, branding (logo, colors), active status
- `course`: Academic courses with detailed info (price, curriculum, sector, level, modality, workload) - **many-to-one** relation to institution
- `page-content`: Flexible page content blocks categorized by section (home-hero, about-mission, etc) - **many-to-one** relation to institution

*Legacy Blog Example:*
- `article`: Blog articles with dynamic blocks (media, quotes, rich-text, sliders), relations to author/category, draft/publish workflow
- `author`: Article authors with avatars and email
- `category`: Article categories with descriptions
- `about`: Single-type page with dynamic blocks
- `global`: Single-type for site-wide settings (SEO, favicon)

**Shared Components** (`src/components/shared/`):
- `media`: Single media upload component
- `quote`: Text quote with title and body
- `rich-text`: Rich text editor content
- `slider`: Multiple image slider
- `seo`: SEO metadata (used in global settings)

### Dynamic Zones

Articles and About page use Strapi's **dynamic zones** (`blocks` field) allowing flexible content composition with any combination of shared components.

### Application Lifecycle

The main entry point is [src/index.ts](src/index.ts), which exports:
- `register()`: Runs before app initialization for extending Strapi
- `bootstrap()`: Runs before app start for setup logic

### Admin Panel Customization

Admin panel customization files are in `src/admin/`:
- `app.example.tsx`: Example admin panel customizations
- `vite.config.example.ts`: Example Vite config for admin builds
- Admin panel is built separately from the server

### Environment Variables

Copy `.env.example` to `.env` and configure:
- `HOST`, `PORT`: Server configuration
- `APP_KEYS`: Application encryption keys (array)
- `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`: Security tokens
- `ENCRYPTION_KEY`: Data encryption key
- Database configuration variables (see [config/database.ts](config/database.ts))

### TypeScript Configuration

- **Target:** ES2019, **Module:** CommonJS
- Output directory: `dist/`
- Excludes: `node_modules/`, `dist/`, `.cache/`, `.tmp/`, `src/admin/`, test files, plugins
- Strict mode is **disabled** (Strapi convention)

## Key Development Patterns

### Creating Content Types

Use Strapi CLI or admin panel to generate:
```bash
yarn workspace cms strapi generate
```

Controllers, services, and routes use Strapi's factory pattern:
```typescript
// Controller
export default factories.createCoreController('api::article.article');

// Service
export default factories.createCoreService('api::article.article');
```

### Customizing Controllers/Services

Extend factory methods to add custom logic:
```typescript
export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    // Custom logic
    return super.find(ctx);
  }
}));
```

### Seeding Data

The seed script ([scripts/seed.js](scripts/seed.js)):
- Loads data from `data/data.json`
- Uploads files from `data/uploads/`
- Sets public permissions for content types
- Only runs on first execution (tracked in plugin store)
- Handles media uploads and dynamic zone content

### Relations

Relations are defined in schema.json:
- `manyToOne`: Many articles to one author/category
- `oneToMany`: One author/category to many articles
- Use `inversedBy` and `mappedBy` for bidirectional relations

### Draft & Publish

Enabled on articles via `"draftAndPublish": true` in schema. Content must be explicitly published (set `publishedAt` field).

## Multi-Tenant Query Patterns

### Frontend Integration

Frontend applications should:

1. **Set institution in ENV**:
   ```env
   INSTITUTION_SLUG=faculdade-exemplo
   # or
   INSTITUTION_CODE=FEX
   ```

2. **Filter API queries by institution**:
   ```javascript
   // Get all courses for an institution
   GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo&populate=*

   // Get home hero content for an institution
   GET /api/page-contents?filters[institution][slug][$eq]=faculdade-exemplo&filters[category][$eq]=home-hero&populate=*

   // Get featured courses for an institution
   GET /api/courses?filters[institution][slug][$eq]=faculdade-exemplo&filters[featured][$eq]=true&populate=*
   ```

3. **Use institution branding**:
   ```javascript
   // Get institution details including logo and colors
   GET /api/institutions?filters[slug][$eq]=faculdade-exemplo&populate=logo
   ```

### Page Content Categories

The `page-content` type uses predefined categories for organizing content:
- `home-hero`: Hero section for homepage
- `home-about`: About section on homepage
- `home-courses`: Courses showcase section
- `home-testimonials`: Student testimonials
- `home-cta`: Call-to-action sections
- `about-hero`: About page hero
- `about-mission`: Mission/vision content
- `about-team`: Team member profiles
- `contact-info`: Contact information blocks
- `footer`: Footer content
- `custom`: For additional flexible content

Each institution creates its own content for these categories. Use the `order` field to control display sequence within a category.

### Course Schema Details

**Enumerations:**
- `sector`: saude, tecnologia, gestao, educacao, direito, engenharia, outros
- `level`: tecnico, graduacao, pos-graduacao, extensao, curso-livre
- `modality`: presencial, ead, hibrido

**Key Fields:**
- `curriculum`: Rich text for detailed course structure/syllabus
- `workload`: Integer for total hours
- `enrollmentOpen`: Boolean to control visibility of enrollment CTAs
- `featured`: Boolean to highlight popular courses

## Important Notes

- Strapi automatically generates REST and GraphQL APIs from content types
- The admin panel runs on the same port as the API (default: 1337)
- First run requires creating an admin user via the admin panel
- File uploads are managed by Strapi's upload plugin
- User authentication is handled by the users-permissions plugin
