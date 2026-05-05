import type { Evento, ProdGrowth } from '../types'

/**
 * Identifica produtos em alta comparando 1ª metade vs 2ª metade
 * dos eventos. Retorna top 10 por crescimento.
 */
export function calcProductGrowth(eventos: Evento[]): ProdGrowth[] {
  if (eventos.length < 2) return []

  const mid = Math.floor(eventos.length / 2)
  const fh = eventos.slice(0, mid)
  const sh = eventos.slice(mid)

  const pf: Record<string, number> = {}
  const ps: Record<string, number> = {}

  for (const ev of fh) {
    for (const p of ev.produtos) {
      pf[p.name] = (pf[p.name] || 0) + p.total
    }
  }
  for (const ev of sh) {
    for (const p of ev.produtos) {
      ps[p.name] = (ps[p.name] || 0) + p.total
    }
  }

  return Object.keys(ps)
    .map(n => ({
      name: n,
      f: pf[n] || 0,
      s: ps[n] || 0,
      g: (pf[n] || 0) > 0
        ? ((ps[n] - (pf[n] || 0)) / (pf[n] || 0)) * 100
        : (ps[n] > 0 ? 100 : 0),
    }))
    .sort((a, b) => b.g - a.g)
    .slice(0, 10)
}
