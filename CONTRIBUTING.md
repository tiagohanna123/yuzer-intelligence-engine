# Contribuindo

Obrigado por considerar contribuir com o **Yuzer Intelligence Engine**!

## Código de Conduta

Este projeto adota um código de conduta baseado no [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, espera-se que todos os contribuidores mantenham um ambiente respeitoso e aberto.

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [issues](https://github.com/tiagohanna/yuzer-intelligence-engine/issues)
2. Use o template de [bug report](https://github.com/tiagohanna/yuzer-intelligence-engine/issues/new?template=bug_report.md)
3. Inclua:
   - Versão do Node.js e sistema operacional
   - Código mínimo para reproduzir
   - Comportamento esperado vs real

### Sugerindo Funcionalidades

1. Verifique se a funcionalidade já não foi sugerida
2. Use o template de [feature request](https://github.com/tiagohanna/yuzer-intelligence-engine/issues/new?template=feature_request.md)
3. Explique o caso de uso e o valor da funcionalidade

### Pull Requests

1. Fork o repositório
2. Crie uma branch descritiva: `feat/nova-metrica`, `fix/cagr-edge-case`
3. Siga as convenções de commit: [Conventional Commits](https://www.conventionalcommits.org/)
4. Escreva testes para nova funcionalidade
5. Garanta que todos os testes passem: `npm test`
6. Garanta a cobertura: `npm run test:coverage`
7. Verifique o lint: `npm run lint`
8. Verifique tipos: `npm run typecheck`
9. Abra o PR contra a branch `main`

## Desenvolvimento Local

```bash
npm install
npm run dev        # Build em watch mode
npm test           # Rodar testes
npm run test:coverage  # Verificar cobertura
npm run lint       # Verificar lint
npm run typecheck  # Verificar tipos
npm run build      # Build de produção
```

## Estrutura do Projeto

```
src/
├── index.ts           — Ponto de entrada público
├── types.ts           — Interfaces de entrada/saída
├── constants.ts       — Cores, meses, thresholds
├── formatters.ts      — Formatadores BRL/%
├── engine.ts          — Orquestrador
└── metrics/           — Módulos de métricas individuais

tests/
├── fixtures/          — Dados de teste compartilhados
└── metrics/           — Testes por métrica
```

## Princípios

- **Zero dependências runtime** — o motor não deve depender de nada além do stdlib
- **Funções puras** — sem side effects, sem mutação de entrada
- **100% tipado** — sem `any`, sem type assertions desnecessárias
- **Tree-shakeable** — cada métrica importável individualmente
- **Cobertura mínima**: 95% statements, 90% branches, 95% functions
