import { describe, it, expect } from 'vitest'
import { calcCorrelation } from '../../src/metrics/correlation'
import { sampleMensais, emptyMensais, singleMensal, twoMensais } from '../fixtures/sample-data'

describe('calcCorrelation — Correlação de Pearson', () => {
  it('deve retornar 0 para dados vazios', () => {
    expect(calcCorrelation(emptyMensais)).toBe(0)
  })

  it('deve retornar 0 para apenas 1 mês', () => {
    expect(calcCorrelation(singleMensal)).toBe(0)
  })

  it('deve retornar 1 para correlação perfeita (dois pontos colineares)', () => {
    const result = calcCorrelation(twoMensais)
    // revenue [5000, 6000], orders [100, 120] → perfeitamente correlacionados
    expect(result).toBeCloseTo(1, 5)
  })

  it('deve retornar valor entre -1 e 1 para dados reais', () => {
    const result = calcCorrelation(sampleMensais)
    expect(result).toBeGreaterThanOrEqual(-1)
    expect(result).toBeLessThanOrEqual(1)
  })

  it('deve lidar com receita zero sem quebrar', () => {
    const allZero = [
      { mes: '2024-01', label: 'Jan/2024', eventos: 0, orders: 0, revenue: 0, ticketMedio: 0 },
      { mes: '2024-02', label: 'Fev/2024', eventos: 0, orders: 0, revenue: 0, ticketMedio: 0 },
    ]
    expect(calcCorrelation(allZero)).toBe(0)
  })
})
