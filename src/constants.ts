/* ── Paleta de cores ──────────────────────────────── */

export const GOLD = '#c8a96e'
export const PURPLE = '#a78bfa'
export const BLUE = '#60a5fa'
export const GREEN = '#34d399'
export const PINK = '#f472b6'
export const ORANGE = '#fb923c'
export const PALETA = [GOLD, PURPLE, BLUE, GREEN, PINK, ORANGE]

/* ── Nomes dos meses (português) ──────────────────── */

export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/* ── Limiares para insights ────────────────────────── */

export const THRESHOLDS = {
  CAGR: { verde: 15, amarelo: 5 },
  TICKET: { verde: 5, amarelo: -5 },
  CONCENTRACAO: { verde: 65, amarelo: 85 },
  CORRELACAO: { forte: 0.9, media: 0.7, moderada: 0.5 },
  PARETO: { saudavel: 10, moderado: 5 },
} as const
