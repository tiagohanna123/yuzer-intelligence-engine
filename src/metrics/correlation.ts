import type { Mensal } from '../types'

/**
 * Correlação de Pearson entre receita e pedidos.
 * Retorna valor entre -1 e 1.
 */
export function calcCorrelation(mensais: Mensal[]): number {
  if (mensais.length < 2) return 0
  const cr = mensais.map(m => m.revenue)
  const co = mensais.map(m => m.orders)
  const ar = cr.reduce((a, b) => a + b, 0) / cr.length
  const ao = co.reduce((a, b) => a + b, 0) / co.length

  let num = 0
  let denX = 0
  let denY = 0
  for (let i = 0; i < cr.length; i++) {
    const dx = cr[i] - ar
    const dy = co[i] - ao
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }

  const den = Math.sqrt(denX * denY)
  return den > 0 ? num / den : 0
}
