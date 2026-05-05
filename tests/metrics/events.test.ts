import { describe, it, expect } from 'vitest'
import { analyzeEvents } from '../../src/metrics/events'
import type { ScatterPoint } from '../../src/types'
import { sampleEventos } from '../fixtures/sample-data'

describe('analyzeEvents — Análise de Eventos', () => {
  it('deve retornar arrays vazios para eventos vazios', () => {
    const result = analyzeEvents([])
    expect(result.bestNorm).toEqual([])
    expect(result.worstNorm).toEqual([])
    expect(result.scatterData).toEqual([])
  })

  it('deve retornar top 3 melhores eventos (receita/dia)', () => {
    const result = analyzeEvents(sampleEventos)
    expect(result.bestNorm).toHaveLength(3)
    // Todos têm days=1, então é ordenado por receita decrescente
    const revenues = result.bestNorm.map(e => e.revenue)
    expect(revenues[0]).toBeGreaterThanOrEqual(revenues[1])
    expect(revenues[1]).toBeGreaterThanOrEqual(revenues[2])
  })

  it('deve retornar top 3 piores eventos (receita/dia)', () => {
    const result = analyzeEvents(sampleEventos)
    expect(result.worstNorm).toHaveLength(3)
    const revenues = result.worstNorm.map(e => e.revenue)
    expect(revenues[0]).toBeLessThanOrEqual(revenues[1])
    expect(revenues[1]).toBeLessThanOrEqual(revenues[2])
  })

  it('deve retornar scatterData com todos os eventos', () => {
    const result = analyzeEvents(sampleEventos)
    expect(result.scatterData).toHaveLength(sampleEventos.length)
    for (const point of result.scatterData) {
      expect(point).toHaveProperty('duracao')
      expect(point).toHaveProperty('receita')
      expect(point).toHaveProperty('nome')
      expect(point.duracao).toBeGreaterThan(0)
      expect(point.receita).toBeGreaterThan(0)
    }
  })

  it('deve retornar menos de 3 se houver menos eventos', () => {
    const doisEventos = sampleEventos.slice(0, 2)
    const result = analyzeEvents(doisEventos)
    expect(result.bestNorm).toHaveLength(2)
    expect(result.worstNorm).toHaveLength(2)
  })

  it('bestNorm e worstNorm não devem se sobrepor se houver 6+ eventos', () => {
    const result = analyzeEvents(sampleEventos)
    const bestStarts = result.bestNorm.map(e => e.start)
    const worstStarts = result.worstNorm.map(e => e.start)
    // Com 6 eventos, melhores e piores são disjuntos
    for (const s of bestStarts) {
      expect(worstStarts).not.toContain(s)
    }
  })
})
