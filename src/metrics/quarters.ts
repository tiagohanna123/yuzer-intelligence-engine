import type { Mensal, QuarterEntry } from '../types'

/**
 * Agrega receita e pedidos por trimestre (Q1-Q4).
 */
export function calcQuarters(mensais: Mensal[], monthNames: string[]): QuarterEntry[] {
  const quarters: QuarterEntry[] = []

  for (const m of mensais) {
    const parts = m.label.split('/')
    const idx = monthNames.indexOf(parts[0])
    if (idx < 0) continue
    const yr = parseInt(parts[1]) || 2000
    const q = `Q${Math.ceil((idx + 1) / 3)} ${yr}`
    const ex = quarters.find(x => x.label === q)
    if (ex) {
      ex.revenue += m.revenue
      ex.orders += m.orders
      ex.count++
    } else {
      quarters.push({ label: q, revenue: m.revenue, orders: m.orders, count: 1 })
    }
  }

  return quarters
}
