# Contributing

## Code Standards

- **TypeScript strict** — `strict: true` in tsconfig. No `any`, no `// @ts-ignore`.
- **Pure functions** — No side effects, no mutation of inputs. Every function returns a new value.
- **100% typed** — All public APIs must have explicit return types. Parameters must be typed.
- **Tree-shakeable** — Each metric is a standalone module. No barrel imports in production path.
- **Zero runtime deps** — No third-party dependencies at runtime. Dev deps only.

## Development Setup

```bash
git clone <repo>
cd yuzer-intelligence-engine
npm install
```

## Before Committing

Run the full quality gate:

```bash
npm run typecheck     # TypeScript strict — 0 errors
npm test              # All tests pass
npm run test:coverage # Coverage meets thresholds (95% stmts, 90% branches)
npm run build         # ESM + CJS + DTS builds clean
```

## Test Conventions

- One test file per module: `tests/metrics/<metric>.test.ts`
- Use fixtures from `tests/fixtures/sample-data.ts` for realistic data
- Cover edge cases: empty arrays, single values, negative growth, NaN guards
- Name tests with `describe` / `it` — clear, declarative sentences

## Pull Request Process

1. Ensure all quality gates pass locally
2. Add tests for new metrics or edge cases
3. Update CHANGELOG.md under `[Unreleased]`
4. Update README.md if API surface changes
5. PR is merged after CI passes and at least one review

## Architecture

```
src/
├── index.ts          — Public entry point (re-exports)
├── types.ts          — Shared interfaces
├── constants.ts      — Config values, thresholds, labels
├── formatters.ts     — Display formatting (BRL, %, number)
├── engine.ts         — Orchestrator (analyze())
└── metrics/           — Individual metric modules
    ├── mom.ts
    ├── cagr.ts
    ├── correlation.ts
    ├── pareto.ts
    ├── quarters.ts
    ├── forecast.ts
    ├── seasonality.ts
    ├── product-growth.ts
    ├── ticket-growth.ts
    ├── categories.ts
    └── events.ts
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** — Breaking API changes
- **MINOR** — New metrics, features, or optional deps
- **PATCH** — Bug fixes, edge case hardening, performance
