import { describe, it, expect } from 'vitest'
import { calcPareto } from '../../src/metrics/pareto'
import { sampleProdutoMix } from '../fixtures/sample-data'

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
    // Total = 184782+142388+103153+87506+28456+22698+18762+15098+12341+8743 = 643927
    // VINHO: 184782 → 28.69%
    // DRINK: 327170 → 50.80%
    // DOSE: 430323 → 66.83%
    // CERVEJA: 517829 → 80.41% ← atinge 80%
    expect(result.topN).toBe(4)
    expect(result.topPct).toBeCloseTo((517829 / 623927) * 100, 1)
    expect(result.topPct).toBeGreaterThanOrEqual(80)
  })

  it('deve aceitar threshold customizado (ex: 0.5 = 50%)', () => {
    const result = calcPareto(sampleProdutoMix, 0.5)
    // VINHO: 28.69%, VINHO+DRINK: 50.80% → atinge 50% no 2º
    expect(result.topN).toBe(2)
  })

  it('deve retornar todos os produtos se threshold não for atingido', () => {
    const result = calcPareto(sampleProdutoMix, 0.99)
    expect(result.topN).toBe(sampleProdutoMix.length)
    expect(result.topPct).toBeCloseTo(100, 0)
  })
})
