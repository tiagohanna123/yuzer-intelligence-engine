import type { Mensal, MomEntry } from '../types'

/**
 * Mês a mês com growth percentual e média móvel 3 meses.
 */
export function calcMom(mensais: Mensal[]): MomEntry[] {
  return mensais.map((m, i) => ({
    ...m,
    growth: i > 0 && mensais[i - 1].revenue > 0
      ? ((m.revenue - mensais[i - 1].revenue) / mensais[i - 1].revenue) * 100
      : 0,
    ma3: i >= 2
      ? (mensais[i].revenue + mensais[i - 1].revenue + mensais[i - 2].revenue) / 3
      : m.revenue,
  }))
}
