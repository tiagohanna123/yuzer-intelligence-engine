import type { Categoria } from '../types'

/**
 * Análise de categorias: ordenação + concentração top 3.
 */
export function analyzeCategories(categorias: Categoria[]) {
  const sorted = [...categorias].sort((a, b) => b.total - a.total)
  const top3CatPct = sorted.slice(0, 3).reduce((s, c) => s + c.pct, 0)
  return { sortedCats: sorted, top3CatPct }
}
