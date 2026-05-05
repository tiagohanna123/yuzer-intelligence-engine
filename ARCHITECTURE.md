# Arquitetura — Yuzer Intelligence Engine

> **Versão:** 0.1.0 · **Licença:** MIT · **Autor:** Tiago Hanna

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Fluxo de Dados](#fluxo-de-dados)
- [Módulos de Métrica](#módulos-de-métrica)
- [Princípios de Design](#princípios-de-design)
- [Pipeline de Execução](#pipeline-de-execução)
- [Tratamento de Casos de Borda](#tratamento-de-casos-de-borda)
- [Integração com o Ecossistema](#integração-com-o-ecossistema)

---

## Visão Geral

Yuzer Intelligence Engine é um **motor de análise financeira para dados de bar e eventos**, escrito em TypeScript puro. Ele consome dados brutos de vendas mensais, eventos, mix de produtos e categorias, e retorna 20 métricas de negócio em uma única chamada tipada.

O projeto foi extraído do sistema **Sarau Secreto** para uso standalone em dashboards, APIs ou relatórios. **Zero dependências runtime** — todas as funções são puras e tree-shakeable.

---

## Estrutura de Diretórios

```
src/
├── index.ts                  # Ponto de entrada público (barrel exports)
├── types.ts                  # Interfaces de entrada/saída
├── constants.ts              # Paleta de cores, meses PT-BR, limiares
├── formatters.ts             # Formatadores BRL, %, número
├── engine.ts                 # Orquestrador — chama todas as métricas
│
└── metrics/                  # Métricas individuais (importáveis separadamente)
    ├── mom.ts                #   Mês a mês + média móvel 3 meses
    ├── cagr.ts               #   Compound Annual Growth Rate
    ├── correlation.ts        #   Correlação de Pearson (receita × pedidos)
    ├── pareto.ts             #   Análise de Pareto 80/20
    ├── quarters.ts           #   Agregação trimestral
    ├── forecast.ts           #   Regressão linear simples
    ├── seasonality.ts        #   Sazonalidade (receita média por mês)
    ├── product-growth.ts     #   Top 10 produtos em alta
    ├── ticket-growth.ts      #   Evolução do ticket médio
    ├── categories.ts         #   Análise de categorias
    └── events.ts             #   Eventos normalizados (receita/dia)

tests/
├── engine.test.ts            # 23 testes integrados do orquestrador
├── metrics/                  # 11 arquivos · 56 testes unitários
│   ├── mom.test.ts
│   ├── cagr.test.ts
│   ├── correlation.test.ts
│   ├── pareto.test.ts
│   ├── quarters.test.ts
│   ├── forecast.test.ts
│   ├── seasonality.test.ts
│   ├── product-growth.test.ts
│   ├── ticket-growth.test.ts
│   ├── categories.test.ts
│   └── events.test.ts
└── fixtures/
    └── sample-data.ts        # Dados de teste reais simplificados
```

**Total:** 79 testes, todos passando. TypeScript strict com 0 erros.

---

## Fluxo de Dados

```
Dados de Entrada
  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐
  │ Mensais  │  │ Eventos  │  │ ProdutoMix   │  │ Categorias  │
  │ (18+ ms) │  │ (indiv.) │  │ (mix vendas) │  │ (grupos)    │
  └────┬─────┘  └────┬─────┘  └──────┬───────┘  └──────┬──────┘
       │              │               │                  │
       ▼              ▼               ▼                  ▼
  ┌──────────────────────────────────────────────────────────┐
  │                    engine.ts (analyze)                    │
  │  Orquestrador — invoca cada métrica com os dados certos  │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  AnalysisResult (20 campos)               │
  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
  │  │ CAGR    │ │ Mom     │ │ Quarters │ │ Correlation  │  │
  │  │ Pareto  │ │ Forecast│ │ Seasonal │ │ ProdGrowth   │  │
  │  │ Ticket  │ │ Events  │ │ Categ.   │ │ bestMonth    │  │
  │  └─────────┘ └─────────┘ └──────────┘ └──────────────┘  │
  └──────────────────────────────────────────────────────────┘
```

### Entrada (parâmetros do `analyze()`)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `mensais` | `Mensal[]` | 18+ meses de dados agregados (receita, pedidos, ticket médio) |
| `eventos` | `Evento[]` | Eventos individuais com produtos, métodos de pagamento |
| `produtoMix` | `ProdutoMix[]` | Mix de produtos com quantidade, total e % |
| `categorias` | `Categoria[]` | Categorias de produtos com receita agregada |
| `options` | `AnalyzeOptions` | (opcional) Configurações: nomes de meses, períodos de forecast, threshold Pareto |

### Saída (`AnalysisResult`)

`AnalysisResult` contém **20 métricas**:

| Campo | Tipo | Origem | Descrição |
|-------|------|--------|-----------|
| `mom` | `MomEntry[]` | `metrics/mom` | Mês a mês com growth % e MA3 |
| `quarters` | `QuarterEntry[]` | `metrics/quarters` | Agregado trimestral |
| `cagr` | `number` | `metrics/cagr` | Crescimento anual composto (%) |
| `correlation` | `number` | `metrics/correlation` | Correlação de Pearson (receita × pedidos) |
| `top3CatPct` | `number` | `metrics/categories` | Concentração top 3 categorias (%) |
| `topN` | `number` | `metrics/pareto` | Produtos que geram 80% da receita |
| `topPct` | `number` | `metrics/pareto` | % da receita desses N produtos |
| `prodGrowth` | `ProdGrowth[]` | `metrics/product-growth` | Top 10 produtos em alta |
| `forecast` | `ForecastEntry[]` | `metrics/forecast` | Previsão 3 meses (regressão linear) |
| `seasonal` | `SeasonalEntry[]` | `metrics/seasonality` | Receita média por mês do ano |
| `scatterData` | `ScatterPoint[]` | `metrics/events` | Duração × receita por evento |
| `bestNorm` | `EventoRank[]` | `metrics/events` | Top 3 eventos (receita/dia) |
| `worstNorm` | `EventoRank[]` | `metrics/events` | Piores 3 eventos (receita/dia) |
| `bestMonth` | `{label, revenue}` | `engine.ts` | Mês de maior receita |
| `worstMonth` | `{label, revenue}` | `engine.ts` | Mês de menor receita |
| `tg` | `number` | `metrics/ticket-growth` | Crescimento do ticket médio (%) |
| `tt` | `number` | `metrics/ticket-growth` | Ticket médio atual (média 6 meses) |
| `to` | `number` | `metrics/ticket-growth` | Ticket médio anterior (média 6 meses) |
| `sortedCats` | `Categoria[]` | `metrics/categories` | Categorias ordenadas por receita |
| `sortedProds` | `ProdutoMix[]` | `engine.ts` | Produtos ordenados por receita |

---

## Módulos de Métrica

Cada módulo em `src/metrics/` é uma função pura autocontida. Nenhum módulo importa outro módulo de métrica — a única dependência é de `types.ts` para as interfaces.

### 1. `mom.ts` — Mês a Mês

- **Função:** `calcMom(mensais): MomEntry[]`
- **Algoritmo:** Para cada mês, calcula `growth = (atual - anterior) / anterior` e `ma3` (média móvel dos últimos 3 meses).
- **Casos de borda:** Primeiro mês tem growth = 0 e ma3 = próprio valor.
- **Complexidade:** O(n)

### 2. `cagr.ts` — CAGR

- **Função:** `calcCAGR(mensais): number`
- **Algoritmo:** CAGR = (últimos 6 meses / primeiros 6 meses) ^ (1 / períodos) − 1. Períodos = meses / 12.
- **Requisito:** Mínimo de 12 meses para resultado não zero.
- **Complexidade:** O(n)

### 3. `correlation.ts` — Correlação de Pearson

- **Função:** `calcCorrelation(mensais): number`
- **Algoritmo:** Pearson R clássico: covariância / (desvio_x × desvio_y). Mede relação entre receita e pedidos.
- **Requisito:** Mínimo de 2 meses.
- **Complexidade:** O(n)

### 4. `pareto.ts` — Análise de Pareto

- **Função:** `calcPareto(produtoMix, threshold?): ParetoResult`
- **Algoritmo:** Ordena produtos por total decrescente, acumula até atingir o threshold (padrão 80%).
- **Retorna:** `topN` (quantos produtos) e `topPct` (% da receita desses produtos).
- **Complexidade:** O(n log n) (sort)

### 5. `quarters.ts` — Agregação Trimestral

- **Função:** `calcQuarters(mensais, monthNames): QuarterEntry[]`
- **Algoritmo:** Extrai mês do label, agrupa em Q1-Q4 por ano, soma receita/pedidos.
- **Complexidade:** O(n)

### 6. `forecast.ts` — Regressão Linear

- **Função:** `calcForecast(mensais, periods?, lookback?): ForecastEntry[]`
- **Algoritmo:** Regressão linear simples sobre os últimos `lookback` (12) meses. Calcula slope + intercept, projeta N períodos.
- **Retorna:** Labels `"+1m"`, `"+2m"` etc. Valores negativos são truncados para 0.
- **Requisito:** Mínimo de 2 meses no lookback.
- **Complexidade:** O(n)

### 7. `seasonality.ts` — Sazonalidade

- **Função:** `calcSeasonality(mensais, monthNames): SeasonalEntry[]`
- **Algoritmo:** Agrupa receita por mês do ano (1-12), calcula média.
- **Complexidade:** O(n)

### 8. `product-growth.ts` — Produtos em Alta

- **Função:** `calcProductGrowth(eventos): ProdGrowth[]`
- **Algoritmo:** Divide eventos ao meio. Compara receita de cada produto na 1ª metade vs 2ª metade. Retorna top 10 por crescimento %.
- **Requisito:** Mínimo de 2 eventos.
- **Complexidade:** O(n × p) onde p = produtos por evento

### 9. `ticket-growth.ts` — Evolução do Ticket

- **Função:** `calcTicketGrowth(mensais): TicketGrowthResult`
- **Algoritmo:** Ticket atual = média dos últimos 6 meses. Ticket anterior = média dos primeiros 6 meses. Growth % = (atual - anterior) / anterior.
- **Complexidade:** O(n)

### 10. `categories.ts` — Análise de Categorias

- **Função:** `analyzeCategories(categorias): { sortedCats, top3CatPct }`
- **Algoritmo:** Ordena categorias por total decrescente, soma o % das top 3.
- **Complexidade:** O(n log n) (sort)

### 11. `events.ts` — Eventos Normalizados

- **Função:** `analyzeEvents(eventos): { bestNorm, worstNorm, scatterData }`
- **Algoritmo:** Calcula receita/dia para cada evento. Top 3 melhores e piores. Gera dados de dispersão (duração × receita).
- **Complexidade:** O(n log n) (sort)

---

## Princípios de Design

### 1. Zero Dependências Runtime

Nenhuma dependência no `package.json` além de TypeScript e ferramentas de build/teste. O código produzido não importa nada de terceiros.

```bash
$ npm ls --depth=0
yuzer-intelligence-engine@0.1.0
├── tsup
├── typescript
└── vitest
```

### 2. Funções Puras

Toda função:
- Não modifica os argumentos de entrada (sempre faz `[...arr]` antes de sortear)
- Não produz side effects (sem console.log, sem I/O, sem estado global)
- Retorna o mesmo resultado para os mesmos argumentos
- Tipos de retorno são explícitos e imutáveis

### 3. TypeScript Strict

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": false,
  "verbatimModuleSyntax": true
}
```

- Sem `any` em todo o código
- Sem expressões implícitas `any`
- Todos os imports/exports de tipo usam `import type` / `export type`
- Build limpo com `tsc --noEmit`: 0 erros

### 4. Tree-shakeable

Cada métrica é exportada individualmente via `src/index.ts`:

```typescript
// Importa apenas o que precisa
import { calcCAGR, calcPareto } from 'yuzer-intelligence-engine'
```

### 5. ESM + CJS + DTS

Build via `tsup` gera três formatos:
- `dist/index.js` — ESM nativo (ES2022)
- `dist/index.cjs` — CommonJS
- `dist/index.d.ts` — Declarações TypeScript

`exports` no `package.json` mapeia cada formato corretamente.

### 6. Casos de Borda Protegidos

Todas as métricas tratam:
- Arrays vazios → retorno default (0, [], null)
- Arrays com 1 elemento → cálculos que precisam de 2+ retornam 0
- Divisão por zero → retorna 0
- Valores negativos em forecast → truncados para 0

---

## Pipeline de Execução (engine.ts)

O orquestrador `analyze()` segue uma pipeline sequencial simples:

```
1. calcMom(mensais)                                    ← MomEntry[]
2. calcQuarters(mensais, monthNames)                   ← QuarterEntry[]
3. calcCAGR(mensais)                                   ← number
4. calcCorrelation(mensais)                            ← number
5. analyzeCategories(categorias)                        ← { sortedCats, top3CatPct }
6. calcPareto(produtoMix, threshold)                   ← { topN, topPct }
7. calcProductGrowth(eventos)                          ← ProdGrowth[]
8. calcSeasonality(mensais, monthNames)                 ← SeasonalEntry[]
9. calcForecast(mensais, forecastPeriods)               ← ForecastEntry[]
10. calcTicketGrowth(mensais)                           ← { tt, to, tg }
11. analyzeEvents(eventos)                             ← { bestNorm, worstNorm, scatterData }
12. Melhor/pior mês (sort inline)                      ← { bestMonth, worstMonth }
13. sortedProds (sort inline)                          ← ProdutoMix[]
```

Não há dependência entre as métricas — todas poderiam ser executadas em paralelo teoricamente, mas a pipeline sequencial simplifica o trace e a depuração.

---

## Tratamento de Casos de Borda

| Cenário | Comportamento |
|---------|---------------|
| `mensais` vazio | CAGR = 0, mom = [], quarters = [], seasonal = [], forecast = [], bestMonth/worstMonth = null |
| `mensais` com 1 item | CAGR = 0, correlation = 0, forecast = [], mom funciona parcialmente |
| `mensais` com < 12 itens | CAGR = 0 |
| `mensais` com < 2 itens | forecast = [], correlation = 0 |
| `eventos` vazio | prodGrowth = [], bestNorm/worstNorm = [], scatterData = [] |
| `eventos` com 1 item | prodGrowth = [] (precisa de 2+) |
| `produtoMix` vazio | topN = 0, topPct = 0 |
| `categorias` vazio | top3CatPct = 0, sortedCats = [] |
| Divisão por zero em CAGR | Retorna 0 |
| Divisão por zero em ticket | Retorna NaN (tt e to) — consciente, documentado |
| Valor de forecast negativo | Truncado para 0 (`Math.max(0, ...)`) |

---

## Integração com o Ecossistema

### Build

```bash
npm run build      # tsup → dist/ (ESM + CJS + DTS + sourcemaps)
npm run dev        # watch mode
```

### Testes

```bash
npm test             # vitest run (79 testes)
npm run test:watch   # vitest watch
npm run test:coverage # vitest + c8 (>95% thresholds)
```

### Type Checking

```bash
npm run typecheck    # tsc --noEmit (0 erros)
```

### Publicação

```bash
npm run prepublishOnly  # build + test
npm publish             # publica dist/ + src/ + README + LICENSE
```

---

## Licença

MIT © Tiago Hanna
