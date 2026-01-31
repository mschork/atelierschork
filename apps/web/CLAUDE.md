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
- **Framework**: Next.js 16 with App Router (React 19)
- **CMS**: Sanity (project ID: 4wgg11gp, dataset: production)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Components**: shadcn/ui (Radix primitives + Tailwind)
- **Package Manager**: pnpm

### Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx            # Home - fetches featured projects
├── error.tsx           # Root error boundary
├── loading.tsx         # Root loading state
├── projects/           # Projects listing and detail pages
│   ├── page.tsx
│   ├── error.tsx       # Error boundary
│   ├── loading.tsx     # Loading state
│   └── [id]/
│       ├── page.tsx    # With generateMetadata for SEO
│       ├── error.tsx
│       └── loading.tsx
├── people/             # People listing and detail pages
│   ├── page.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx    # With generateMetadata for SEO
│       ├── error.tsx
│       └── loading.tsx
└── about/              # About page

components/
├── navigation.tsx      # Client-side navigation with mobile menu & keyboard support
├── error-fallback.tsx  # Reusable error UI component
├── loading-spinner.tsx # Reusable loading spinner
├── theme-provider.tsx
└── ui/                 # shadcn/ui components

lib/
├── sanity.client.ts    # Sanity client + image URL helpers
├── sanity.queries.ts   # All GROQ queries with error handling
├── sanity.types.ts     # Type definitions for Sanity content model
└── utils.ts            # cn() utility for Tailwind class merging
```

### Sanity Content Model

The content model is defined in `lib/sanity.types.ts`. Key document types:
- **Person**: Artist/collaborator profiles with bio, CV, exhibitions (unified type with roles)
- **Artwork**: Individual pieces with media, dimensions, pricing
- **Project**: Groups of related work (replaces "Collection")
- **Exhibition**: Events with location, dates, curators

Taxonomy types: Role, MediaType, Technique, Tag, Category

**Note:** The `Artist` type is deprecated - use `Person` with role references instead.

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
- `getAllPeople()`, `getPersonBySlug(slug)` (replaces getAllArtists/getArtistBySlug)
- `getFeaturedProjects(limit)`, `getFeaturedArtworks(limit)`
- `searchContent(term)` - searches across artworks, projects, people

All queries include error handling with `SanityFetchError` class and development logging.

### Error Handling

Each route segment has:
- `error.tsx` - Error boundary that catches fetch failures
- `loading.tsx` - Loading UI shown during data fetching

Reusable components:
- `components/error-fallback.tsx` - Consistent error UI with retry button
- `components/loading-spinner.tsx` - Consistent loading spinner

### SEO & Metadata

Dynamic routes use `generateMetadata` for SEO:
- `projects/[id]/page.tsx` - Project title, description, Open Graph image
- `people/[id]/page.tsx` - Person name, bio excerpt, profile image

### Image Handling

Images are optimized via Next.js with Sanity CDN:
- `next.config.mjs` configures `remotePatterns` for `cdn.sanity.io`
- Use `getImageUrl(source, { width, height })` for optimized URLs

### Navigation

The navigation component (`components/navigation.tsx`) includes:
- Mobile menu with hamburger toggle
- Keyboard support (Escape key closes menu)
- Focus management (focus returns to button on close)
- Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`)

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=4wgg11gp
NEXT_PUBLIC_SANITY_DATASET=production
```

## Conventions

- Pages use dedicated CSS files (e.g., `projects.css`) alongside `page.tsx`
- Use `@/` path alias for imports
- UI components use `cn()` for conditional Tailwind classes
- Error and loading states in `globals.css` (`.error-container`, `.loading-container`)
- Content model documentation: `documentation/atelierschork-contentmodel/`
