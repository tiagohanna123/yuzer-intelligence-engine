# Yuzer Intelligence Engine

<p align="center">
  <a href="https://www.npmjs.com/package/yuzer-intelligence-engine"><img src="https://img.shields.io/npm/v/yuzer-intelligence-engine" alt="npm version"></a>
  <a href="https://github.com/tiagohanna/yuzer-intelligence-engine/actions/workflows/ci.yml"><img src="https://github.com/tiagohanna/yuzer-intelligence-engine/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-strict-3178C6" alt="TypeScript Strict"></a>
  <a href="#"><img src="https://img.shields.io/badge/tests-79%20passing-brightgreen" alt="Tests 79 passing"></a>
  <a href="#"><img src="https://img.shields.io/badge/coverage-%3E95%25-success" alt="Coverage >95%"></a>
  <a href="#"><img src="https://img.shields.io/badge/dependencies-0-orange" alt="Zero dependencies"></a>
</p>

Motor de análise para dados de bar e eventos — **CAGR**, **correlação de Pearson**, **Pareto**, **sazonalidade**, **previsão por regressão linear**, **produtos em alta**. Zero dependências. 100% TypeScript.

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

| Função | Import | Descrição |
|--------|--------|-----------|
| `calcMom` | `metrics/mom` | Mês a mês + MA3 |
| `calcCAGR` | `metrics/cagr` | CAGR |
| `calcCorrelation` | `metrics/correlation` | Pearson R |
| `calcPareto` | `metrics/pareto` | Análise de Pareto |
| `calcQuarters` | `metrics/quarters` | Trimestres |
| `calcForecast` | `metrics/forecast` | Regressão linear |
| `calcSeasonality` | `metrics/seasonality` | Sazonalidade |
| `calcProductGrowth` | `metrics/product-growth` | Produtos em alta |
| `calcTicketGrowth` | `metrics/ticket-growth` | Evolução do ticket |
| `analyzeCategories` | `metrics/categories` | Categorias |
| `analyzeEvents` | `metrics/events` | Eventos normalizados |

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
git clone <repo>
cd yuzer-intelligence-engine
npm install
npm test              # 79 testes
npm run test:coverage # cobertura
npm run build         # tsc → dist/
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

Princípios:
- **Zero dependências runtime**
- **Funções puras** — sem side effects, sem mutação
- **100% tipado** — sem `any`
- **Tree-shakeable** — importe só o que precisa
- **ESM** — nativo ES2022

## Licença MIT.

---

📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)** — arquitetura, fluxo de dados, princípios de design  
🎓 **[LEARN.md](./LEARN.md)** — guia de aprendizado para novos desenvolvedores  
📋 **[CHANGELOG.md](./CHANGELOG.md)** — histórico de versões
