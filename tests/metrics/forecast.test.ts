import { describe, it, expect } from 'vitest'
import { calcForecast } from '../../src/metrics/forecast'
import type { ForecastEntry } from '../../src/types'
import { sampleMensais, emptyMensais, singleMensal, twoMensais } from '../fixtures/sample-data'

describe('calcForecast — Regressão Linear', () => {
  it('deve retornar array vazio para dados vazios', () => {
    expect(calcForecast(emptyMensais)).toEqual([])
  })

  it('deve retornar array vazio para menos de 2 meses', () => {
    expect(calcForecast(singleMensal)).toEqual([])
  })

  it('deve gerar previsões para 2 meses com períodos default (3)', () => {
    const result = calcForecast(twoMensais)
    expect(result).toHaveLength(3)

    // Regressão: n=2, xm=0.5, ym=5500
    // slope=1000, intercept=5000
    // +1m: 5000 + 1000*(2+0) = 7000
    // +2m: 5000 + 1000*(2+1) = 8000
    // +3m: 5000 + 1000*(2+2) = 9000
    expect(result[0].label).toBe('+1m')
    expect(result[0].previsto).toBeCloseTo(7000, 0)
    expect(result[1].label).toBe('+2m')
    expect(result[1].previsto).toBeCloseTo(8000, 0)
    expect(result[2].label).toBe('+3m')
    expect(result[2].previsto).toBeCloseTo(9000, 0)
  })

  it('deve respeitar períodos customizados', () => {
    const result = calcForecast(twoMensais, 1)
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('+1m')
  })

  it('deve gerar previsões não-negativas para dados reais', () => {
    const result = calcForecast(sampleMensais)
    expect(result.length).toBeGreaterThan(0)
    for (const entry of result) {
      expect(entry).toHaveProperty('label')
      expect(entry).toHaveProperty('previsto')
      expect(entry.previsto).toBeGreaterThanOrEqual(0)
      expect(entry.label).toMatch(/^\+\d+m$/)
    }
  })

  it('deve funcionar com lookback customizado', () => {
    const result = calcForecast(sampleMensais, 2, 6)
    expect(result).toHaveLength(2)
  })
})
