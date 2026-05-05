import type { Mensal, Evento, ProdutoMix, Categoria } from '../../src/types'

/* ── Mensais (29 meses de dados reais simplificados) ── */

export const sampleMensais: Mensal[] = [
  { mes: '2023-11', label: 'Nov/2023', eventos: 1, orders: 0, revenue: 29952, ticketMedio: 0 },
  { mes: '2023-12', label: 'Dez/2023', eventos: 1, orders: 0, revenue: 10697, ticketMedio: 0 },
  { mes: '2024-01', label: 'Jan/2024', eventos: 2, orders: 0, revenue: 20936, ticketMedio: 0 },
  { mes: '2024-02', label: 'Fev/2024', eventos: 1, orders: 0, revenue: 19119, ticketMedio: 0 },
  { mes: '2024-03', label: 'Mar/2024', eventos: 2, orders: 0, revenue: 31905, ticketMedio: 0 },
  { mes: '2024-04', label: 'Abr/2024', eventos: 2, orders: 0, revenue: 54978, ticketMedio: 0 },
  { mes: '2024-05', label: 'Mai/2024', eventos: 2, orders: 0, revenue: 26199, ticketMedio: 0 },
  { mes: '2024-06', label: 'Jun/2024', eventos: 1, orders: 0, revenue: 15540, ticketMedio: 0 },
  { mes: '2024-07', label: 'Jul/2024', eventos: 2, orders: 0, revenue: 27085, ticketMedio: 0 },
  { mes: '2024-08', label: 'Ago/2024', eventos: 3, orders: 0, revenue: 39568, ticketMedio: 0 },
  { mes: '2024-09', label: 'Set/2024', eventos: 2, orders: 0, revenue: 26868, ticketMedio: 0 },
  { mes: '2024-10', label: 'Out/2024', eventos: 2, orders: 0, revenue: 62192, ticketMedio: 0 },
  { mes: '2024-11', label: 'Nov/2024', eventos: 2, orders: 0, revenue: 60582, ticketMedio: 0 },
  { mes: '2024-12', label: 'Dez/2024', eventos: 1, orders: 0, revenue: 40362, ticketMedio: 0 },
  { mes: '2025-01', label: 'Jan/2025', eventos: 3, orders: 0, revenue: 42416, ticketMedio: 0 },
  { mes: '2025-02', label: 'Fev/2025', eventos: 2, orders: 0, revenue: 33371, ticketMedio: 0 },
  { mes: '2025-03', label: 'Mar/2025', eventos: 1, orders: 0, revenue: 15779, ticketMedio: 0 },
  { mes: '2025-04', label: 'Abr/2025', eventos: 1, orders: 0, revenue: 15212, ticketMedio: 0 },
]

/* ── ProdutoMix (top 10 de 50) ── */

export const sampleProdutoMix: ProdutoMix[] = [
  { name: 'VINHO', qty: 2157, total: 184782, pct: 27.1 },
  { name: 'DRINK', qty: 3241, total: 142388, pct: 20.9 },
  { name: 'DOSE', qty: 4129, total: 103153, pct: 15.1 },
  { name: 'CERVEJA', qty: 3655, total: 87506, pct: 12.8 },
  { name: 'REFRIGERANTE', qty: 1532, total: 28456, pct: 4.2 },
  { name: 'ÁGUA', qty: 1892, total: 22698, pct: 3.3 },
  { name: 'SUCO', qty: 987, total: 18762, pct: 2.8 },
  { name: 'ENERGÉTICO', qty: 654, total: 15098, pct: 2.2 },
  { name: 'ESPUMANTE', qty: 312, total: 12341, pct: 1.8 },
  { name: 'LICOR', qty: 234, total: 8743, pct: 1.3 },
]

/* ── Categorias ── */

export const sampleCategorias: Categoria[] = [
  { name: 'Outros', qty: 18850, total: 532347, pct: 78.1 },
  { name: 'Parede', qty: 2341, total: 89234, pct: 13.1 },
  { name: 'Alimentação', qty: 1456, total: 32189, pct: 4.7 },
  { name: 'Ingressos', qty: 987, total: 18765, pct: 2.8 },
  { name: 'Merch', qty: 312, total: 8912, pct: 1.3 },
]

/* ── Eventos (amostra de 6) ── */

