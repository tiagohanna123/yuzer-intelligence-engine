# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.1.0] — 2026-05-05

### Adicionado

- **Orquestrador `analyze()`** — função única que recebe `mensais`, `eventos`, `produtoMix`, `categorias` e retorna 20 métricas em `AnalysisResult`.
- **Cálculo Mês a Mês (`MomEntry[]`)** — growth percentual e média móvel 3 meses (MA3) para cada mês.
- **CAGR (`Compound Annual Growth Rate`)** — compara últimos 6 meses vs primeiros 6 meses, anualizado.
- **Correlação de Pearson** — correlação entre receita e pedidos, valor entre -1 e 1.
- **Análise de Pareto (80/20)** — identifica quantos produtos geram `threshold` da receita (padrão 80%).
- **Agregação Trimestral** — receita, pedidos e contagem agregados por trimestre (Q1–Q4).
- **Previsão por Regressão Linear** — projeta receita para os próximos N meses (padrão 3) baseado nos últimos 12 meses.
- **Sazonalidade** — receita média por mês do ano para identificar padrões sazonais.
- **Produtos em Alta** — top 10 produtos com maior crescimento entre 1ª e 2ª metade dos eventos.
- **Evolução do Ticket Médio** — ticket atual (média 6 meses), ticket anterior (média 6 meses) e crescimento %.
- **Análise de Categorias** — categorias ordenadas por receita + concentração top 3 (%).
- **Eventos Normalizados** — top/bottom 3 eventos por receita/dia + dados de dispersão (duração × receita).
- **Melhor/Pior Mês** — identificação do mês de maior e menor receita no período.
- **Opções customizáveis** — `AnalyzeOptions` com `monthNames`, `forecastPeriods`, `paretoThreshold`.

### Formatadores

- `fmt()` — formata valor como moeda BRL (`R$ 52.341`)
- `fmtNum()` — número com separador de milhar (`17.939`)
- `pct()` — percentual com sinal (`+18,5%`)
- `pctAbs()` — percentual absoluto (`78,1%`)
- `round()` — arredondamento para N casas decimais

### Constantes

- `GOLD`, `PURPLE`, `BLUE`, `GREEN`, `PINK`, `ORANGE` — paleta de cores
- `PALETA` — array com todas as cores
- `MESES` — nomes dos meses em português (Jan–Dez)
- `THRESHOLDS` — limiares para insights (CAGR, ticket, concentração, correlação, Pareto)

### Integridade Técnica

- **79 testes** — 23 integrados (engine) + 56 unitários (métricas), todos passando.
- **TypeScript strict** — 0 erros com `tsc --noEmit`.
- **Cobertura >95%** — thresholds configurados no Vitest.
- **Zero dependências runtime** — apenas TypeScript, Vitest e tsup como devDependencies.
- **ESM + CJS + DTS** — build via tsup gera três formatos com sourcemaps.
- **Tree-shakeable** — cada métrica pode ser importada individualmente.
- **Funções puras** — sem side effects, sem mutação de argumentos.
- **CI via GitHub Actions** — testes + build em Node 22 a cada push/PR na main.
- **Documentação inicial** — README com exemplos de uso, tipos, formatação e arquitetura.

[0.1.0]: https://github.com/tiagohanna/yuzer-intelligence-engine/releases/tag/v0.1.0
