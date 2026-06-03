# Technical Assignment

End-to-end automation built with **Cypress** (Part 1) and **Playwright** (Part 2),
in TypeScript. The focus is on a scalable architecture, stable selectors,
network/contract validation beyond the UI, and debuggable failures.

## Repository layout

```
.
├── cypress/                     # Part 1 — Cypress (UI + API + network)
│   ├── e2e/
│   │   └── part-1.cy.ts         # Tasks 1–3
│   ├── lib/
│   │   ├── components/          # Reusable UI components (header)
│   │   ├── pages/               # Page Objects (login, inventory)
│   │   ├── api/                 # API clients + services (Reqres, Saucedemo)
│   │   └── types/               # Typed schemas + generated checkers
│   ├── support/                 # Custom commands
│   └── cypress.config.ts
│
├── playwright/                  # Part 2 — Playwright (UI + API + diagnostics)
│   ├── tests/
│   │   └── part-2.test.ts       # Tasks 4–6 (Task 7 = config-level)
│   ├── lib/
│   │   ├── web-client.ts        # Aggregates all Page Objects (single entry point)
│   │   ├── pages/               # Page Objects (text-box, practice-form)
│   │   ├── api/                 # ApiClient + services (posts)
│   │   ├── types/               # Typed schemas + generated checkers
│   │   ├── helpers/             # @step decorator for trace readability
│   │   └── routes.ts            # Centralized, typed app routes
│   └── playwright.config.ts
│
└── README.md
```

## Prerequisites

- Node.js 18+
- npm

## Setup

Each framework is a self-contained package. Install dependencies separately:

```bash
# Cypress
cd cypress && npm install

# Playwright (also downloads the Chromium browser)
cd playwright && npm install && npx playwright install chromium
```

## Configuration

Both frameworks are environment-driven — no hard-coded base URLs or credentials in tests.

**Cypress** (`cypress/cypress.config.ts`) — `env` block:

| Key            | Purpose                      |
| -------------- | ---------------------------- |
| `username`     | Saucedemo login              |
| `password`     | Saucedemo password           |
| `apiUrl`       | Reqres base URL              |
| `reqresApiKey` | Reqres API key (`x-api-key`) |

> Note: `reqres.in` now requires a free API key (`x-api-key`). Replace the
> placeholder key with your own from [app.reqres.in](https://app.reqres.in).

**Playwright** (`playwright/.env`):

```
BASE_URL=https://demoqa.com
API_URL=https://jsonplaceholder.typicode.com
```

## Running the tests

```bash
# --- Cypress (Part 1) ---
cd cypress
npm test          # headless run
npm run headed    # headed
npm run open      # interactive runner

# --- Playwright (Part 2) ---
cd playwright
npm test          # headless run
npm run headed    # headed
npm run report    # open the last HTML report
```

## Coverage

| Part | Task | Test(s)                                                            |
| ---- | ---- | ------------------------------------------------------------------ |
| 1    | 1    | Login → add to cart → cart badge = 1                               |
| 1    | 2    | Network/API validation of `manifest.json` (status + structure)     |
| 1    | 3    | `GET /api/users?page=2` — status 200 + full schema check           |
| 2    | 4    | Text-box form — fill, submit, verify rendered output               |
| 2    | 5    | Practice form — 6 positive + 7 negative cases (5.1–5.13)           |
| 2    | 6    | `GET /posts` via request context — array + first-item schema check |
| 2    | 7    | Failure diagnostics (screenshots, video, trace) — config-level     |

## Key engineering decisions

- **Page Object Model + components.** Pages expose actions and `Locator`
  getters; **assertions live in the tests**, not in Page Objects — keeping
  failures readable and Page Objects reusable.
- **Web-first assertions.** Playwright tests use auto-retrying matchers
  (`toBeVisible`, `toHaveText`, `toBeHidden`) instead of one-shot boolean reads —
  no fixed waits, no flakiness from race conditions.
- **Contract validation.** API responses are validated against typed interfaces
  via `ts-interface-checker` (generated checkers), not just ad-hoc key checks.
- **Stable selectors.** `data-test` attributes on Saucedemo; semantic
  ids/labels on demoqa. Selectors are centralized per Page Object.
- **Meaningful negative tests.** Instead of only asserting "modal absent", the
  negative cases assert the specific field's native validation state
  (`validity.valid === false`) and guard that the form is still rendered — so a
  test can't pass for the wrong reason.
- **Typed routes & API services.** Navigation goes through a typed `Routes`
  map; HTTP calls go through dedicated service classes — tests never contain raw
  URLs or raw `request.get`/`cy.request` calls.

---

# Engineering Reflection

### 1. How would you scale this framework to support 300+ tests?

The structure already carries most of the weight — Page Objects, a `WebClient`
aggregator, typed routes and API services mean tests stay short and a UI change
touches one file, not fifty. Beyond that I'd pull test data into typed
factories so cases become data-driven instead of copy-pasted, tag tests
(`@smoke`, `@api`, `@regression`) to run only what's relevant, and shard the run
across CI machines so wall-clock time stays flat no matter how many tests there
are. The `@step` traces and schema checks are what keep a suite that size
debuggable.

### 2. How would you reduce and monitor flakiness in CI?

Most flakiness comes from waiting on time instead of state, so the rule is no
`sleep`s — only web-first, auto-retrying assertions and waits on real signals
(network, element state). Keep tests independent: fresh navigation each time, no
shared state, and set up data through the API instead of slow UI steps. To
monitor it, every failure already ships with a trace/screenshot/video, so it's
reproducible. I'd keep `retries: 2` on CI purely to _flag_ flaky tests — a test
that only passes on retry is flaky, not green — push that data to a dashboard,
and quarantine repeat offenders behind a tag until they're fixed.

### 3. What test strategy would you run on every Pull Request vs nightly runs?

On a PR you want speed: run the `@smoke` critical paths plus all API tests
(fast and stable), one browser, sharded, traces on failure. A few minutes,
blocking the merge. Nightly is the opposite trade-off — run everything,
including the negative and edge cases, across more browsers and viewports, with
full diagnostics kept. The nightly run is what feeds the flakiness dashboard and
pings the team on regressions, so PRs stay fast without anything going
unverified.
