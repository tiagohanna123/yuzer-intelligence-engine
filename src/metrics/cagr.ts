import type { Mensal } from '../types'

/**
 * CAGR — Compound Annual Growth Rate.
 * Compara últimos 6 meses vs primeiros 6 meses.
 */
export function calcCAGR(mensais: Mensal[]): number {
  if (mensais.length < 12) return 0
  const f6 = mensais.slice(0, 6).reduce((s, m) => s + m.revenue, 0)
  const l6 = mensais.slice(-6).reduce((s, m) => s + m.revenue, 0)
  const periods = Math.max(mensais.length / 12, 0.1)
  return f6 > 0 ? ((l6 / f6) ** (1 / periods) - 1) * 100 : 0
}
