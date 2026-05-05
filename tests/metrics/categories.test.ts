import { describe, it, expect } from 'vitest'
import { analyzeCategories } from '../../src/metrics/categories'
import type { Categoria } from '../../src/types'
import { sampleCategorias } from '../fixtures/sample-data'

describe('analyzeCategories — Análise de Categorias', () => {
  it('deve retornar sortedCats vazio e top3CatPct=0 para array vazio', () => {
    const result = analyzeCategories([])
    expect(result.sortedCats).toEqual([])
    expect(result.top3CatPct).toBe(0)
  })

  it('deve ordenar categorias por total decrescente', () => {
    const result = analyzeCategories(sampleCategorias)
    for (let i = 1; i < result.sortedCats.length; i++) {
      expect(result.sortedCats[i].total).toBeLessThanOrEqual(result.sortedCats[i - 1].total)
    }
  })

  it('deve calcular top3CatPct corretamente', () => {
    const result = analyzeCategories(sampleCategorias)
    // Outros(78.1) + Parede(13.1) + Alimentação(4.7) = 95.9
    expect(result.top3CatPct).toBeCloseTo(78.1 + 13.1 + 4.7, 1)
  })

  it('deve calcular top3CatPct para array menor que 3', () => {
    const duas: Categoria[] = [
      { name: 'A', qty: 10, total: 100, pct: 60 },
      { name: 'B', qty: 10, total: 50, pct: 40 },
    ]
    const result = analyzeCategories(duas)
    expect(result.top3CatPct).toBeCloseTo(100, 1)
  })

  it('não deve modificar o array original', () => {
    const original = [...sampleCategorias]
    const result = analyzeCategories(sampleCategorias)
    expect(sampleCategorias).toEqual(original)
    // sortedCats deve ser outro array
    expect(result.sortedCats).not.toBe(sampleCategorias)
  })
})
