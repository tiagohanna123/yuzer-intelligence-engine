/**
 * Yuzer Intelligence Engine
 *
 * Motor de análise para dados de bar e eventos — CAGR, correlações,
 * Pareto, sazonalidade, previsão por regressão linear, produtos em alta.
 * Zero dependências. 100% TypeScript.
 */

export { analyze } from './engine'
export type { AnalysisResult, AnalyzeOptions } from './types'
export type {
  Mensal, Evento, ProdutoMix, Categoria, ProdutoEvento,
  MetodoPagamento, MomEntry, QuarterEntry, ProdGrowth,
  ForecastEntry, ScatterPoint, SeasonalEntry, EventoRank,
} from './types'

/* Métricas individuais (tree-shakeable) */
export { calcMom } from './metrics/mom'
export { calcQuarters } from './metrics/quarters'
export { calcCAGR } from './metrics/cagr'
export { calcCorrelation } from './metrics/correlation'
export { calcPareto } from './metrics/pareto'
export { calcForecast } from './metrics/forecast'
export { calcSeasonality } from './metrics/seasonality'
export { calcProductGrowth } from './metrics/product-growth'
export { calcTicketGrowth } from './metrics/ticket-growth'
export type { TicketGrowthResult } from './metrics/ticket-growth'
export { analyzeCategories } from './metrics/categories'
export { analyzeEvents } from './metrics/events'

/* Utilitários */
export { fmt, fmtNum, pct, pctAbs, round } from './formatters'
export { GOLD, PURPLE, BLUE, GREEN, PINK, ORANGE, PALETA, MESES, THRESHOLDS } from './constants'
