import type { Evento, ScatterPoint } from '../types'
import type { EventoRank } from '../types'

/**
 * Normaliza eventos por receita/dia e gera dados de dispersão.
 */
export function analyzeEvents(eventos: Evento[]) {
  const bestNorm: EventoRank[] = [...eventos]
    .sort((a, b) => (b.revenue / b.days) - (a.revenue / a.days))
    .slice(0, 3)
    .map(e => ({ start: e.start, revenue: e.revenue }))

  const worstNorm: EventoRank[] = [...eventos]
    .sort((a, b) => (a.revenue / a.days) - (b.revenue / a.days))
    .slice(0, 3)
    .map(e => ({ start: e.start, revenue: e.revenue }))

  const scatterData: ScatterPoint[] = eventos.map(e => ({
    duracao: e.days,
    receita: e.revenue,
    nome: e.start,
  }))

  return { bestNorm, worstNorm, scatterData }
}
