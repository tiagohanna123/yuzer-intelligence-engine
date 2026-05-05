import type {
  Mensal, Evento, ProdutoMix, Categoria,
  AnalysisResult, AnalyzeOptions,
} from './types'
import { MESES } from './constants'
import { calcMom } from './metrics/mom'
import { calcQuarters } from './metrics/quarters'
import { calcCAGR } from './metrics/cagr'
import { calcCorrelation } from './metrics/correlation'
import { calcPareto } from './metrics/pareto'
import { calcForecast } from './metrics/forecast'
import { calcSeasonality } from './metrics/seasonality'
import { calcProductGrowth } from './metrics/product-growth'
import { calcTicketGrowth } from './metrics/ticket-growth'
import { analyzeCategories } from './metrics/categories'
import { analyzeEvents } from './metrics/events'

/**
 * Motor de Inteligência — analisa dados de bar/eventos e retorna
 * todas as métricas de negócio em um único resultado tipado.
 *
 * @example
 * ```ts
 * import { analyze } from 'yuzer-intelligence-engine'
 *
 * const result = analyze(mensais, eventos, produtoMix, categorias)
 * console.log(result.cagr)       // 18.5
 * console.log(result.correlation) // 0.92
 * ```
 */
export function analyze(
  mensais: Mensal[],
  eventos: Evento[],
  produtoMix: ProdutoMix[],
  categorias: Categoria[],
  options: AnalyzeOptions = {},
): AnalysisResult {
  const monthNames = options.monthNames ?? MESES
  const forecastPeriods = options.forecastPeriods ?? 3
  const paretoThreshold = options.paretoThreshold ?? 0.8

  /* Métricas sequenciais (algumas dependem de outras) */
  const mom = calcMom(mensais)
  const quarters = calcQuarters(mensais, monthNames)
  const cagr = calcCAGR(mensais)
  const correlation = calcCorrelation(mensais)
  const { sortedCats, top3CatPct } = analyzeCategories(categorias)
  const { topN, topPct } = calcPareto(produtoMix, paretoThreshold)
  const prodGrowth = calcProductGrowth(eventos)
  const seasonal = calcSeasonality(mensais, monthNames)
  const forecast = calcForecast(mensais, forecastPeriods)
  const { tt, to, tg } = calcTicketGrowth(mensais)
  const { bestNorm, worstNorm, scatterData } = analyzeEvents(eventos)

  /* Melhor / pior mês */
  const sortedByRev = [...mensais].sort((a, b) => b.revenue - a.revenue)
  const bestMonth = sortedByRev.length > 0
    ? { label: sortedByRev[0].label, revenue: sortedByRev[0].revenue }
    : null
  const worstMonth = sortedByRev.length > 0
    ? { label: sortedByRev[sortedByRev.length - 1].label, revenue: sortedByRev[sortedByRev.length - 1].revenue }
    : null

  return {
    mom,
    quarters,
    cagr,
    bestMonth,
    worstMonth,
    top3CatPct,
    topN,
    topPct,
    prodGrowth,
    correlation,
    scatterData,
    bestNorm,
    worstNorm,
    seasonal,
    forecast,
    tg,
    tt,
    to,
    sortedCats,
    sortedProds: [...produtoMix].sort((a, b) => b.total - a.total),
  }
}
