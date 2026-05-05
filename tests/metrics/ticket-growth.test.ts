import { describe, it, expect } from 'vitest'
import { calcTicketGrowth } from '../../src/metrics/ticket-growth'
import { sampleMensais, emptyMensais, singleMensal, twoMensais } from '../fixtures/sample-data'

describe('calcTicketGrowth — Evolução do Ticket Médio', () => {
  it('deve retornar tt=NaN, to=NaN, tg=0 para dados vazios (divisão por zero)', () => {
    const result = calcTicketGrowth(emptyMensais)
    expect(Number.isNaN(result.tt)).toBe(true)
    expect(Number.isNaN(result.to)).toBe(true)
    expect(result.tg).toBe(0)
  })

  it('deve retornar tt=to=ticketMedio para 1 mês', () => {
    const result = calcTicketGrowth(singleMensal)
    // n = min(6,1) = 1, tt = 50/1 = 50, to = 50/1 = 50
    expect(result.tt).toBe(50)
    expect(result.to).toBe(50)
    expect(result.tg).toBe(0)
  })

  it('deve retornar tt=to e tg=0 quando ticket não varia', () => {
    // ticketMedio = 50 para ambos
    const result = calcTicketGrowth(twoMensais)
    expect(result.tt).toBe(50)
    expect(result.to).toBe(50)
    expect(result.tg).toBe(0)
  })

  it('deve calcular tg positivo quando ticket sobe (12 meses: primeiros 6 ticket=50, últimos 6 ticket=60)', () => {
    const dados = [
      { mes: '2024-01', label: 'Jan/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-02', label: 'Fev/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-03', label: 'Mar/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-04', label: 'Abr/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-05', label: 'Mai/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-06', label: 'Jun/2024', eventos: 1, orders: 10, revenue: 500, ticketMedio: 50 },
      { mes: '2024-07', label: 'Jul/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
      { mes: '2024-08', label: 'Ago/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
      { mes: '2024-09', label: 'Set/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
      { mes: '2024-10', label: 'Out/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
      { mes: '2024-11', label: 'Nov/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
      { mes: '2024-12', label: 'Dez/2024', eventos: 1, orders: 10, revenue: 600, ticketMedio: 60 },
    ]
    const result = calcTicketGrowth(dados)
    // n = 6, to = média primeiros 6 = 50, tt = média últimos 6 = 60, tg = (60-50)/50*100 = 20%
    expect(result.tt).toBe(60)
    expect(result.to).toBe(50)
    expect(result.tg).toBeCloseTo(20, 1)
  })

  it('deve limitar a janela a 6 meses', () => {
    const result = calcTicketGrowth(sampleMensais)
    // n = min(6, 18) = 6
    // tt = média últimos 6 meses de ticketMedio
    const last6 = sampleMensais.slice(-6)
    const tt = last6.reduce((s, m) => s + m.ticketMedio, 0) / 6
    expect(result.tt).toBeCloseTo(tt, 2)
  })
})
