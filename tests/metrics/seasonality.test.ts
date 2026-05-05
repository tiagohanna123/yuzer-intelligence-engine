import { describe, it, expect } from 'vitest'
import { calcSeasonality } from '../../src/metrics/seasonality'
import type { SeasonalEntry } from '../../src/types'
import { MESES } from '../../src/constants'
import { sampleMensais, emptyMensais, twoMensais } from '../fixtures/sample-data'

describe('calcSeasonality — Sazonalidade por Mês', () => {
  it('deve retornar array vazio para dados vazios', () => {
    expect(calcSeasonality(emptyMensais, MESES)).toEqual([])
  })

  it('deve agrupar média por mês para 2 meses', () => {
    const result = calcSeasonality(twoMensais, MESES)
    expect(result).toHaveLength(2)

    const jan = result.find(s => s.mes === 'Jan')
    const fev = result.find(s => s.mes === 'Fev')
    expect(jan).toBeDefined()
    expect(jan!.media).toBe(5000)
    expect(fev).toBeDefined()
    expect(fev!.media).toBe(6000)
  })

  it('deve processar dados reais e retornar meses com média', () => {
    const result = calcSeasonality(sampleMensais, MESES)
    expect(result.length).toBeGreaterThanOrEqual(1)

    for (const entry of result) {
      expect(entry).toHaveProperty('mes')
      expect(entry).toHaveProperty('media')
      expect(MESES).toContain(entry.mes)
      expect(entry.media).toBeGreaterThan(0)
    }
  })

  it('deve pular labels que não estão em monthNames', () => {
    const badLabel = [
      { mes: '2024-01', label: 'Xyz/2024', eventos: 0, orders: 0, revenue: 1000, ticketMedio: 0 },
    ]
    const result = calcSeasonality(badLabel, MESES)
    expect(result).toHaveLength(0)
  })

  it('deve calcular média correta quando há múltiplos anos para o mesmo mês', () => {
    const doisJaneiros = [
      { mes: '2024-01', label: 'Jan/2024', eventos: 1, orders: 10, revenue: 1000, ticketMedio: 100 },
      { mes: '2025-01', label: 'Jan/2025', eventos: 1, orders: 10, revenue: 3000, ticketMedio: 100 },
    ]
    const result = calcSeasonality(doisJaneiros, MESES)
    const jan = result.find(s => s.mes === 'Jan')
    expect(jan).toBeDefined()
    expect(jan!.media).toBe(2000) // (1000+3000)/2
  })
})
