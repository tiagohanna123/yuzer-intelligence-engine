import { describe, it, expect } from 'vitest'
import { analyze } from '../src/engine'
import type { AnalysisResult } from '../src/types'
import { MESES } from '../src/constants'
import {
  sampleMensais,
  sampleEventos,
  sampleProdutoMix,
  sampleCategorias,
  emptyMensais,
  singleMensal,
  twoMensais,
} from './fixtures/sample-data'

const FULL_RESULT_FIELDS: (keyof AnalysisResult)[] = [
  'mom', 'quarters', 'cagr', 'bestMonth', 'worstMonth',
  'top3CatPct', 'topN', 'topPct', 'prodGrowth', 'correlation',
  'scatterData', 'bestNorm', 'worstNorm', 'seasonal', 'forecast',
  'tg', 'tt', 'to', 'sortedCats', 'sortedProds',
]

describe('analyze — Motor Completo (engine.ts)', () => {
  it('deve retornar todos os campos de AnalysisResult', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )

    for (const field of FULL_RESULT_FIELDS) {
      expect(result).toHaveProperty(field)
    }
  })

  it('deve calcular bestMonth e worstMonth corretamente', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )

    expect(result.bestMonth).not.toBeNull()
    expect(result.worstMonth).not.toBeNull()
    // Melhor mês: Out/2024 (62192)
    expect(result.bestMonth!.revenue).toBe(62192)
    expect(result.bestMonth!.label).toBe('Out/2024')
    // Pior mês: Dez/2023 (10697)
    expect(result.worstMonth!.revenue).toBe(10697)
    expect(result.worstMonth!.label).toBe('Dez/2023')
  })

  it('deve retornar bestMonth/worstMonth como null para mensais vazio', () => {
    const result = analyze(
      emptyMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.bestMonth).toBeNull()
    expect(result.worstMonth).toBeNull()
  })

  it('deve calcular CAGR para 18 meses', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.cagr).toBeGreaterThan(0)
    expect(typeof result.cagr).toBe('number')
  })

  it('deve retornar CAGR=0 para menos de 12 meses', () => {
    const result = analyze(
      twoMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.cagr).toBe(0)
  })

  it('deve calcular Mom entries com growth e ma3', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.mom.length).toBe(sampleMensais.length)
    expect(result.mom[0].growth).toBe(0)
    expect(result.mom[0].ma3).toBe(sampleMensais[0].revenue)
  })

  it('deve retornar Mom vazio para mensais vazio', () => {
    const result = analyze(
      emptyMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.mom).toEqual([])
  })

  it('deve calcular correlação', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.correlation).toBeGreaterThanOrEqual(-1)
    expect(result.correlation).toBeLessThanOrEqual(1)
  })

  it('deve retornar correlação 0 para menos de 2 meses', () => {
    const result = analyze(
      singleMensal,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.correlation).toBe(0)
  })

  it('deve calcular topN e topPct (Pareto)', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    // 4 produtos geram 80%+
    expect(result.topN).toBe(4)
    expect(result.topPct).toBeGreaterThan(80)
    expect(result.topPct).toBeLessThan(100)
  })

  it('deve retornar topN=0 e topPct=0 para produtoMix vazio', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      [],
      sampleCategorias,
    )
    expect(result.topN).toBe(0)
    expect(result.topPct).toBe(0)
  })

  it('deve ordenar sortedProds por total decrescente', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    for (let i = 1; i < result.sortedProds.length; i++) {
      expect(result.sortedProds[i].total)
        .toBeLessThanOrEqual(result.sortedProds[i - 1].total)
    }
  })

  it('deve calcular top3CatPct e sortedCats', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.top3CatPct).toBeCloseTo(78.1 + 13.1 + 4.7, 1)
    expect(result.sortedCats).toHaveLength(sampleCategorias.length)
  })

  it('deve analisar eventos (bestNorm, worstNorm, scatterData)', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.bestNorm).toHaveLength(3)
    expect(result.worstNorm).toHaveLength(3)
    expect(result.scatterData).toHaveLength(sampleEventos.length)
  })

  it('deve calcular product growth', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.prodGrowth.length).toBeGreaterThan(0)
  })

  it('deve retornar prodGrowth vazio para menos de 2 eventos', () => {
    const result = analyze(
      sampleMensais,
      [sampleEventos[0]],
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.prodGrowth).toEqual([])
  })

  it('deve calcular sazonalidade', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.seasonal.length).toBeGreaterThan(0)
    for (const s of result.seasonal) {
      expect(MESES).toContain(s.mes)
    }
  })

  it('deve retornar seasonal vazio para mensais vazio', () => {
    const result = analyze(
      emptyMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.seasonal).toEqual([])
  })

  it('deve calcular forecast', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.forecast.length).toBe(3)
    for (const f of result.forecast) {
      expect(f.label).toMatch(/^\+\dm$/)
      expect(f.previsto).toBeGreaterThan(0)
    }
  })

  it('deve retornar forecast vazio para menos de 2 meses', () => {
    const result = analyze(
      singleMensal,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(result.forecast).toEqual([])
  })

  it('deve calcular ticket growth (tt, to, tg)', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
    )
    expect(typeof result.tt).toBe('number')
    expect(typeof result.to).toBe('number')
    expect(typeof result.tg).toBe('number')
  })

  it('deve aceitar options customizadas', () => {
    const result = analyze(
      sampleMensais,
      sampleEventos,
      sampleProdutoMix,
      sampleCategorias,
      {
        monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        forecastPeriods: 5,
        paretoThreshold: 0.5,
      },
    )
    expect(result.forecast).toHaveLength(5)
    // Com threshold 0.5, topN deve ser 2 (VINHO+DRINK = 50.8%)
    expect(result.topN).toBe(2)
  })

  it('deve funcionar com cenário mínimo (tudo vazio ou default)', () => {
    const result = analyze([], [], [], [])
    expect(result.mom).toEqual([])
    expect(result.quarters).toEqual([])
    expect(result.cagr).toBe(0)
    expect(result.bestMonth).toBeNull()
    expect(result.worstMonth).toBeNull()
    expect(result.top3CatPct).toBe(0)
    expect(result.topN).toBe(0)
    expect(result.topPct).toBe(0)
    expect(result.prodGrowth).toEqual([])
    expect(result.correlation).toBe(0)
    expect(result.scatterData).toEqual([])
    expect(result.bestNorm).toEqual([])
    expect(result.worstNorm).toEqual([])
    expect(result.seasonal).toEqual([])
    expect(result.forecast).toEqual([])
    expect(result.tg).toBe(0)
    expect(Number.isNaN(result.tt)).toBe(true) // divisão por zero
    expect(Number.isNaN(result.to)).toBe(true) // divisão por zero
    expect(result.sortedCats).toEqual([])
    expect(result.sortedProds).toEqual([])
  })
})
