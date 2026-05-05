# AGENTS.md — Yuzer Intelligence Engine

> Contexto para agentes de IA (Hermes Agent, Claude Code, etc.)

## Visão Geral

**Yuzer Intelligence Engine** é um motor de análise financeira para dados de bar e eventos — CAGR, correlação de Pearson, Pareto, sazonalidade, previsão por regressão linear, produtos em alta. Zero dependências runtime. 100% TypeScript strict.

- **Repositório:** https://github.com/tiagohanna/yuzer-intelligence-engine
- **Licença:** MIT
- **Autor:** Tiago Hanna
- **Node:** >=20
- **Pacote npm:** `yuzer-intelligence-engine`

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js >=20 (ESM only) |
| Linguagem | TypeScript ~5.7 (strict mode) |
| Build | tsup (esm + cjs + dts + sourcemap) |
| Testes | Vitest v4 |
| Lint | ESLint v9 (flat config) + typescript-eslint (strict + stylistic) |
| CI | GitHub Actions (Node 20, 22) |

## Commands

```bash
npm install          # Instalar dependências
npm run dev          # Build em watch mode
npm test             # Rodar testes unitários (vitest)
npm run test:coverage  # Testes com cobertura
npm run lint         # ESLint em src/
npm run lint:fix     # ESLint com auto-fix
npm run typecheck    # tsc --noEmit (verificação de tipos)
npm run build        # Build de produção (tsup)
```

Pré-commit (CI roda automaticamente): `npm run lint && npm run build && npm test`

## Estrutura de Diretórios

```
├── src/
│   ├── index.ts              # Ponto de entrada público (barrel exports)
│   ├── types.ts              # Interfaces de entrada/saída
│   ├── constants.ts          # Paleta de cores, meses PT-BR, limiares
│   ├── formatters.ts         # Formatadores BRL, %, número
│   ├── engine.ts             # Orquestrador — chama todas as métricas
│   └── metrics/              # Métricas individuais (tree-shakeable)
│       ├── mom.ts            #   Mês a mês + média móvel 3 meses
│       ├── cagr.ts           #   Compound Annual Growth Rate
│       ├── correlation.ts    #   Correlação de Pearson (receita × pedidos)
│       ├── pareto.ts         #   Análise de Pareto 80/20
│       ├── quarters.ts       #   Agregação trimestral
│       ├── forecast.ts       #   Regressão linear simples
│       ├── seasonality.ts    #   Sazonalidade (receita média por mês)
│       ├── product-growth.ts #   Top 10 produtos em alta
│       ├── ticket-growth.ts  #   Evolução do ticket médio
│       ├── categories.ts     #   Análise de categorias
│       └── events.ts         #   Eventos normalizados (receita/dia)
├── tests/
│   ├── engine.test.ts        # Testes integrados do orquestrador
│   ├── fixtures/             # Dados de teste compartilhados
│   └── metrics/              # Testes unitários por métrica
├── dist/                     # Build output (gitignored)
├── coverage/                 # Relatório de cobertura (gitignored)
├── .editorconfig
├── eslint.config.js          # ESLint flat config
├── tsconfig.json
├── vitest.config.ts
├── package.json
├── AGENTS.md                 # Este arquivo
├── ARCHITECTURE.md           # Documentação detalhada da arquitetura
├── CONTRIBUTING.md           # Guia de contribuição
├── README.md                 # Documentação principal
├── CHANGELOG.md
├── ROADMAP.md
└── LEARN.md
```

## Arquitetura

### Pipeline de Execução

A função `analyze()` recebe 4 parâmetros (mensais, eventos, produtoMix, categorias) + options opcional e retorna `AnalysisResult` com 20 métricas.

O orquestrador (`engine.ts`) chama cada métrica individualmente e monta o resultado. Cada métrica é uma função pura, sem side effects, importável separadamente (tree-shaking).

### Princípios de Design

1. **Zero dependências runtime** — apenas stdlib do Node.js
2. **Funções puras** — sem side effects, sem mutação de entrada
3. **100% tipado** — sem `any`, sem type assertions desnecessárias
4. **Tree-shakeable** — cada métrica pode ser importada individualmente
5. **Testes com cobertura mínima**: 95% statements, 90% branches, 95% functions

### Entrada

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `mensais` | `Mensal[]` | 18+ meses de dados agregados |
| `eventos` | `Evento[]` | Eventos individuais com produtos |
| `produtoMix` | `ProdutoMix[]` | Mix de produtos com receita |
| `categorias` | `Categoria[]` | Categorias de produtos |
| `options` | `AnalyzeOptions` | (opcional) Configurações |

### Saída (20 métricas)

`AnalysisResult` inclui: mom, quarters, cagr, correlation, top3CatPct, topN, topPct, prodGrowth, forecast, seasonal, scatterData, bestNorm, worstNorm, bestMonth, worstMonth, tg, tt, to, sortedCats, sortedProds.

## ESLint Config

Arquivo: `eslint.config.js` (flat config)

- Base: `@eslint/js` recommended
- TypeScript: `typescript-eslint` strict-type-checked + stylistic-type-checked
- `projectService: true` para type-checking
- Regras personalizadas:
  - `no-unnecessary-condition`: desligado (padrões comuns de Record<K,V>)
  - `no-unused-vars`: error (com `^_` ignore pattern)
  - `restrict-template-expressions`: error (allowNumber, allowBoolean, allowNullish)
  - `no-confusing-void-expression`: desligado
  - `prefer-nullish-coalescing`: error
  - `prefer-optional-chain`: error
- Ignora: `dist/`, `coverage/`, `node_modules/`, `*.config.*`

## TypeScript Config

- `strict: true`, `target: ES2022`, `module: ESNext`
- `moduleResolution: bundler`
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax: true`
- Include apenas `src/` (testes têm tsconfig próprio ou rodam via vitest)

## CI/CD (GitHub Actions)

4 jobs em pipeline:
1. **test** — `npm test` + `tsc --noEmit` (Node 20 e 22)
2. **coverage** — `npm run test:coverage` → Codecov
3. **build** — `npm run build` → upload dist como artifact
4. **release** — apenas em tags `v*` → gera changelog + GitHub Release

## Convenções

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- **Branches:** `feat/nova-metrica`, `fix/cagr-edge-case`
- **Linguagem:** Código e commits em inglês; documentação principal em português
- **NPM:** Publicado como pacote público no npm registry
