import { describe, it, expect } from 'vitest'
import { calcPareto } from '../../src/metrics/pareto'
import { sampleProdutoMix, zeroTotalMix } from '../fixtures/sample-data'
import type { ProdutoMix } from '../../src/types'

describe('calcPareto — Análise de Pareto', () => {
  it('deve retornar topN=0 e topPct=0 para array vazio', () => {
    const result = calcPareto([], 0.8)
    expect(result.topN).toBe(0)
    expect(result.topPct).toBe(0)
  })

  it('deve retornar 1 produto se ele já atingir o threshold', () => {
    const single = [{ name: 'VINHO', qty: 100, total: 1000, pct: 100 }]
    const result = calcPareto(single, 0.8)
    expect(result.topN).toBe(1)
    expect(result.topPct).toBe(100)
  })

  it('deve identificar quantos produtos geram 80% da receita', () => {
    const result = calcPareto(sampleProdutoMix, 0.8)
    expect(result.topN).toBe(4)
  })

  it('deve aceitar threshold customizado (ex: 0.5 = 50%)', () => {
    const result = calcPareto(sampleProdutoMix, 0.5)
    expect(result.topN).toBe(2)
  })

  it('deve retornar todos os produtos se threshold não for atingido', () => {
    const result = calcPareto(sampleProdutoMix, 0.99)
    expect(result.topN).toBe(sampleProdutoMix.length)
    expect(result.topPct).toBeCloseTo(100, 0)
  })

  it('deve funcionar com total = 0 (acc/total = Infinity/NaN)', () => {
    const zeroTotal: ProdutoMix[] = [
      { name: 'VINHO', qty: 0, total: 0, pct: 0 },
      { name: 'DRINK', qty: 0, total: 0, pct: 0 },
    ]
    const result = calcPareto(zeroTotal, 0.8)
    expect(result.topN).toBe(2)
    expect(result.topPct).toBe(0)
  })

  it('deve cair no fallback total > 0 quando loop termina sem atingir threshold', () => {
    // threshold > 1.0 (impossível de atingir) → loop completa, cai no return final
    const result = calcPareto(sampleProdutoMix, 1.5)
    expect(result.topN).toBe(sampleProdutoMix.length)
    expect(result.topPct).toBeCloseTo(100, 0)
  })
})
