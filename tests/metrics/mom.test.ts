import { describe, it, expect } from 'vitest'
import { calcMom } from '../../src/metrics/mom'
import type { MomEntry } from '../../src/types'
import { sampleMensais, emptyMensais, singleMensal, twoMensais } from '../fixtures/sample-data'

describe('calcMom — Mês a Mês', () => {
  it('deve retornar array vazio para dados vazios', () => {
    const result = calcMom(emptyMensais)
    expect(result).toEqual([])
  })

  it('deve retornar 1 entry com growth=0 e ma3=revenue para único mês', () => {
    const result = calcMom(singleMensal)
    expect(result).toHaveLength(1)
    expect(result[0].mes).toBe('2025-01')
    expect(result[0].growth).toBe(0)
    expect(result[0].ma3).toBe(5000)
  })

  it('deve calcular growth% e ma3 para dois meses', () => {
    const result = calcMom(twoMensais)
    expect(result).toHaveLength(2)

    // Primeiro mês: growth=0 (primeiro), ma3=revenue (menos de 3 meses)
    expect(result[0].growth).toBe(0)
    expect(result[0].ma3).toBe(5000)

    // Segundo mês: growth = (6000-5000)/5000 * 100 = 20%
    expect(result[1].growth).toBeCloseTo(20, 2)
    expect(result[1].ma3).toBe(6000)
  })

  it('deve calcular ma3 corretamente a partir do 3º mês', () => {
    const result = calcMom(sampleMensais)
    // 3º entry (index 2, Jan/2024): ma3 = (20936+10697+29952)/3
    expect(result[2].ma3).toBeCloseTo((20936 + 10697 + 29952) / 3, 1)
    // growth de Jan/2024 vs Dez/2023
    expect(result[2].growth).toBeCloseTo(((20936 - 10697) / 10697) * 100, 1)
  })

  it('deve preservar todos os campos do MomEntry', () => {
    const result = calcMom(sampleMensais)
    const entry = result[0]
    expect(entry).toHaveProperty('mes')
    expect(entry).toHaveProperty('label')
    expect(entry).toHaveProperty('eventos')
    expect(entry).toHaveProperty('orders')
    expect(entry).toHaveProperty('revenue')
    expect(entry).toHaveProperty('ticketMedio')
    expect(entry).toHaveProperty('growth')
    expect(entry).toHaveProperty('ma3')
  })

  it('deve ter growth zero no primeiro mês mesmo com revenue > 0', () => {
    const result = calcMom(sampleMensais)
    expect(result[0].growth).toBe(0)
  })
})
