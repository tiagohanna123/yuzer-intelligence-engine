/**
 * Formatadores de valor para exibição em dashboards.
 * Todos são puros e imutáveis.
 */

/** Moeda BRL sem centavos */
export function fmt(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  })
}

/** Número com separador de milhar */
export function fmtNum(n: number): string {
  return n.toLocaleString('pt-BR')
}

/** Percentual com sinal */
export function pct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
}

/** Percentual absoluto (sem sinal) */
export function pctAbs(v: number): string {
  return `${v.toFixed(1)}%`
}

/** Arredonda para 2 casas */
export function round(n: number, decimals = 2): number {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}
