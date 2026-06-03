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

What makes it scale is separation, and it's already in place here. Tests stay
short and only describe *what* is checked; the *how* lives underneath — Page
Objects and a `WebClient` aggregator drive the UI, API service layers prepare
data through the back end instead of clicking through screens. So a test rarely
breaks from an unrelated UI change, and when it does, you fix it in one place.
The next step is moving inline data into typed factories so cases become
data-driven instead of copy-pasted.

The rest is running the right tests at the right time: tag tests (`@smoke`,
`@api`) to run a small slice on demand or the whole suite at night, and shard
the run across machines  so adding tests doesn't make it slower. Failures stay
debuggable at any size — the `@step` traces and schema checks point straight to
what broke — and retries only flag unstable tests, never hide them. At 300 or
600 tests the structure is the same; there's just more of it.

### 2. How would you reduce and monitor flakiness in CI?

**Reduce.** Most flakiness is waiting on time instead of state — so no `sleep`s,
only web-first auto-retrying assertions and waits on real signals. Keep tests
independent: fresh navigation, no shared state, unique data per test so parallel
runs don't collide, set up through the API not the UI. Mock unreliable
third-party dependencies. And catch it early — run new tests several times on the
PR; if one isn't green every time, it doesn't merge.

**Monitor.** Every failure ships with a trace, screenshot and video, and
per-test logs feed a central place (e.g. Kibana). What matters most is history:
a dashboard tracking each test over time, since flaky shows up as "green with
holes", not a clean fail. Retries stay at `2` only to *flag* it — passing on
retry is reported flaky, not green — and new flakiness pings the team so it's
fixed while fresh, with repeat offenders quarantined behind a tag.

### 3. What test strategy would you run on every Pull Request vs nightly runs?

On a PR you want speed: run the `@smoke` critical paths plus all API tests
(fast and stable), one browser, sharded, traces on failure. A few minutes,
blocking the merge. Nightly is the opposite trade-off — run everything,
including the negative and edge cases, across more browsers and viewports, with
full diagnostics kept. The nightly run is what feeds the flakiness dashboard and
pings the team on regressions, so PRs stay fast without anything going
unverified.
