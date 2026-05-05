import { describe, it, expect } from 'vitest'
import { calcProductGrowth } from '../../src/metrics/product-growth'
import type { ProdGrowth, Evento } from '../../src/types'
import { sampleEventos, singleProductEvent } from '../fixtures/sample-data'

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

  it('deve lidar com produto que aparece apenas na 2ª metade com total zero (pf=0, ps=0)', () => {
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
        produtos: [{ name: 'DRINK', qty: 0, total: 0, pct: 0 }],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
    ]
    const result = calcProductGrowth(eventos)
    // DRINK aparece na 2ª metade mas com total=0 → f=0, s=0, g=0
    const drink = result.find(p => p.name === 'DRINK')
    expect(drink).toBeDefined()
    expect(drink!.f).toBe(0)
    expect(drink!.s).toBe(0)
    expect(drink!.g).toBe(0)
  })

  it('deve lidar com produto que aparece apenas na 1ª metade com ps=0 (pf>0, ps=0)', () => {
    // Produto aparece na 1ª metade (fh) → tem em pf mas não em ps
    // Como o map itera sobre Object.keys(ps), este produto não aparece no output
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
        produtos: [{ name: 'DRINK', qty: 1, total: 50, pct: 100 }],
        metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
      },
    ]
    const result = calcProductGrowth(eventos)
    // VINHO aparece só na 1ª metade, DRINK aparece só na 2ª metade
    const drink = result.find(p => p.name === 'DRINK')
    expect(drink).toBeDefined()
    expect(drink!.f).toBe(0)
    expect(drink!.s).toBe(50)
    expect(drink!.g).toBe(100)
  })

  it('deve cobrir todas as branches do ternary aninhado via fixture singleProductEvent', () => {
    const result = calcProductGrowth(singleProductEvent)
    // NOVO_PRODUTO: aparece apenas na 2ª metade (pf=0, ps=1000) → g=100 (branch ps>0 true)
    const novo = result.find(p => p.name === 'NOVO_PRODUTO')
    expect(novo).toBeDefined()
    expect(novo!.f).toBe(0)
    expect(novo!.s).toBe(1000)
    expect(novo!.g).toBe(100)
    // PRODUTO_SEM_VENDA: aparece na 2ª metade com total 0 (pf=0, ps=0) → g=0 (branch ps>0 false)
    const semVenda = result.find(p => p.name === 'PRODUTO_SEM_VENDA')
    expect(semVenda).toBeDefined()
    expect(semVenda!.f).toBe(0)
    expect(semVenda!.s).toBe(0)
    expect(semVenda!.g).toBe(0)
  })
})
