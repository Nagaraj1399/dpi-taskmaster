# Contributing to CivicPulse BRICS

Thank you for your interest in contributing to **CivicPulse BRICS**. This project follows Digital Public Good (DPG) standards for transparency, honesty in telemetry, strict type safety, and accessibility.

## Prerequisites

- **Bun** `>= 1.2` (primary package manager and script runner matching `bun.lock`)
- **Node.js** `22.x` (runtime / tooling compatibility)
- A Google Gemini API key (`GEMINI_API_KEY`) for testing live AI fusion and vision endpoints locally (unit tests run offline with mocks)

## Local Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-org/civicpulse-brics.git
   cd civicpulse-brics
   ```
2. Install dependencies cleanly from the lockfile:
   ```bash
   bun install --frozen-lockfile
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY if testing live Gemini routes
   ```
4. Start the development server:
   ```bash
   bun run dev
   ```

## Engineering & Quality Standards

All pull requests are automatically checked by GitHub Actions (`.github/workflows/ci.yml`). Before opening a PR, please ensure all checks pass locally:

```bash
# ESLint (typescript-eslint, react-hooks, jsx-a11y) + strict tsc --noEmit
bun run lint

# Prettier code formatting check
bunx prettier --check .

# Vitest unit, integration, and React Testing Library tests with V8 coverage
bun run test:coverage

# Production client (Vite) and server (esbuild) build
bun run build
```

### Codebase Rules

- **TypeScript Strictness**: No `any` types (`@typescript-eslint/no-explicit-any: error`), `strict: true`, `noUncheckedIndexedAccess: true`, and `noUnusedLocals: true` are enforced.
- **Validation & Honesty**: Every API request body and parsed AI response must be validated with Zod (`src/shared/schemas.ts`). Never return synthetic or fabricated verification status on failure.
- **Secrets Hygiene**: Keep `GEMINI_API_KEY` and any external dataset credentials strictly server-side (`process.env`). Never expose private keys via `VITE_*` variables.
- **Accessibility**: Interactive modals and tabs must use the Radix UI primitives in `src/components/ui/` with associated `<label>` elements, `aria-live` status regions, and keyboard navigation.
- **Documentation**: Add JSDoc comments to exported components, hooks, services, and route handlers, and update `docs/API.md` when modifying API contracts.
