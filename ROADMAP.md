# Roadmap — Yuzer Intelligence Engine

**Current version:** v0.1.0
**Next release:** v0.2.0
**Target:** v1.0.0 (production-ready)

---

## v0.1.0 — Engine Foundation ✅ *(Current)*

### Features
- **CAGR** — Compound Annual Growth Rate calculation
- **Correlation** — Pearson R correlation (revenue × orders)
- **Pareto — 80/20 analysis (top N products generating 80% revenue)
- **Seasonality** — Revenue by month of year (12-month profile)
- **Forecast** — Linear regression forecast (3 months ahead)
- **Product Growth** — Top 10 products in growth
- **Ticket Growth** — Average ticket evolution (current vs previous)
- **Month-over-Month** — MoM with 3-month moving average (MA3)
- **Quarterly aggregation** — Grouped by quarter
- **Category analysis** — Categories sorted by revenue
- **Event analysis** — Normalized revenue/duration ranking
- **Formatters** — Currency (BRL), percentage, number formatting
- **Dual build** — ESM (`import`) + CJS (`require`) via tsup
- **Zero runtime dependencies** — Pure TypeScript, tree-shakeable

### Quality
- 79 tests, 12 test files
- 96% statement coverage
- TypeScript strict mode — 0 errors
- CI: GitHub Actions (test + typecheck + build)

---

## v0.2.0 — Observability & Robustness *(Estimated: 1 week)*

### Features
- **Edge case hardening** — NaN/Infinity guards, empty array handling
- **Error types** — Typed error classes for invalid input
- **Input validation** — Zod schemas for all public API inputs
- **100% branch coverage** — All conditional branches tested
- **eslint** — Static analysis with strict TS rules
- **Benchmark suite** — Performance baseline for core metrics

### Quality Target
- 90% branch coverage
- 95% function coverage
- eslint strict — 0 warnings
- Benchmark regression gate in CI

---

## v0.3.0 — Extensibility *(Estimated: 2 weeks)*

### Features
- **Plugin system** — Custom metric registration
- **Data source adapters** — CSV, JSON, SQLite adapters
- **Advanced forecasting** — Exponential smoothing (Holt-Winters)
- **Drill-down API** — Per-product, per-category, per-period breakdown
- **Cohort analysis** — Retention, repeat rate, customer value

### Quality Target
- 98% overall coverage
- Performance benchmarks in CI
- Stress test: 10K+ products, 5 years of data

---

## v0.4.0 — Visualization & Distribution *(Estimated: 2 weeks)*

### Features
- **Chart presets** — SVG/Canvas rendering helpers (optional dep)
- **Dashboard templating** — JSON-based dashboard definitions
- **npm publish** — Automatic npm release via CI
- **Bundle size monitoring** — size-limit or similar
- **Migration guide** — CHANGELOG-driven upgrade path

### Quality Target
- Bundle size budget: < 15KB gzip (core)
- npm package published with provenance

---

## v1.0.0 — Production Release *(Estimated: 3–4 weeks from v0.4.0)*

### Features
- **Stable API** — v1 API with deprecation guarantees
- **Documentation site** — Full API reference with examples
- **Multi-language support** — Locale-aware formatting
- **Plugin marketplace** — Community metric registry (concept)
- **Security audit** — Dependency review, supply-chain security

### Quality Target
- 100% line coverage
- Fuzz testing for input validation
- Security audit passed
- npm package: < 10KB gzip (core)

---

## Dependency Graph

```
v0.1.0 ──→ v0.2.0 ──→ v0.3.0 ──→ v0.4.0 ──→ v1.0.0
  │           │           │           │           │
  │           │           │           │           ├── Stable API
  │           │           │           │           ├── Docs site
  │           │           │           │           ├── Plugin marketplace
  │           │           │           │           └── Security audit
  │           │           │           │
  │           │           │           └── Chart presets
  │           │           │               npm publish
  │           │           │
  │           │           └── Plugin system
  │           │               Data adapters
  │           │               Advanced forecast
  │           │
  │           └── Edge cases
  │               eslint
  │               Zod validation
  │               Benchmarks
  │
  └── Engine foundation (current)
```

## Effort Summary

| Version | Theme | Estimated Effort | Dependencies |
|---------|-------|------------------|--------------|
| v0.1.0 | Engine Foundation | ✅ Complete | — |
| v0.2.0 | Observability & Robustness | 1 week | v0.1.0 |
| v0.3.0 | Extensibility | 2 weeks | v0.2.0 |
| v0.4.0 | Visualization & Distribution | 2 weeks | v0.3.0 |
| v1.0.0 | Production Release | 3–4 weeks | All prior |

---

*Roadmap is a living document. Priorities and timelines may shift based on feedback and project needs.*
