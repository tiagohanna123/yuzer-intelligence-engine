import type { Mensal, ForecastEntry } from '../types'

/**
 * Regressão linear simples sobre os últimos N meses.
 * Retorna array de previsões para os próximos `periods` meses.
 */
export function calcForecast(
  mensais: Mensal[],
  periods = 3,
  lookback = 12,
): ForecastEntry[] {
  const lastN = mensais.slice(-lookback)
  if (lastN.length < 2) return []

  const n = lastN.length
  const xm = (n - 1) / 2
  const ym = lastN.reduce((s, m) => s + m.revenue, 0) / n

  let sn = 0
  let sd = 0
  for (let i = 0; i < n; i++) {
    sn += (i - xm) * (lastN[i].revenue - ym)
    sd += (i - xm) ** 2
  }

  const slope = sd > 0 ? sn / sd : 0
  const intercept = ym - slope * xm

  return Array.from({ length: periods }, (_, i) => ({
    label: `+${i + 1}m`,
    previsto: Math.max(0, intercept + slope * (n + i)),
  }))
}
