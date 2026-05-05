import type { Mensal, SeasonalEntry } from '../types'

/**
 * Agrupa receita média por mês do ano para identificar sazonalidade.
 */
export function calcSeasonality(
  mensais: Mensal[],
  monthNames: string[],
): SeasonalEntry[] {
  const byMonth: Partial<Record<number, { r: number; c: number }>> = {}

  for (const m of mensais) {
    const idx = monthNames.indexOf(m.label.split('/')[0]) + 1
    if (idx < 1 || idx > 12) continue
    byMonth[idx] ??= { r: 0, c: 0 }
    byMonth[idx].r += m.revenue
    byMonth[idx].c++
  }

  return Object.entries(byMonth)
    .map(([k, d]) => ({
      mes: monthNames[parseInt(k) - 1],
      media: d.r / d.c,
    }))
}
