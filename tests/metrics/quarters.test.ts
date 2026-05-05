import { describe, it, expect } from 'vitest'
import { calcQuarters } from '../../src/metrics/quarters'
import type { QuarterEntry } from '../../src/types'
import { MESES } from '../../src/constants'
import { sampleMensais, emptyMensais, twoMensais } from '../fixtures/sample-data'

describe('calcQuarters — Agregação por Trimestre', () => {
  it('deve retornar array vazio para dados vazios', () => {
    expect(calcQuarters(emptyMensais, MESES)).toEqual([])
  })

  it('deve agregar dois meses no mesmo trimestre', () => {
    const result = calcQuarters(twoMensais, MESES)
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('Q1 2025')
    expect(result[0].revenue).toBe(11000)
    expect(result[0].orders).toBe(220)
    expect(result[0].count).toBe(2)
  })

  it('deve criar múltiplos trimestres para dados reais', () => {
    const result = calcQuarters(sampleMensais, MESES)
    expect(result.length).toBeGreaterThanOrEqual(4)

    // Q4 2023: Nov/2023 + Dez/2023
    const q4_23 = result.find(q => q.label === 'Q4 2023')
    expect(q4_23).toBeDefined()
    expect(q4_23!.revenue).toBeCloseTo(29952 + 10697, 0)
    expect(q4_23!.count).toBe(2)

    // Verificar estrutura dos entries
    for (const q of result) {
      expect(q).toHaveProperty('label')
      expect(q).toHaveProperty('revenue')
      expect(q).toHaveProperty('orders')
      expect(q).toHaveProperty('count')
    }
  })

  it('deve pular meses com label não reconhecido', () => {
    const invalid = [
      { mes: '2024-01', label: 'Xyz/2024', eventos: 0, orders: 10, revenue: 1000, ticketMedio: 100 },
    ]
    const result = calcQuarters(invalid, MESES)
    expect(result).toHaveLength(0)
  })
})
