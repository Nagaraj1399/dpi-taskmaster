# CivicPulse BRICS — AI for Digital Public Infrastructure & Governance

CivicPulse BRICS is a multi-jurisdictional Digital Public Good (DPG) governance platform for the 11 BRICS+ nations (`BR`, `RU`, `IN`, `CN`, `ZA`, `EG`, `ET`, `IR`, `SA`, `AE`, `ID`). It pairs multimodal citizen grievance intake (Voice IVR, messaging, web portals, and infrastructure photo inspection) with official demographic, infrastructure, and capital-budget baselines to compute deterministic gap scores and Gemini-grounded policy recommendations.

---

## 1. Architecture Overview

```text
├── server.ts                        # Node HTTP bootstrap & dev-only Vite middleware
├── src/
│   ├── shared/                      # Isomorphic domain models, constants, Zod schemas, scoring
│   │   ├── constants.ts             # Named operational constants & allowlists
│   │   ├── types.ts                 # Shared TypeScript interfaces
│   │   ├── schemas.ts               # Zod validation & prototype-pollution key checks
│   │   ├── scoring.ts               # Deterministic sector baseline & gap-severity math
│   │   └── bricsData.ts             # 11 sovereign BRICS+ baseline datasets & sample grievances
│   ├── server/                      # Express backend modules
│   │   ├── app.ts                   # Express factory (Helmet, CORS, routes, 404, error handler)
│   │   ├── config.ts                # Fail-fast Zod environment validation
│   │   ├── errors.ts                # Typed HTTP error hierarchy (400/404/422/502/503)
│   │   ├── logger.ts                # Structured JSON logger (debug/info/warn/error)
│   │   ├── middleware/              # validateBody, createAiRateLimiter, errorHandler
│   │   ├── routes/                  # health, brics, fusion, vision, voice routers
│   │   └── services/                # ai (Gemini fallback ladder), fusion, verification (SHA-256 + SSRF)
│   └── components/                  # React 19 UI + Radix primitives + custom hooks
│       ├── ui/                      # Radix Dialog, Tabs, Slider, DropdownMenu & shared style tokens
│       ├── citizen-ingestion/       # Voice recorder, IVR dialpad, photo vision triage, grievance form
│       ├── data-fusion/             # Pipeline steps, pillars grid, provenance & audit card
│       ├── dataset-studio/          # Modal, 6 schema tabs, presets, JSON IO, API verification hook
│       ├── datasets-explorer/       # Official repository cards & quick API verification hook
│       └── submission-package/      # Evaluation checklist, 12-slide pitch deck, demo script
└── docs/API.md                      # REST API request/response contracts and error codes
```

### Verification & Honesty Guarantees

- **No fabricated telemetry**: External REST API checks (`POST /api/datasets/verify-and-sync`) execute SSRF-checked HTTP probes and block persistence (`HTTP 422`) if any schema or endpoint check fails.
- **Reproducible SHA-256 seals**: Digests are generated deterministically via `crypto.createHash('sha256')` over sorted canonical JSON payloads.
- **Explicit AI error states**: Missing `GEMINI_API_KEY` returns `503 AI_SERVICE_UNAVAILABLE` and upstream failures return `502 UPSTREAM_AI_ERROR` rather than synthetic fallback results.

---

## 2. Environment Variables

Copy `.env.example` to `.env` before running locally:

| Variable                 | Required            | Default                  | Description                                                          |
| :----------------------- | :------------------ | :----------------------- | :------------------------------------------------------------------- |
| `PORT`                   | No                  | `3000`                   | HTTP port bound by `server.ts` (`1`–`65535`).                        |
| `NODE_ENV`               | No                  | `development`            | `development`, `production`, or `test`.                              |
| `LOG_LEVEL`              | No                  | `info`                   | Structured logger threshold: `debug`, `info`, `warn`, `error`.       |
| `GEMINI_API_KEY`         | In prod / AI routes | `—`                      | Server-side Google GenAI API key. Never exposed to the browser.      |
| `REQUIRE_GEMINI_API_KEY` | No                  | `false` (`true` in prod) | Fail server startup if `GEMINI_API_KEY` is absent.                   |
| `GEMINI_MODEL_PRIMARY`   | No                  | `gemini-4-hydrogen`      | Primary Gemini model for structured fusion JSON.                     |
| `GEMINI_MODEL_FALLBACKS` | No                  | `gemini-3.1-flash-lite`  | Comma-separated fallback models.                                     |
| `GEMINI_VISION_MODEL`    | No                  | `gemini-4-hydrogen`      | Gemini model used for `/api/vision/analyze-photo`.                   |
| `CORS_ORIGIN`            | No                  | `""`                     | Comma-separated allowed browser origins (or `*` for local dev only). |
| `APP_URL`                | No                  | `""`                     | Optional deployed URL metadata.                                      |

---

## 3. Running, Testing, and Building

```bash
# Install dependencies
npm install

# Start development server (Express + Vite dev middleware on port 3000)
npm run dev

# Run ESLint (typescript-eslint, react-hooks, jsx-a11y) + TypeScript strict typecheck
npm run lint

# Format codebase with Prettier
npm run format

# Run Vitest unit, integration, and React Testing Library suites
npm test

# Run tests with V8 coverage report
npm run test:coverage

# Build production client (dist/) and bundled server (dist/server.cjs)
npm run build
npm start
```

See [docs/API.md](./docs/API.md) for full endpoint specifications and error codes.
