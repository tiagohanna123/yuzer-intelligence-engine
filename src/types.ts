/* ── Input Types (dados de entrada) ────────────────── */

export interface Mensal {
  mes: string        // "2023-11"
  label: string      // "Nov/2023" ou "2023-11"
  eventos: number
  orders: number
  revenue: number
  ticketMedio: number
}

export interface ProdutoEvento {
  name: string
  qty: number
  total: number
  pct: number
}

export interface MetodoPagamento {
  method: string
  total: number
  pct: number
}

export interface Evento {
  start: string
  end: string
  days: number
  orders: number
  revenue: number
  ticketMedio: number
  itensVendidos: number
  produtos: ProdutoEvento[]
  metodosPagamento: MetodoPagamento[]
}

export interface Categoria {
  name: string
  qty: number
  total: number
  pct: number
}

export interface ProdutoMix {
  name: string
  qty: number
  total: number
  pct: number
}

/* ── Output Types (métricas computadas) ────────────── */

export interface MomEntry {
  mes: string
  label: string
  eventos: number
  orders: number
  revenue: number
  ticketMedio: number
  growth: number    // % vs mês anterior
  ma3: number       // média móvel 3 meses
}

export interface QuarterEntry {
  label: string     // "Q1 2024"
  revenue: number
  orders: number
  count: number
}

export interface ProdGrowth {
  name: string
  f: number         // total na 1ª metade
  s: number         // total na 2ª metade
  g: number         // crescimento %
}

export interface ForecastEntry {
  label: string     // "+1m", "+2m", "+3m"
  previsto: number  // receita prevista
}

export interface ScatterPoint {
  duracao: number
  receita: number
  nome: string
}

export interface SeasonalEntry {
  mes: string       // "Jan", "Fev", ...
  media: number     // receita média
}

export interface EventoRank {
  start: string
  revenue: number
}

export interface AnalysisResult {
  mom: MomEntry[]
  quarters: QuarterEntry[]
  cagr: number
  bestMonth: { label: string; revenue: number } | null
  worstMonth: { label: string; revenue: number } | null
  top3CatPct: number
  topN: number       // quantos produtos geram 80%
  topPct: number     // % da receita desses N produtos
  prodGrowth: ProdGrowth[]
  correlation: number
  scatterData: ScatterPoint[]
  bestNorm: EventoRank[]
  worstNorm: EventoRank[]
  seasonal: SeasonalEntry[]
  forecast: ForecastEntry[]
  tg: number         // ticket growth %
  tt: number         // ticket atual (média últimos 6 meses)
  to: number         // ticket anterior (média primeiros 6 meses)
  sortedCats: Categoria[]
  sortedProds: ProdutoMix[]
}

/* ── Opções de configuração ────────────────────────── */

export interface AnalyzeOptions {
  /** Nomes dos meses abreviados (padrão: português) */
  monthNames?: string[]
  /** Períodos para forecast (padrão: 3) */
  forecastPeriods?: number
  /** Threshold Pareto (padrão: 0.8 = 80%) */
  paretoThreshold?: number
}
