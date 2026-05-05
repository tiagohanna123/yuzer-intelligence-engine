# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-05-05

### Adicionado

- Motor completo de análise com 11 métricas de negócio
  - CAGR (Compound Annual Growth Rate)
  - Correlação de Pearson (receita × pedidos)
  - Análise de Pareto (80/20)
  - Sazonalidade mensal
  - Previsão por regressão linear
  - Produtos em alta (comparação 1ª/2ª metade)
  - Evolução do ticket médio
  - Mês a mês com growth % e MA3
  - Agregação trimestral
  - Categorias e concentração
  - Eventos normalizados (receita/dia)
- Função `analyze()` que retorna todas as métricas em um resultado tipado
- Métricas individuais tree-shakeable
- Formatadores para dashboards (BRL, %, número)
- Paleta de cores e constantes
- Zero dependências runtime
- 100% TypeScript com strict mode
- Cobertura de testes: 100% statements, 91% branches, 100% functions
- CI/CD via GitHub Actions (test, typecheck, build, release)
- ESM + CJS dual build via tsup
- Documentação completa dos tipos e API

[0.1.0]: https://github.com/tiagohanna/yuzer-intelligence-engine/releases/tag/v0.1.0
