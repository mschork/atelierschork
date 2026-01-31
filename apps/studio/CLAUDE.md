# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Sanity Studio.

## Project Overview

This is the Sanity Content Studio for Atelierschork.com. It lives in `apps/studio/` of the Turborepo monorepo and provides the content management interface for managing projects, artworks, people, exhibitions, and more.

**Package name:** `@atelierschork/studio`

## Commands

From monorepo root:
```bash
pnpm studio           # Start dev server (localhost:3333)
pnpm studio:build     # Build for production
pnpm studio:deploy    # Deploy to Sanity's hosted studio
```

From this directory (apps/studio):
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm deploy           # Deploy to Sanity's hosted studio
pnpm deploy-graphql   # Deploy GraphQL API
pnpm typecheck        # Type check
```

## Configuration

**Key files:**
- `sanity.config.ts` - Main Studio configuration with plugins and schema
- `sanity.cli.ts` - CLI configuration with project ID, dataset, and deployment settings
- `deskStructure.ts` - Custom desk organization

**Sanity Project:**
- Project ID: `4wgg11gp`
- Dataset: `production`
- Studio host: `atelierschork`

## Schema Architecture

All schema types are in `schemaTypes/`:

### Document Types

**Main Content:**
- `person.ts` - Artists, curators, collaborators (with role references)
- `artwork.ts` - Individual artworks with multi-artist and multi-media support
- `project.ts` - Project groupings with creators and collaborators
- `exhibition.ts` - Exhibitions with dates, location, artwork references
- `award.ts` - Awards and recognition

**Taxonomies:**
- `mediaType.ts` - Art media types (Photography, Film, Installation, etc.)
- `technique.ts` - Artistic techniques
- `tag.ts` - General tagging
- `category.ts` - Hierarchical categorization
- `role.ts` - Person roles (Artist, Curator, etc.)
- `projectType.ts` - Project types (Art, Logo Design, Website Design, etc.)

**Places:**
- `location.ts` - Physical locations for exhibitions/artworks
- `locationType.ts` - Types of locations (Gallery, Museum, etc.)

**Settings:**
- `siteSettings.ts` - Singleton for global site configuration

**Deprecated:**
- `medium.ts` - Legacy schema, use `mediaType` instead

### Schema Conventions

**Field Groups:**
Each major document type uses field groups:
- `basic` - Core identifying fields
- `details` / `bio` / `professional` - Detailed information
- `media` - Images, videos, galleries
- `taxonomy` / `classification` - Tags and categorization

**Reference Patterns:**
- Array references for many-to-many (e.g., `artists` on artwork)
- Single references for one-to-one (e.g., `projectType` on project)

**Media Objects:**
Artworks support flexible media with union types:
- `imageMedia` - Images with caption, altText, isPrimary flag
- `videoMedia` - Video file uploads
- `vimeoMedia` - Vimeo URL embeds
- `youtubeMedia` - YouTube URL embeds

**Previews:**
All documents define custom previews. Only select fields that are used in `prepare()`:
```typescript
preview: {
  select: {
    honorific: 'title',
    firstName: 'firstName',
    // ... only fields used in prepare()
  },
  prepare(selection) {
    // Use all selected fields
  },
}
```

## Desk Structure

Custom desk structure in `deskStructure.ts`:

**Work Section:**
- Projects (all projects)
- Dynamic project type lists (fetched at runtime)
- Artworks
- Exhibitions
- Awards

**People Section:**
- People
- Roles

**Taxonomies Section:**
- Media Types, Techniques, Tags, Categories
- Project Types
- Locations, Location Types

**Website Settings:**
- Site Settings (singleton with fixed ID `siteSettings`)

## Migrations

Migration files in `migrations/`:
```bash
npx sanity migration run <migration-name>
```

**Important migrations:**
- Person/Artist consolidation (see migration files for details)
- Medium → MediaType migration (pending)

## Environment Variables

Required in `.env.local`:
```
SANITY_STUDIO_PROJECT_ID=4wgg11gp
SANITY_STUDIO_DATASET=production
```

## Icons

All document types use react-icons/bs (Bootstrap icons) for visual identification:
```typescript
import {BsPerson} from 'react-icons/bs'

export default defineType({
  icon: BsPerson,
  // ...
})
```
