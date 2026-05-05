# Yuzer Intelligence Engine

![CI](https://github.com/tiagohanna/yuzer-intelligence-engine/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6)

Motor de análise para dados de bar e eventos — **CAGR**, **correlação de Pearson**, **Pareto**, **sazonalidade**, **previsão por regressão linear**, **produtos em alta**. Zero dependências runtime. 100% TypeScript strict.

Extraído do sistema Sarau Secreto para uso standalone em qualquer dashboard, API ou relatório.

```bash
npm install yuzer-intelligence-engine
```

---

## Uso

```typescript
import { analyze } from 'yuzer-intelligence-engine'

const result = analyze(mensais, eventos, produtoMix, categorias)

console.log(result.cagr)          // 18.5 (% ao ano)
console.log(result.correlation)   // 0.92 (Pearson R)
console.log(result.topN)          // 4 (produtos que geram 80% da receita)
console.log(result.forecast)      // [{ label: '+1m', previsto: 52341 }, ...]
```

### Entrada

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `mensais` | `Mensal[]` | 18+ meses de dados agregados |
| `eventos` | `Evento[]` | Eventos individuais com produtos |
| `produtoMix` | `ProdutoMix[]` | Mix de produtos com receita |
| `categorias` | `Categoria[]` | Categorias de produtos |
| `options` | `AnalyzeOptions` | (opcional) Configurações |

### Saída

`AnalysisResult` contém **20 métricas**:

| Métrica | Tipo | Descrição |
|---------|------|-----------|
| `mom` | `MomEntry[]` | Mês a mês com growth % e MA3 |
| `quarters` | `QuarterEntry[]` | Agregado trimestral |
| `cagr` | `number` | Crescimento anual composto (%) |
| `correlation` | `number` | Correlação de Pearson (receita × pedidos) |
| `top3CatPct` | `number` | Concentração top 3 categorias (%) |
| `topN` | `number` | Produtos que geram 80% da receita |
| `topPct` | `number` | % da receita desses N produtos |
| `prodGrowth` | `ProdGrowth[]` | Top 10 produtos em alta |
| `forecast` | `ForecastEntry[]` | Previsão 3 meses (regressão linear) |
| `seasonal` | `SeasonalEntry[]` | Receita média por mês do ano |
| `scatterData` | `ScatterPoint[]` | Duração × receita por evento |
| `bestNorm` | `EventoRank[]` | Top 3 eventos (receita/dia) |
| `worstNorm` | `EventoRank[]` | Piores 3 eventos (receita/dia) |
| `bestMonth` | `{label, revenue}` | Mês de maior receita |
| `worstMonth` | `{label, revenue}` | Mês de menor receita |
| `tg` | `number` | Crescimento do ticket médio (%) |
| `tt` | `number` | Ticket médio atual (média 6 meses) |
| `to` | `number` | Ticket médio anterior (média 6 meses) |
| `sortedCats` | `Categoria[]` | Categorias ordenadas por receita |
| `sortedProds` | `ProdutoMix[]` | Produtos ordenados por receita |

---

## API de Métricas Individuais

Cada métrica pode ser importada separadamente para tree-shaking:

```typescript
import { calcCAGR, calcCorrelation, calcPareto } from 'yuzer-intelligence-engine'

const cagr = calcCAGR(mensais)
const r = calcCorrelation(mensais)
const { topN } = calcPareto(produtoMix)
```

| Função | Descrição |
|--------|-----------|
| `calcMom` | Mês a mês + MA3 |
| `calcCAGR` | CAGR |
| `calcCorrelation` | Pearson R |
| `calcPareto` | Análise de Pareto |
| `calcQuarters` | Trimestres |
| `calcForecast` | Regressão linear |
| `calcSeasonality` | Sazonalidade |
| `calcProductGrowth` | Produtos em alta |
| `calcTicketGrowth` | Evolução do ticket |
| `analyzeCategories` | Categorias |
| `analyzeEvents` | Eventos normalizados |

---

## Formatação

```typescript
import { fmt, fmtNum, pct, pctAbs, round } from 'yuzer-intelligence-engine'

fmt(52341)       // "R$ 52.341"
fmtNum(17939)    // "17.939"
pct(18.5)        // "+18.5%"
pctAbs(78.1)     // "78.1%"
round(3.14159)   // 3.14
```

---

## Constantes

```typescript
import { GOLD, PURPLE, MESES, THRESHOLDS } from 'yuzer-intelligence-engine'

MESES            // ['Jan', 'Fev', ..., 'Dez']
THRESHOLDS.CAGR  // { verde: 15, amarelo: 5 }
```

---

## Tipos

```typescript
import type { Mensal, Evento, ProdutoMix, Categoria, AnalysisResult } from 'yuzer-intelligence-engine'
```

---

## Desenvolvimento

```bash
git clone https://github.com/tiagohanna/yuzer-intelligence-engine.git
cd yuzer-intelligence-engine
npm install
npm test              # 84 testes
npm run test:coverage # cobertura (100% statements)
npm run lint          # ESLint strict
npm run typecheck     # TypeScript strict
npm run build         # tsup → dist/
```

---

## Arquitetura

```
src/
├── index.ts          — Ponto de entrada público
├── types.ts          — Interfaces de entrada/saída
├── constants.ts      — Cores, meses, thresholds
├── formatters.ts     — BRL, %, número
├── engine.ts         — Orquestrador (chama todas as métricas)
└── metrics/
    ├── mom.ts        — Mês a mês + média móvel 3m
    ├── cagr.ts       — Compound Annual Growth Rate
    ├── correlation.ts — Correlação de Pearson
    ├── pareto.ts     — Análise de Pareto 80/20
    ├── quarters.ts   — Agregação trimestral
    ├── forecast.ts   — Regressão linear
    ├── seasonality.ts — Sazonalidade
    ├── product-growth.ts — Produtos em alta
    ├── ticket-growth.ts — Evolução do ticket
    ├── categories.ts — Categorias
    └── events.ts     — Eventos normalizados
```

### Princípios

- **Zero dependências runtime** — o motor não depende de nada além do stdlib do Node.js
- **Funções puras** — sem side effects, sem mutação de entrada
- **100% tipado** — TypeScript strict, sem `any`
- **Tree-shakeable** — importe só a métrica que precisa
- **Dual ESM/CJS** — compatível com `import` e `require()`

---

## Licença

MIT © [Tiago Hanna](https://github.com/tiagohanna)

---

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guia de contribuição e [SECURITY.md](SECURITY.md) para política de segurança.
