# Atelier Schork

Monorepo for Atelier Schork, an artistic collaboration between Francisco and Markus Schork.

## Project Structure

```
atelierschork/
├── apps/
│   ├── studio/          # Sanity Content Studio
│   └── web/             # Frontend (coming soon)
├── packages/
│   ├── typescript-config/  # Shared TypeScript configurations
│   └── eslint-config/      # Shared ESLint configurations
├── documentation/       # Content model and project documentation
└── turbo.json           # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+ (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start Sanity Studio development server
pnpm studio
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm studio` | Start Sanity Studio dev server |
| `pnpm studio:build` | Build Sanity Studio for production |
| `pnpm studio:deploy` | Deploy Sanity Studio to Sanity's hosted service |
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run linting across all packages |
| `pnpm typecheck` | Run TypeScript type checking |

## Apps

### Studio (`apps/studio`)

Sanity Content Studio for managing artworks, projects, exhibitions, people, awards, and related content.

**Environment Setup:**

```bash
cd apps/studio
cp .env.local.example .env.local
# Edit .env.local with your Sanity project credentials
```

**Required Variables:**
- `SANITY_STUDIO_PROJECT_ID`: Your Sanity project ID
- `SANITY_STUDIO_DATASET`: Dataset name (e.g., 'production', 'development')

### Web (`apps/web`)

Frontend application (coming soon).

## Documentation

See the `/documentation` directory for:
- Content model specification
- Sample data and GROQ queries
- Implementation guides

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
