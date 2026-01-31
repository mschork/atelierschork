# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this app.

## Project Overview

This is the Next.js frontend for Atelierschork.com, an art collective portfolio website. It lives in `apps/web/` of the Turborepo monorepo and showcases projects, artworks, and artist profiles for Markus and Francisco Schork.

**Package name:** `@atelierschork/web`

## Commands

From monorepo root:
```bash
pnpm web           # Start dev server (localhost:3000)
pnpm web:build     # Production build
```

From this directory (apps/web):
```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm typecheck     # Type check
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router (React 19)
- **CMS**: Sanity (project ID: 4wgg11gp, dataset: production)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Components**: shadcn/ui (Radix primitives + Tailwind)
- **Package Manager**: pnpm

### Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx            # Home - fetches featured projects
├── projects/           # Projects listing and detail pages
│   ├── page.tsx
│   └── [id]/page.tsx
├── people/             # Artists listing and detail pages
│   ├── page.tsx
│   └── [id]/page.tsx
└── about/              # About page

components/
├── navigation.tsx      # Client-side navigation with mobile menu
├── theme-provider.tsx
└── ui/                 # shadcn/ui components

lib/
├── sanity.client.ts    # Sanity client + image URL helpers
├── sanity.queries.ts   # All GROQ queries with TypeScript types
├── sanity.types.ts     # Type definitions for Sanity content model
└── utils.ts            # cn() utility for Tailwind class merging
```

### Sanity Content Model

The content model is defined in `lib/sanity.types.ts`. Key document types:
- **Artist**: Full artist profiles with bio, CV, exhibitions
- **Person**: Simplified profiles for collaborators/curators
- **Artwork**: Individual pieces with media, dimensions, pricing
- **Project**: Groups of related work (replaces "Collection")
- **Exhibition**: Events with location, dates, curators

Taxonomy types: Role, Medium, Technique, Tag, Category

### Data Fetching Pattern

All Sanity queries are centralized in `lib/sanity.queries.ts`. Pages use async Server Components:

```tsx
export const revalidate = 60  // ISR every 60 seconds

export default async function Page() {
  const data = await getAllProjects()
  return <div>...</div>
}
```

Key query functions:
- `getAllProjects()`, `getProjectBySlug(slug)`
- `getAllArtists()`, `getArtistBySlug(slug)`
- `getFeaturedProjects(limit)`, `getFeaturedArtworks(limit)`
- `searchContent(term)` - searches across artworks, projects, people

### Image Handling

Use helpers from `lib/sanity.client.ts`:
- `urlFor(source)` - returns image URL builder
- `getImageUrl(source, { width, height, quality, format })` - optimized URL
- `getResponsiveImageUrls(source)` - mobile/tablet/desktop sizes

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=4wgg11gp
NEXT_PUBLIC_SANITY_DATASET=production
```

## Conventions

- Pages use dedicated CSS files (e.g., `projects.css`) alongside `page.tsx`
- Use `@/` path alias for imports
- UI components use `cn()` for conditional Tailwind classes
- Content model documentation: `documentation/atelierschork-contentmodel/`
