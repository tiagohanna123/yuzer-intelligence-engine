import type { Mensal } from '../types'

/**
 * Evolução do ticket médio:
 *   tt = média últimos 6 meses
 *   to = média primeiros 6 meses
 *   tg = crescimento percentual de to → tt
 */
export interface TicketGrowthResult {
  tt: number  // ticket atual
  to: number  // ticket anterior
  tg: number  // crescimento %
}

export function calcTicketGrowth(mensais: Mensal[]): TicketGrowthResult {
  const n = Math.min(6, mensais.length)
  const tt = mensais.slice(-n).reduce((s, m) => s + m.ticketMedio, 0) / n
  const to = mensais.slice(0, n).reduce((s, m) => s + m.ticketMedio, 0) / n
  const tg = to > 0 ? ((tt - to) / to) * 100 : 0
  return { tt, to, tg }
}
