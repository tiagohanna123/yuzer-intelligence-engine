# Guia de Aprendizado — Yuzer Intelligence Engine

> **Público:** Desenvolvedores novos no projeto · **Tempo estimado:** 30 min

---

## Índice

1. [O que é esse projeto?](#1-o-que-é-esse-projeto)
2. [Configuração do Ambiente](#2-configuração-do-ambiente)
3. [Arquitetura em 5 Minutos](#3-arquitetura-em-5-minutos)
4. [Tour pelo Código](#4-tour-pelo-código)
5. [Como Criar uma Nova Métrica](#5-como-criar-uma-nova-métrica)
6. [Testes: Como e Onde Testar](#6-testes-como-e-onde-testar)
7. [Build e Publicação](#7-build-e-publicação)
8. [Glossário](#8-glossário)
9. [Perguntas Frequentes](#9-perguntas-frequentes)

---

## 1. O que é esse projeto?

**Yuzer Intelligence Engine** é uma biblioteca TypeScript **zero dependências** que analisa dados financeiros de bar e eventos.

**O que ela faz:**
- Calcula CAGR, correlação de Pearson, Pareto (80/20)
- Gera previsões por regressão linear
- Identifica sazonalidade, produtos em alta, evolução do ticket médio
- Normaliza eventos por receita/dia
- Retorna 20 métricas em um único resultado tipado

**O que ela NÃO faz:**
- Não é um dashboard — é o **motor de análise** por trás de um dashboard
- Não faz conexão com banco de dados — você passa os dados prontos
- Não tem dependências runtime — é leve e portátil

### Casos de uso

- Dashboard de inteligência de negócio para bares/restaurantes
- API de relatórios financeiros
- Scripts de análise automatizada
- Exportação de insights para planilhas

---

## 2. Configuração do Ambiente

### Pré-requisitos

- **Node.js** ≥ 18 (recomendado 22)
- **npm** ≥ 9

### Setup

```bash
# Clone o repositório
git clone <url-do-repo>
cd yuzer-intelligence-engine

# Instale dependências (só devDependencies — tsup, typescript, vitest)
npm install

# Verifique se tudo funciona
npm test          # 79 testes, todos passando
npm run build     # gera dist/ com ESM + CJS + DTS
npm run typecheck # deve retornar sem erros
```

### Editor recomendado

VS Code com extensões:
- **TypeScript + JavaScript** (built-in)
- **Vitest** (para rodar testes inline)
- **Biome** ou **ESLint** (se quiser lint)

---

## 3. Arquitetura em 5 Minutos

```
src/
├── index.ts        → O que o mundo vê (barrel exports)
├── types.ts        → Interfaces de entrada/saída
├── engine.ts       → Orquestrador: chama todas as métricas
├── constants.ts    → Cores, meses, thresholds
├── formatters.ts   → Utilitários de formatação
└── metrics/        → 11 funções puras, cada uma em seu arquivo
```

### Fluxo de dados

```
Você chama:  analyze(mensais, eventos, produtoMix, categorias)
                │
                ▼
         engine.ts invoca 11 métricas
                │
                ▼
         Retorna AnalysisResult com 20 campos
```

### Padrão de cada métrica

Toda métrica segue este contrato:

```typescript
// 1. Importa só types (nunca outras métricas)
import type { Mensal } from '../types'

// 2. Função pura e tipada
export function calcAlgo(dados: Entrada[]): Saida[] {
  // 3. Sem mutação dos argumentos
  const sorted = [...dados].sort(...)
  
  // 4. Trata caso de borda primeiro
  if (dados.length < 2) return []
  
  // 5. Lógica principal sem side effects
  return sorted.map(...)
}
```

---

## 4. Tour pelo Código

### 4.1 `src/types.ts` — Interfaces

A base de tudo. Define:
- **Inputs:** `Mensal`, `Evento`, `ProdutoMix`, `Categoria`, `ProdutoEvento`, `MetodoPagamento`
- **Outputs:** `MomEntry`, `QuarterEntry`, `ProdGrowth`, `ForecastEntry`, `ScatterPoint`, `SeasonalEntry`, `EventoRank`, `AnalysisResult`
- **Config:** `AnalyzeOptions`

```typescript
// Exemplo: a interface central de entrada
export interface Mensal {
  mes: string          // "2023-11"
  label: string        // "Nov/2023"
  eventos: number
  orders: number
  revenue: number
  ticketMedio: number
}
```

### 4.2 `src/engine.ts` — Orquestrador

Função `analyze()` que:
1. Extrai opções (com defaults)
2. Chama cada métrica na ordem
3. Calcula bestMonth/worstMonth/sortedProds inline
4. Monta e retorna `AnalysisResult`

**Não há lógica de negócio complexa aqui** — só orquestração.

### 4.3 `src/metrics/cagr.ts` — Exemplo de métrica simples

```typescript
export function calcCAGR(mensais: Mensal[]): number {
  if (mensais.length < 12) return 0              // guard clause
  const f6 = mensais.slice(0, 6).reduce(...)      // primeiros 6 meses
  const l6 = mensais.slice(-6).reduce(...)         // últimos 6 meses
  const periods = Math.max(mensais.length / 12, 0.1)
  return f6 > 0 ? ((l6 / f6) ** (1 / periods) - 1) * 100 : 0
}
```

### 4.4 `src/metrics/forecast.ts` — Exemplo de média complexidade

Regressão linear simples:
1. Pega últimos 12 meses (lookback)
2. Calcula slope (inclinação) e intercept da reta
3. Projeta `periods` meses no futuro
4. Valores negativos viram 0

### 4.5 `src/constants.ts` — Valores fixos

```typescript
export const THRESHOLDS = {
  CAGR: { verde: 15, amarelo: 5 },
  TICKET: { verde: 5, amarelo: -5 },
  CONCENTRACAO: { verde: 65, amarelo: 85 },
  CORRELACAO: { forte: 0.9, media: 0.7, moderada: 0.5 },
  PARETO: { saudavel: 10, moderado: 5 },
}
```

### 4.6 `src/formatters.ts` — Formatadores

```typescript
fmt(52341)       // "R$ 52.341"
fmtNum(17939)    // "17.939"
pct(18.5)        // "+18.5%"
pctAbs(78.1)     // "78.1%"
round(3.14159)   // 3.14
```

### 4.7 Testes

Usamos **Vitest**. Os testes estão em:

- `tests/engine.test.ts` — 23 testes integrados (testa o orquestrador completo)
- `tests/metrics/*.test.ts` — 56 testes unitários (um arquivo por métrica)
- `tests/fixtures/sample-data.ts` — Dados de exemplo reais simplificados

Todos os testes usam dados mock do fixture, nunca dependem de rede ou arquivos externos.

---

## 5. Como Criar uma Nova Métrica

### Passo a passo

**1. Crie o arquivo em `src/metrics/sua-metrica.ts`**

```typescript
import type { Mensal } from '../types'

export interface SuaMetricaResult {
  campo1: number
  campo2: string
}

export function calcSuaMetrica(mensais: Mensal[]): SuaMetricaResult {
  if (mensais.length === 0) return { campo1: 0, campo2: '' }
  
  const sorted = [...mensais].sort((a, b) => b.revenue - a.revenue)
  // ... lógica ...
  
  return { campo1: sorted[0].revenue, campo2: sorted[0].label }
}
```

**2. Exporte em `src/index.ts`**

```typescript
export { calcSuaMetrica } from './metrics/sua-metrica'
export type { SuaMetricaResult } from './metrics/sua-metrica'
```

**3. Adicione ao orquestrador em `src/engine.ts`**

```typescript
import { calcSuaMetrica } from './metrics/sua-metrica'

// Dentro de analyze():
const suaMetrica = calcSuaMetrica(mensais)

// No retorno:
return {
  ...existingFields,
  suaMetrica,  // adicione o campo ao AnalysisResult
}
```

**4. Adicione o campo ao tipo `AnalysisResult` em `types.ts`**

```typescript
export interface AnalysisResult {
  // ... campos existentes ...
  suaMetrica: SuaMetricaResult
}
```

**5. Crie o teste em `tests/metrics/sua-metrica.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { calcSuaMetrica } from '../../src/metrics/sua-metrica'
import { sampleMensais } from '../fixtures/sample-data'

describe('calcSuaMetrica', () => {
  it('deve retornar o resultado esperado', () => {
    const result = calcSuaMetrica(sampleMensais)
    expect(result.campo1).toBeGreaterThan(0)
  })

  it('deve tratar array vazio', () => {
    const result = calcSuaMetrica([])
    expect(result.campo1).toBe(0)
  })
})
```

**6. Rode os testes**

```bash
npm test
```

---

## 6. Testes: Como e Onde Testar

### Rodando testes

```bash
npm test              # Todos os testes (79)
npm run test:watch    # Modo watch - re-roda ao salvar
npm run test:coverage # Cobertura (threshold: 95% statements, 90% branches)
```

### Estrutura de testes

```
tests/
├── engine.test.ts              # Testes integrados do analyze()
└── metrics/
    ├── mom.test.ts             # Testes unitários do calcMom
    ├── cagr.test.ts            # Testes do calcCAGR
    ├── correlation.test.ts     # Testes do calcCorrelation
    ├── pareto.test.ts          # Testes do calcPareto
    ├── quarters.test.ts        # Testes do calcQuarters
    ├── forecast.test.ts        # Testes do calcForecast
    ├── seasonality.test.ts     # Testes do calcSeasonality
    ├── product-growth.test.ts  # Testes do calcProductGrowth
    ├── ticket-growth.test.ts   # Testes do calcTicketGrowth
    ├── categories.test.ts      # Testes do analyzeCategories
    └── events.test.ts          # Testes do analyzeEvents
```

### Dados de teste

`tests/fixtures/sample-data.ts` contém:
- **`sampleMensais`** — 18 meses de dados agregados
- **`sampleEventos`** — 6 eventos com produtos
- **`sampleProdutoMix`** — 10 produtos ordenados
- **`sampleCategorias`** — 5 categorias
- **`emptyMensais`** — Array vazio (caso de borda)
- **`singleMensal`** — 1 mês apenas (caso de borda)
- **`twoMensais`** — 2 meses (caso de borda)

### Convenções

- Use `describe` + `it` (não `test`)
- Nomeie testes em português descritivo: `'deve calcular CAGR para 18 meses'`
- Teste sempre o caso feliz e pelo menos um caso de borda
- Use `toEqual` para arrays/objetos, `toBe` para primitivos
- Evite mocks — os dados de fixture são suficientes

---

## 7. Build e Publicação

### Build

```bash
npm run build
```

Gera em `dist/`:
- `index.js` — ESM (ES2022 modules)
- `index.cjs` — CommonJS
- `index.d.ts` — TypeScript declarations
- `index.js.map` / `index.d.ts.map` — Sourcemaps

### Type check

```bash
npm run typecheck   # tsc --noEmit — 0 erros esperado
```

### Publicação (npm)

O `package.json` já configura:
- `"files": ["dist", "src", "README.md", "LICENSE"]`
- `"main"`, `"module"`, `"types"` e `"exports"` apontando para `dist/`
- Script `prepublishOnly` que roda build + test

```bash
npm version patch  # ou minor, major
npm publish
```

---

## 8. Glossário

| Termo | Significado |
|-------|-------------|
| **CAGR** | Compound Annual Growth Rate — taxa de crescimento anual composta |
| **Pearson R** | Correlação linear entre duas variáveis (-1 a 1) |
| **Pareto (80/20)** | Princípio: 80% dos resultados vêm de 20% das causas |
| **MA3** | Média Móvel de 3 meses — suaviza oscilações |
| **Regressão Linear** | Modelo que projeta valores futuros baseado em tendência linear |
| **Sazonalidade** | Padrões que se repetem em meses específicos do ano |
| **Ticket Médio** | Receita total / número de pedidos |
| **Tree-shaking** | Eliminação de código não utilizado pelo bundler |
| **ESM** | ECMAScript Modules (import/export nativo) |
| **CJS** | CommonJS (require/module.exports) |
| **DTS** | TypeScript Declaration File (.d.ts) |
| **tsup** | Bundler TypeScript baseado em esbuild |

---

## 9. Perguntas Frequentes

### Por que zero dependências runtime?

Para manter o pacote leve, seguro e sem conflitos de versão. Toda a lógica matemática é implementada manualmente em vez de importar bibliotecas de estatística.

### Por que não usar `any`?

TypeScript strict com `noUnusedLocals` e `noUnusedParameters` garante que o código seja 100% tipado. Isso previne erros em produção e melhora a DX com autocomplete.

### Por que as funções são puras?

Funções puras são previsíveis, testáveis e seguras para usar em qualquer contexto (React, Node, APIs). Sem mutação de argumentos, sem estado global.

### Posso usar no browser?

Sim! O build gera ESM puro. Basta importar:

```html
<script type="module">
  import { analyze } from 'yuzer-intelligence-engine'
</script>
```

### Por que português nos nomes?

O projeto é mantido por Tiago Hanna (BR) e os dados de entrada são de estabelecimentos brasileiros. Manter meses, labels e documentação em PT-BR reduz atrito cognitivo para o público-alvo.

### Como contribuir?

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Faça suas alterações
4. Rode `npm test` e `npm run typecheck`
5. Abra um Pull Request

---

> **Dúvidas?** Abra uma issue no repositório ou consulte a [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes técnicos aprofundados.