export const sampleEventos: Evento[] = [
  {
    start: '2024-10-25', end: '2024-10-26', days: 1,
    orders: 892, revenue: 38214, ticketMedio: 42.8, itensVendidos: 1241,
    produtos: [
      { name: 'VINHO', qty: 98, total: 8912, pct: 23.3 },
      { name: 'DRINK', qty: 156, total: 7021, pct: 18.4 },
      { name: 'CERVEJA', qty: 245, total: 5876, pct: 15.4 },
    ],
    metodosPagamento: [
      { method: 'Crédito', total: 19107, pct: 50 },
      { method: 'Débito', total: 9554, pct: 25 },
      { method: 'Pix', total: 9554, pct: 25 },
    ],
  },
  {
    start: '2024-11-22', end: '2024-11-23', days: 1,
    orders: 1241, revenue: 51234, ticketMedio: 41.3, itensVendidos: 1876,
    produtos: [
      { name: 'DRINK', qty: 234, total: 11234, pct: 21.9 },
      { name: 'VINHO', qty: 167, total: 14234, pct: 27.8 },
      { name: 'DOSE', qty: 312, total: 7892, pct: 15.4 },
    ],
    metodosPagamento: [
      { method: 'Crédito', total: 25617, pct: 50 },
      { method: 'Pix', total: 25617, pct: 50 },
    ],
  },
  {
    start: '2025-01-17', end: '2025-01-18', days: 1,
    orders: 1024, revenue: 45123, ticketMedio: 44.1, itensVendidos: 1567,
    produtos: [
      { name: 'VINHO', qty: 145, total: 13456, pct: 29.8 },
      { name: 'DRINK', qty: 189, total: 8723, pct: 19.3 },
      { name: 'CERVEJA', qty: 267, total: 6523, pct: 14.5 },
    ],
    metodosPagamento: [
      { method: 'Pix', total: 18049, pct: 40 },
      { method: 'Crédito', total: 18049, pct: 40 },
      { method: 'Débito', total: 9025, pct: 20 },
    ],
  },
  {
    start: '2025-02-14', end: '2025-02-15', days: 1,
    orders: 756, revenue: 28123, ticketMedio: 37.2, itensVendidos: 987,
    produtos: [
      { name: 'CERVEJA', qty: 312, total: 7432, pct: 26.4 },
      { name: 'DOSE', qty: 345, total: 7654, pct: 27.2 },
      { name: 'DRINK', qty: 98, total: 4234, pct: 15.1 },
    ],
    metodosPagamento: [
      { method: 'Crédito', total: 14062, pct: 50 },
      { method: 'Débito', total: 8437, pct: 30 },
      { method: 'Pix', total: 5625, pct: 20 },
    ],
  },
  {
    start: '2025-03-21', end: '2025-03-22', days: 1,
    orders: 456, revenue: 15779, ticketMedio: 34.6, itensVendidos: 634,
    produtos: [
      { name: 'DOSE', qty: 234, total: 5213, pct: 33.0 },
      { name: 'CERVEJA', qty: 156, total: 3821, pct: 24.2 },
      { name: 'VINHO', qty: 45, total: 3987, pct: 25.3 },
    ],
    metodosPagamento: [
      { method: 'Pix', total: 7890, pct: 50 },
      { method: 'Crédito', total: 7889, pct: 50 },
    ],
  },
  {
    start: '2025-04-18', end: '2025-04-19', days: 1,
    orders: 423, revenue: 15212, ticketMedio: 36.0, itensVendidos: 567,
    produtos: [
      { name: 'DRINK', qty: 112, total: 5432, pct: 35.7 },
      { name: 'VINHO', qty: 67, total: 5987, pct: 39.4 },
      { name: 'DOSE', qty: 89, total: 2345, pct: 15.4 },
    ],
    metodosPagamento: [
      { method: 'Crédito', total: 7606, pct: 50 },
      { method: 'Pix', total: 7606, pct: 50 },
    ],
  },
]

/* ── Dados mínimos para teste de borda ── */

export const emptyMensais: Mensal[] = []

export const singleMensal: Mensal[] = [
  { mes: '2025-01', label: 'Jan/2025', eventos: 1, orders: 100, revenue: 5000, ticketMedio: 50 },
]

export const twoMensais: Mensal[] = [
  { mes: '2025-01', label: 'Jan/2025', eventos: 1, orders: 100, revenue: 5000, ticketMedio: 50 },
  { mes: '2025-02', label: 'Fev/2025', eventos: 1, orders: 120, revenue: 6000, ticketMedio: 50 },
]

/* ── Dados de borda para CAGR: receita zero nos primeiros 6 meses ── */

export const zeroRevenueMensais: Mensal[] = Array.from({ length: 12 }, (_, i) => ({
  mes: `2024-${String(i + 1).padStart(2, '0')}`,
  label: `${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i]}/2024`,
  eventos: 0,
  orders: 0,
  revenue: i < 6 ? 0 : 10000, // primeiros 6 com receita zero
  ticketMedio: 0,
}))

/* ── Dados de borda para Pareto: mix com total zero ── */

export const zeroTotalMix: ProdutoMix[] = [
  { name: 'PRODUTO_A', qty: 0, total: 0, pct: 0 },
  { name: 'PRODUTO_B', qty: 0, total: 0, pct: 0 },
  { name: 'PRODUTO_C', qty: 0, total: 0, pct: 0 },
]

/* ── Dados de borda para ProductGrowth: produto só na 2ª metade ── */

export const singleProductEvent: Evento[] = [
  {
    start: '2024-01-01', end: '2024-01-01', days: 1,
    orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
    produtos: [],
    metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
  },
  {
    start: '2024-02-01', end: '2024-02-01', days: 1,
    orders: 10, revenue: 1000, ticketMedio: 100, itensVendidos: 5,
    produtos: [
      { name: 'NOVO_PRODUTO', qty: 10, total: 1000, pct: 100 },
      { name: 'PRODUTO_SEM_VENDA', qty: 0, total: 0, pct: 0 },
    ],
    metodosPagamento: [{ method: 'Crédito', total: 1000, pct: 100 }],
  },
]

/* ── Dados de borda para Quarters: label fora do padrao monthNames ── */

export const badLabelMensal: Mensal[] = [
  { mes: '2024-01', label: 'Janeiro/2024', eventos: 1, orders: 50, revenue: 5000, ticketMedio: 100 },
  { mes: '2024-02', label: 'Fev/2024',     eventos: 1, orders: 60, revenue: 6000, ticketMedio: 100 },
  { mes: '2024-03', label: 'INVALIDO/2024', eventos: 1, orders: 70, revenue: 7000, ticketMedio: 100 },
]
