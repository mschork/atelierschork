# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** for Atelierschork.com, an artistic collaboration between Francisco and Markus Schork. The project includes a Sanity Content Studio and a Next.js frontend.

## Repository Structure

```
atelierschork/
├── apps/
│   ├── studio/                    # Sanity Content Studio
│   │   ├── sanity.config.ts       # Studio configuration
│   │   ├── sanity.cli.ts          # CLI configuration
│   │   ├── deskStructure.ts       # Custom desk structure
│   │   ├── schemaTypes/           # Content schemas
│   │   ├── migrations/            # Data migrations
│   │   └── static/                # Static assets
│   └── web/                       # Next.js Frontend
│       ├── app/                   # Next.js App Router pages
│       ├── components/            # React components (shadcn/ui)
│       ├── lib/                   # Sanity client, queries, types
│       ├── styles/                # Global styles
│       └── public/                # Static assets
├── packages/
│   ├── typescript-config/         # Shared TypeScript configs
│   └── eslint-config/             # Shared ESLint configs
├── documentation/                 # Content model documentation
├── turbo.json                     # Turborepo task configuration
├── pnpm-workspace.yaml            # pnpm workspace definition
└── package.json                   # Root workspace config
```

## Package Manager

This project uses **pnpm** (not npm). Install with `npm install -g pnpm` if needed.

## Common Commands

