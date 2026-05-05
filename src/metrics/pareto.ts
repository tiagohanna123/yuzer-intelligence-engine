import type { ProdutoMix } from '../types'

export interface ParetoResult {
  topN: number   // quantos produtos geram 80% da receita
  topPct: number // % da receita acumulada desses N produtos
}

/**
 * Análise de Pareto: quantos produtos geram `threshold` da receita.
 * Default: 80%.
 */
export function calcPareto(
  produtoMix: ProdutoMix[],
  threshold = 0.8,
): ParetoResult {
  const sorted = [...produtoMix].sort((a, b) => b.total - a.total)
  const total = sorted.reduce((s, p) => s + p.total, 0)
  let acc = 0
  let topN = 0

  for (const p of sorted) {
    acc += p.total
    topN++
    if (acc / total >= threshold) {
      return { topN, topPct: (acc / total) * 100 }
    }
  }

  return { topN, topPct: total > 0 ? (acc / total) * 100 : 0 }
}
