import { describe, it, expect } from 'vitest'
import { calcProductGrowth } from '../../src/metrics/product-growth'
import type { ProdGrowth, Evento } from '../../src/types'
import { sampleEventos } from '../fixtures/sample-data'

describe('calcProductGrowth — Produtos em Alta', () => {
  it('deve retornar array vazio para menos de 2 eventos', () => {
    expect(calcProductGrowth([])).toEqual([])

    const singleEvento = [sampleEventos[0]]
    expect(calcProductGrowth(singleEvento)).toEqual([])
  })

  it('deve retornar array vazio para eventos sem produtos', () => {
    const eventosSemProdutos: Evento[] = [
      {
        start: '2024-01-01', end: '2024-01-01', days: 1,
        orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
        produtos: [],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
      {
        start: '2024-02-01', end: '2024-02-01', days: 1,
        orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
        produtos: [],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
    ]
    expect(calcProductGrowth(eventosSemProdutos)).toEqual([])
  })

  it('deve calcular crescimento para eventos reais', () => {
    const result = calcProductGrowth(sampleEventos)
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(10)

    const names = result.map(p => p.name)
    expect(names).toContain('DOSE')
    expect(names).toContain('CERVEJA')
    expect(names).toContain('DRINK')
    expect(names).toContain('VINHO')

    for (const p of result) {
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('f')
      expect(p).toHaveProperty('s')
      expect(p).toHaveProperty('g')
    }
  })

  it('deve ordenar por crescimento decrescente', () => {
    const result = calcProductGrowth(sampleEventos)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].g).toBeLessThanOrEqual(result[i - 1].g)
    }
  })

  it('deve retornar no máximo 10 produtos', () => {
    const muitosProdutos: Evento[] = Array.from({ length: 20 }, (_, i) => ({
      start: `2024-${String(i + 1).padStart(2, '0')}-01`,
      end: `2024-${String(i + 1).padStart(2, '0')}-01`,
      days: 1,
      orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
      produtos: [{ name: `Prod${i}`, qty: 1, total: 100, pct: 100 }],
      metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
    }))
    const result = calcProductGrowth(muitosProdutos)
    expect(result.length).toBeLessThanOrEqual(10)
  })

  it('deve lidar com produto que aparece apenas na 2ª metade (pf[n] = 0)', () => {
    const eventos: Evento[] = [
      {
        start: '2024-01-01', end: '2024-01-01', days: 1,
        orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
        produtos: [{ name: 'VINHO', qty: 1, total: 100, pct: 100 }],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
      {
        start: '2024-02-01', end: '2024-02-01', days: 1,
        orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
        produtos: [{ name: 'DRINK', qty: 2, total: 200, pct: 100 }],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
    ]
    const result = calcProductGrowth(eventos)
    // DRINK aparece só na 2ª metade → f=0, s=200, g=100
    const drink = result.find(p => p.name === 'DRINK')
    expect(drink).toBeDefined()
    expect(drink!.f).toBe(0)
    expect(drink!.s).toBe(200)
    expect(drink!.g).toBe(100)
  })
})