### Root-Level Commands (from project root)
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all apps
pnpm lint                 # Lint all packages
pnpm typecheck            # Type check all packages
pnpm studio               # Start Sanity Studio dev server (localhost:3333)
pnpm studio:build         # Build Studio for production
pnpm studio:deploy        # Deploy to Sanity's hosted studio
pnpm web                  # Start Next.js dev server (localhost:3000)
pnpm web:build            # Build Next.js for production
```

### Studio-Specific Commands (from apps/studio)
```bash
pnpm dev                  # Start dev server (localhost:3333)
pnpm build                # Build production studio
pnpm deploy               # Deploy to Sanity's hosted studio
pnpm deploy-graphql       # Deploy GraphQL API
```

### Web-Specific Commands (from apps/web)
```bash
pnpm dev                  # Start dev server (localhost:3000)
pnpm build                # Build production Next.js app
pnpm start                # Start production server
pnpm lint                 # Run ESLint
pnpm typecheck            # Type check
```

### Migrations (from apps/studio)
```bash
npx sanity migration run <migration-name>
```

Migrations are located in `apps/studio/migrations/` directory.

## Environment Setup

### Required Environment Variables

Navigate to `apps/studio/` and create `.env.local` from `.env.local.example`:

```bash
cd apps/studio
cp .env.local.example .env.local
```

Required variables:
- `SANITY_STUDIO_PROJECT_ID` - Your Sanity project ID
- `SANITY_STUDIO_DATASET` - Dataset name (e.g., 'production', 'development')

For the web app (`apps/web/.env.local`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Same Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Same dataset name

## Schema Architecture

### Core Content Model

All schema types are defined in `apps/studio/schemaTypes/`:

**Main Content Documents:**
- `person` - Artists, curators, collaborators (with role references)
- `artwork` - Individual artworks with multi-artist and multi-media support
- `project` - Project groupings with creators and collaborators
- `exhibition` - Exhibitions with structured dates, location, and artwork references
- `award` - Awards and recognition

**Taxonomy Documents:**
- `mediaType` - Art media types (Photography, Film, Installation, etc.)
- `technique` - Artistic techniques
- `tag` - General tagging
- `category` - Categorization
- `role` - Person roles (Artist, Curator, etc.)
- `projectType` - Project types (Art, Logo Design, Website Design, Application, etc.)

**Place Documents:**
- `location` - Physical locations for exhibitions/artworks
- `locationType` - Types of locations

**Settings:**
- `siteSettings` - Singleton for global site configuration

### Schema Organization

- Each document type has its own file (e.g., `person.ts`, `artwork.ts`)
- `index.ts` exports all schemas as `schemaTypes` array
- Legacy fields exist for migrations (e.g., `medium` → `mediaType`)

### Important Schema Conventions

**Field Groups:**
Each major document type uses field groups for organization:
- `basic` - Core identifying fields
- `details` / `bio` / `professional` - Detailed information
- `media` - Images, videos, galleries
- `taxonomy` / `classification` - Tags and categorization

**Reference Patterns:**
- Use array of references for many-to-many relationships
- `artists` field on artwork is array of person references
- `mediaType` field on artwork is array of mediaType references
- Single references for one-to-one relationships
- `projectType` field on project is a single projectType reference

**Media Handling:**
Artworks support flexible media with union types:
- `imageMedia` - Image objects with caption, altText, isPrimary flag
- `videoMedia` - Video file uploads
- `vimeoMedia` - Vimeo URL embeds
- `youtubeMedia` - YouTube URL embeds

Each media type has a hidden `mediaType` discriminator field.

**Icons:**
All document types use react-icons/bs (Bootstrap icons) for visual identification in the Studio UI.

## Desk Structure

Custom desk structure is defined in `apps/studio/deskStructure.ts` using **section titles** via `S.divider().title()`:

**Work** (section title)
- Projects - All projects in one list
- [Dynamic] Project type lists - Each project type appears as its own list (e.g., "🎨 Art", "🎨 Logo Design")
- Artworks - Individual artworks with multi-artist and multi-media support
- Exhibitions - Past, current, and upcoming exhibitions
- Awards - Awards and recognition

**People** (section title)
- People - Artists, curators, collaborators with role references
- Roles - Person roles (Artist, Curator, etc.)

**Taxonomies** (section title)
- Media Types - Art media types (Photography, Film, Installation, etc.)
- Techniques - Artistic techniques
- Tags - General tagging system
- Categories - Content categorization
- Project Types - Project types (Art, Logo Design, Website Design, Application, etc.)
- Locations - Physical locations for exhibitions/artworks
- Location Types - Types of locations (Gallery, Museum, etc.)

**Website Settings** (section title)
- Site Settings - Singleton document with fixed ID `siteSettings`

### Dynamic Structure Pattern

**Project type lists** are dynamically generated by fetching project types and creating list items:

```typescript
const deskStructure: StructureResolver = async (S, context) => {
  // Fetch all project types
  const projectTypes = await context
    .getClient({apiVersion: '2024-01-01'})
    .fetch(`*[_type == "projectType"] | order(title asc) {_id, title, icon}`)

  return S.list()
    .title('Content')
    .items([
      S.divider().title('Work'),
      S.listItem().title('Projects')...,

      // Map over project types to create individual list items
      ...projectTypes.map((type) =>
        S.listItem()
          .title(`${type.icon || '📁'} ${type.title}`)
          .child(
            S.documentList()
              .title(`${type.title} Projects`)
              .filter('_type == "project" && projectType._ref == $typeId')
              .params({typeId: type._id})
          )
      ),
    ])
}
```

## Important Migration Context

**Person vs Artist Schema:**
The project previously had separate `artist` and `person` schemas but consolidated to a single `person` schema with role references. Migration files exist in `apps/studio/migrations/` to handle this transition.

**Legacy Schemas:**
- `medium` schema is **deprecated** - use `mediaType` instead
  - Schema file has `deprecated` metadata and "(Deprecated)" in title
  - Hidden from desk structure but kept for data compatibility
  - See `apps/studio/schemaTypes/medium.ts` for migration instructions
- Comments in schema files indicate migration paths
- Check `/documentation/atelierschork-contentmodel/` for the original content model specification

## Documentation

Comprehensive content model documentation exists in `/documentation/atelierschork-contentmodel/`:
- `README.md` - Overview and navigation
- `content-model.md` - Complete specification of all document types
- `sample-data.md` - Example data and GROQ queries
- `implementation-guide.md` - Technical implementation details

## Code Style

**Prettier configuration** (from root package.json):
```json
{
  "semi": false,
  "printWidth": 100,
  "bracketSpacing": false,
  "singleQuote": true
}
```

No semicolons, single quotes, no bracket spacing, 100 char line width.

## Schema Validation Patterns

**Common validations:**
- Year fields: `Rule.integer().min(1900).max(new Date().getFullYear() + 1)`
- Required fields: `validation: (Rule) => Rule.required()`
- URLs: `Rule.uri({scheme: ['https'], allowRelative: false})`
- Custom validation with context access for cross-field rules

**Example of cross-field validation** (project.ts):
```typescript
validation: (Rule) => Rule.custom((endYear, context) => {
  const startYear = (context.document as any)?.startYear
  if (endYear && startYear && endYear < startYear) {
    return 'End year must be equal to or after start year'
  }
  return true
})
```

## Preview Configuration

**All documents define custom previews** with:
- `select` - Fields to extract for preview
- `prepare` - Function to format preview display

**Important:** Only select fields that are actually used in `prepare()` to avoid unused variable warnings.

Common pattern for person names:
```typescript
prepare(selection) {
  const {honorific, firstName, middleName, lastName, role0, media, isCoreArtist} = selection

  // Format name as: Dr. First M. Last
  let formattedName = ''
  if (honorific) {
    formattedName = honorific + ' '
  }
  formattedName += firstName || ''
  if (middleName && middleName.length > 0) {
    formattedName += ` ${middleName.charAt(0)}.`
  }
  if (lastName) {
    formattedName += ` ${lastName}`
  }

  // Build subtitle with role and core artist indicator
  const subtitle = [role0, isCoreArtist ? '⭐ Core Artist' : null]
    .filter(Boolean)
    .join(' • ')

  return {title: formattedName.trim(), subtitle, media}
}
```

## Working with Migrations

Migrations use the Sanity migration framework and are TypeScript files in `apps/studio/migrations/`.

**Migration execution (from apps/studio):**
```bash
npx sanity migration run <migration-name>
```

**Common migration patterns:**
- Backup data before structural changes
- Update references when document types change
- Fix reference arrays after schema modifications
- Migrate legacy field names to new conventions

## Key Architecture Decisions

1. **Turborepo monorepo** - Unified build system with shared configurations
2. **pnpm workspaces** - Efficient dependency management across packages
3. **Flexible artist attribution** - Artworks support multiple artists via array references
4. **Multi-media support** - Artworks can have multiple media types simultaneously
5. **Role-based person schema** - Single `person` type with role references instead of separate artist/curator types
6. **Grouped fields** - All major schemas use field groups for UX organization
7. **Singleton settings** - Site settings is a singleton document with fixed ID
8. **Custom desk structure** - Organized by content type with dividers and icons for clarity

## Studio Configuration

**Key files (in apps/studio/):**
- `sanity.config.ts` - Main Studio configuration with plugins and schema
- `sanity.cli.ts` - CLI configuration with project ID, dataset, and deployment settings
- `deskStructure.ts` - Custom desk organization

**Plugins in use:**
- `structureTool` - Custom desk structure
- `visionTool` - GROQ query testing

**Deployment:**
- Studio host: `atelierschork`
- App ID: `yzxbkxz7w1hhvsngvy4s1gsz`
- Auto-updates: enabled

## Shared Packages

### @atelierschork/typescript-config
Shared TypeScript configurations:
- `base.json` - Base configuration for all packages
- `sanity.json` - Sanity-specific TypeScript settings

### @atelierschork/eslint-config
Shared ESLint configurations:
- `sanity.mjs` - ESLint config for Sanity Studio

## Web App Architecture

The Next.js frontend lives in `apps/web/` (package: `@atelierschork/web`).

**Tech Stack:**
- Next.js 16 with App Router (React 19)
- Tailwind CSS with CSS variables for theming
- shadcn/ui (Radix primitives + Tailwind)
- Sanity client for data fetching

**Key Directories:**
- `app/` - Next.js App Router pages (projects, people, about)
- `components/` - React components including shadcn/ui
- `lib/` - Sanity client, GROQ queries, TypeScript types
- `styles/` - Global CSS styles

**Data Fetching:**
All Sanity queries are centralized in `lib/sanity.queries.ts`. Pages use async Server Components with ISR:
```tsx
export const revalidate = 60  // ISR every 60 seconds

export default async function Page() {
  const data = await getAllProjects()
  return <div>...</div>
}
```

Queries include error handling with `SanityFetchError` class and development logging.

**Error Handling:**
Each route segment has `error.tsx` and `loading.tsx` files for graceful error recovery and loading states. Reusable components in `components/error-fallback.tsx` and `components/loading-spinner.tsx`.

**SEO:**
Dynamic routes use `generateMetadata` for proper Open Graph and Twitter card metadata.

**Accessibility:**
Navigation includes keyboard support (Escape key), focus management, and proper ARIA attributes.

**shadcn/ui:**
Component configuration in `components.json`. Uses `@/` path alias.

See `apps/web/CLAUDE.md` for more detailed frontend documentation.

Always update this CLAUDE.md file with relevant information after changes to the codebase.
