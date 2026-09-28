# Travel With You — Professional Project & Directory Architecture

This document describes the folder layout and modular architectural design of the **Travel With You** codebase, structured for enterprise IDE workflows (VS Code, Antigravity, Cursor, WebStorm).

---

## 📁 High-Level Workspace Architecture

```
travel-with-you/
│
├── .vscode/                 # IDE workspace configuration (Run tasks, debuggers, recommended extensions)
│   ├── launch.json          # F5 Debugger configs (Frontend Chrome, Backend Node, Fullstack compound)
│   ├── tasks.json           # IDE Tasks (Ctrl+Shift+B) for Dev, Test, Seed, Build
│   ├── settings.json        # Editor formatting, tabs, TypeScript path mapping
│   └── extensions.json      # Curated extension recommendations
│
├── frontend/                # Client Application (React 19 + TypeScript + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/      # Modular Domain-Driven UI Components
│   │   │   ├── common/      # Core reusable layout components (Navbar, Footer, MobileBottomNav)
│   │   │   ├── places/      # Place discovery cards, detail modals, category grid
│   │   │   ├── ai/          # AI Chat companion, Surprise Me generator modal
│   │   │   ├── home/        # Hero section, Features overview, City switcher modal
│   │   │   ├── demo/        # 3-minute hackathon walkthrough banner
│   │   │   ├── auth/        # Login and Signup modals
│   │   │   └── index.ts     # Master barrel export for all components
│   │   ├── pages/           # 8 Route-level Page Views
│   │   │   ├── LandingPage.tsx   # 13 homepage sections
│   │   │   ├── ExplorePage.tsx   # Filtering, sorting, list/map view toggle
│   │   │   ├── PlannerPage.tsx   # AI Itinerary Generator + Budget Guardian
│   │   │   ├── BudgetPage.tsx    # Squad Expense Splitter & tracker
│   │   │   ├── MapPage.tsx       # Interactive GPS Campus Map
│   │   │   ├── MemoriesPage.tsx  # Photo journal & community stories
│   │   │   ├── SavedPage.tsx     # Student wishlist
│   │   │   └── ProfilePage.tsx   # Student identity & preferences
│   │   ├── hooks/           # Custom Reusable React Hooks
│   │   │   ├── useLocation.ts    # GPS & campus city switcher
│   │   │   ├── useSavedPlaces.ts # LocalStorage + backend wishlist sync
│   │   │   ├── useWeather.ts     # Weather-aware recommendations
│   │   │   └── index.ts
│   │   ├── services/        # Service abstraction layer
│   │   │   └── index.ts     # apiService & aiService
│   │   ├── types/           # Strict TypeScript contracts & models
│   │   │   └── index.ts
│   │   ├── utils/           # Helper utilities & API callers
│   │   │   ├── api.ts       # Backend REST API client
│   │   │   ├── gemini.ts    # Client-side AI fallback engine
│   │   │   └── constants.ts # Seed places, categories, campus cities
│   │   ├── App.tsx          # Master application router & modal coordinator
│   │   ├── main.tsx         # DOM entrypoint
│   │   └── index.css        # Design tokens, custom scrollbars, animations
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                  # REST API Backend (Node.js + Express + Persistent JSON DB)
│   ├── src/
│   │   ├── config/          # Environment configuration & constants
│   │   │   └── index.js
│   │   ├── controllers/     # Request/Response handlers & Business logic
│   │   │   ├── healthController.js
│   │   │   ├── placesController.js
│   │   │   ├── weatherController.js
│   │   │   ├── aiController.js
│   │   │   ├── savedController.js
│   │   │   ├── tripsController.js
│   │   │   ├── expensesController.js
│   │   │   ├── memoriesController.js
│   │   │   └── authController.js
│   │   ├── routes/          # Express route definitions
│   │   │   ├── health.routes.js
│   │   │   ├── places.routes.js
│   │   │   ├── weather.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── saved.routes.js
│   │   │   ├── trips.routes.js
│   │   │   ├── expenses.routes.js
│   │   │   ├── memories.routes.js
│   │   │   ├── auth.routes.js
│   │   │   └── index.js     # Master router mounted at `/api`
│   │   ├── services/        # Data and external service integrations
│   │   │   ├── dbService.js      # Atomic database queries & writes
│   │   │   ├── aiService.js      # AI Itinerary & chat heuristics
│   │   │   └── weatherService.js # Live/simulated weather conditions
│   │   ├── middleware/      # Global Express middlewares
│   │   │   ├── logger.js         # HTTP request logging
│   │   │   └── errorHandler.js   # Centralized error formatter
│   │   ├── app.js           # Express app instance & middleware stack
│   │   └── server.js        # Port listener and graceful shutdown
│   ├── data/
│   │   ├── database.json    # Persistent JSON storage file
│   │   └── places.js        # Initial seed places dataset
│   ├── db.js                # Core atomic database driver
│   ├── test-endpoints.js    # Automated 11-endpoint integration test suite
│   ├── package.json
│   └── index.js             # Server root entry delegating to `src/server.js`
│
├── scripts/                 # Monorepo Orchestration Scripts
│   ├── dev.js               # Concurrently runs frontend & backend with colored logs
│   ├── test-api.js          # Runs automated integration tests
│   └── seed.js              # Resets and re-seeds local database
│
├── supabase/                # Cloud Database Schemas (Optional PostgreSQL upgrade)
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docs/                    # Technical Documentation & Specs
│   ├── ARCHITECTURE.md      # Full architecture documentation
│   ├── API_DOCUMENTATION.md # REST API endpoint definitions & sample payloads
│   └── PROJECT_STRUCTURE.md # This guide
│
├── .env.example             # Template for environment variables
├── .gitignore               # Ignored files (node_modules, dist, .env)
├── package.json             # Root workspace scripts & dependencies
└── README.md                # Project overview & quickstart instructions
```

---

## 🛠️ Monorepo Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts full-stack dev environment (Backend on `5000`, Frontend on `5173`) |
| `npm run test` | Executes 11-step integration test suite on the backend REST API |
| `npm run seed` | Re-seeds database with authentic student spots across 6+ cities |
| `npm run build` | Compiles production-ready frontend bundle via Vite & TypeScript |
| `npm run start` | Starts backend production server |

---

## ⚡ IDE Developer Experience (DX) Features

1. **One-Click Debugging (`F5`)**:
   - `Backend: Node Server` attaches Node debugger to `server/index.js`.
   - `Frontend: Chrome / Edge` launches Chrome with React devtools.
   - `Full Stack (Server + Client)` starts both simultaneously.

2. **VS Code Tasks (`Ctrl + Shift + B`)**:
   - Directly run dev server, integration tests, or production build without typing terminal commands.

3. **Domain Separation**:
   - Components are grouped into clear feature domains (`common`, `places`, `ai`, `home`, `demo`, `auth`).
   - Controllers, routes, and services in the backend are completely decoupled.
