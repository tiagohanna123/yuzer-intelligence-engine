# AGENTS.md — Yuzer Intelligence Engine

> Context for AI agents and LLM-assisted development.

---

## TL;DR

```
yuzer-intelligence-engine  —  Motor de análise financeira para dados de bar/eventos
Zero dependências runtime   —  Funções puras, tree-shakeable, 100% TypeScript strict
```

- Criado por: **Tiago Hanna**
- Licença: **MIT**
- Repositório: `github.com/tiagohanna/yuzer-intelligence-engine`
- Pacote npm: `yuzer-intelligence-engine`

---

## Tech Stack

| Camada      | Tecnologia                          |
|-------------|-------------------------------------|
| Linguagem   | TypeScript 5.7 (strict mode)        |
| Testes      | Vitest 4.x                          |
| Build       | tsup (ESM + CJS + DTS + sourcemaps) |
| Linter      | ESLint 9.x + typescript-eslint      |
| Runtime     | Node >= 20                          |
| Dependências| **Zero** (devDeps only)             |

---

## Key Files

```
├── src/
│   ├── index.ts              → Barrel exports públicos
│   ├── types.ts              → Interfaces Mensal, Evento, ProdutoMix, Categoria, AnalysisResult
│   ├── constants.ts          → GOLD, PURPLE, MESES, THRESHOLDS
│   ├── formatters.ts         → fmt(), fmtNum(), pct(), pctAbs(), round()
│   ├── engine.ts             → analyze() — orquestrador de todas as métricas
│   └── metrics/
│       ├── mom.ts            → Mês a mês + média móvel 3m
│       ├── cagr.ts           → Compound Annual Growth Rate
│       ├── correlation.ts    → Correlação de Pearson (receita × pedidos)
│       ├── pareto.ts         → Análise de Pareto 80/20
│       ├── quarters.ts       → Agregação trimestral
│       ├── forecast.ts       → Regressão linear simples
│       ├── seasonality.ts    → Sazonalidade (receita média por mês)
│       ├── product-growth.ts → Top 10 produtos em alta
│       ├── ticket-growth.ts  → Evolução do ticket médio
│       ├── categories.ts     → Análise de categorias
│       └── events.ts         → Eventos normalizados (receita/dia)
├── tests/
│   ├── engine.test.ts        → 23 testes do orquestrador
│   ├── metrics/              → 11 arquivos · 57 testes unitários
│   └── fixtures/
│       └── sample-data.ts    → Dados de teste reais
├── AGENTS.md                 → ✓ (este arquivo)
├── ARCHITECTURE.md           → Documentação completa de arquitetura
├── CHANGELOG.md              → Histórico de versões
├── CONTRIBUTING.md           → Guia de contribuição
├── LEARN.md                  → Guia de aprendizado
├── README.md                 → Documentação principal
├── ROADMAP.md                → Roadmap do projeto
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── eslint.config.js
```

---

## Commands

```bash
npm test              # vitest run          — 80 testes
npm run test:watch   # vitest               — modo watch
npm run test:coverage # vitest --coverage    — com cobertura
npm run typecheck    # tsc --noEmit         — 0 erros
npm run build        # tsup                — ESM + CJS + DTS
npm run lint         # eslint src/ tests/  — linting
npm run dev          # tsup --watch        — build contínuo
```

---

## Architecture Overview

### Fluxo de Dados

```
Mensais ──┐
Eventos ──┤
MixProds ─┼──→ engine.analyze() ──→ AnalysisResult (20 métricas)
Categorias┘
```

- **engine.ts** = orquestrador: chama cada métrica individualmente, monta o resultado final.
- Cada métrica em `src/metrics/` é uma **função pura** autocontida.
- Nenhuma métrica importa outra métrica — dependem apenas de `types.ts`.

### Princípios

1. **Zero dependências runtime** — sem `import` de terceiros no código produzido
2. **Funções puras** — sem side effects, sem mutação de argumentos
3. **TypeScript strict** — sem `any`, sem `// @ts-ignore`
4. **Tree-shakeable** — cada métrica importável separadamente
5. **ESM + CJS + DTS** — suporte a todos os ambientes

---

## Test Matrix

| Suite             | Arquivos | Testes | Status |
|-------------------|----------|--------|--------|
| engine (integr.)  | 1        | 23     | ✅     |
| metrics (unit.)   | 11       | 57     | ✅     |
| **Total**         | **12**   | **80** | ✅     |

---

## Quality Gates

Verificação obrigatória antes de qualquer commit/PR:

| Gate              | Comando                | Requisito          |
|-------------------|------------------------|--------------------|
| TypeScript strict | `npm run typecheck`    | 0 erros           |
| Build             | `npm run build`        | Saída limpa       |
| Testes            | `npm test`             | 100% passando     |
| Cobertura         | `npm run test:coverage`| stmts ≥ 100%, branches ≥ 85%, funcs ≥ 100%, lines ≥ 100% |
| Lint              | `npm run lint`         | Sem warnings      |

---

## Conventions

- **Nomes de arquivo**: kebak-case (`product-growth.ts`, `ticket-growth.ts`)
- **Nomes de função**: camelCase com prefixo `calc` para métricas (`calcCAGR`, `calcPareto`)
- **Imports de tipo**: usar `import type { ... }` / `export type { ... }` (verbatimModuleSyntax)
- **Testes**: `describe`/`it` por módulo, fixtures centralizadas em `tests/fixtures/`
- **Edge cases**: toda função trata arrays vazios, 1 elemento, divisão por zero
- **Commits**: incremental, cobertura de edge cases, CHANGELOG atualizado

---

## Agent Instructions

Ao trabalhar neste repositório:

1. **Leia `ARCHITECTURE.md`** primeiro para entender o fluxo de dados completo.
2. **Não adicione dependências runtime** — se precisar de algo externo, implemente manualmente.
3. **Mantenha funções puras** — sem mutação de inputs, sem side effects.
4. **Cubra edge cases** nos testes: vazio, 1 item, divisão por zero, valores negativos.
5. **Respeite os thresholds de cobertura** — não desative ou reduza.
6. **Mantenha tree-shakeability** — cada métrica deve ser importável sem arrastar outras.
7. **Atualize `CHANGELOG.md`** sob `[Unreleased]` ao adicionar/modificar funcionalidades.
8. **Execute o quality gate completo** antes de finalizar qualquer alteração.
