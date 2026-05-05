import { describe, it, expect } from 'vitest'
import { calcCAGR } from '../../src/metrics/cagr'
import { sampleMensais, emptyMensais, singleMensal, twoMensais, zeroRevenueMensais } from '../fixtures/sample-data'
import type { Mensal } from '../../src/types'

describe('calcCAGR — Compound Annual Growth Rate', () => {
  it('deve retornar 0 para dados vazios', () => {
    expect(calcCAGR(emptyMensais)).toBe(0)
  })

  it('deve retornar 0 para menos de 12 meses', () => {
    expect(calcCAGR(singleMensal)).toBe(0)
    expect(calcCAGR(twoMensais)).toBe(0)
  })

  it('deve calcular CAGR corretamente para 18 meses', () => {
    const result = calcCAGR(sampleMensais)
    // f6 = soma primeiros 6 meses
    const f6 = sampleMensais.slice(0, 6).reduce((s, m) => s + m.revenue, 0)
    // l6 = soma últimos 6 meses
    const l6 = sampleMensais.slice(-6).reduce((s, m) => s + m.revenue, 0)
    const periods = 18 / 12 // 1.5
    const expected = f6 > 0 ? ((l6 / f6) ** (1 / periods) - 1) * 100 : 0
    expect(result).toBeCloseTo(expected, 1)
    // CAGR deve ser positivo (receita cresceu)
    expect(result).toBeGreaterThan(0)
  })

  it('deve retornar valor numérico finito', () => {
    const result = calcCAGR(sampleMensais)
    expect(typeof result).toBe('number')
    expect(isFinite(result)).toBe(true)
  })

  it('deve retornar 0 para CAGR quando receita inicial é zero (12+ meses)', () => {
    const noRevenue: Mensal[] = Array.from({ length: 12 }, (_, i) => ({
      mes: `2024-${String(i + 1).padStart(2, '0')}`,
      label: `Mes/${2024 + Math.floor(i / 12)}`,
      eventos: 0,
      orders: 0,
      revenue: 0,
      ticketMedio: 0,
    }))
    expect(calcCAGR(noRevenue)).toBe(0)
  })

  it('deve retornar 0 quando os primeiros 6 meses têm receita zero (fixture)', () => {
    // f6 = 0, l6 = 60000 → branch false de f6 > 0
    expect(calcCAGR(zeroRevenueMensais)).toBe(0)
  })
})
