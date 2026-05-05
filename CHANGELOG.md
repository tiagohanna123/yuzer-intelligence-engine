# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] — 2026-05-05

### Adicionado

- **`vitest.config.ts`** — configuração oficial com thresholds 100% de cobertura (exclui barrel files e formatters)
- **`Dockerfile`** — multi-stage build (node:22-alpine, < 10MB final)
- **Repositório público** — 13 topics no GitHub (analytics, typescript, cagr, pareto, forecast, seasonality, etc.)
- **CI verde confirmada** — 6 runs, todas passando

### Corrigido

- `package.json` — `repository.url` e `homepage` apontam para `tiagohanna123` (consistente com GitHub real)
- `README.md` — badges CI/codecov/npm corrigidos para `tiagohanna123`; typo `|npm test` → `npm test`
- `CONTRIBUTING.md`, `SUPPORT.md` — URLs corrigidas para `tiagohanna123`

### Melhorado

- **Repositório consistente** — todas as URLs, badges e referências apontam para o mesmo GitHub org
- **Docker build** — imagem mínima (apenas dist + README + LICENSE) para consumo em containers

## [0.2.0] — 2026-05-05

### Adicionado

- Cobertura de branches: 100% (todas as condicionais testadas)
- 91 testes unitários (12 arquivos de teste)
- ESLint flat config com regras strict + stylistic
- TypeScript strict — 0 erros de tipo
- CI workflow otimizado: 3 jobs, cobertura integrada
- Seção "Features" no README com tabela das 11 métricas
- .gitignore expandido (IDE, backup, temp files)

### Corrigido

- `repository.url` no package.json: `tiagohanna123` → `tiagohanna`
- Badges do README apontando para o repositório correto
- Contagem de testes e bundle size na tabela de qualidade

### Melhorado

- 100% de cobertura: statements, branches, functions e lines
- Pipeline de CI: sem jobs redundantes, build valida antes do typecheck
- Documentação: README reestruturado com seção clara de features

## [0.1.0] — 2026-05-05

### Adicionado

- **5 novos cenários de borda** nos testes — branch coverage subiu de 88.57% → 95.71%
  - CAGR: receita zero nos primeiros 6 meses
  - Pareto: produtoMix com total zero
  - ProductGrowth: produto que aparece só na 2ª metade
  - Quarters: labels fora do padrão monthNames
- **Infraestrutura de projeto** — `.editorconfig`, `AGENTS.md`, `eslint.config.js`
- **ESLint flat config** — strict-type-checked + stylistic-type-checked, 0 erros
- **Badges** no README — CI, codecov, npm, TypeScript strict, bundle size, testes

### Corrigido

- Badges README: URL corrigida de `tiagohanna` → `tiagohanna123`
- Bundle size badge: 2.7KB → <10KB
- Test count badge: 90 → 91

### Qualidade

| Métrica | v0.1.0 | v0.2.0 |
|---------|--------|--------|
| Testes | 79 (12 files) | 91 (12 files) |
| Statements | 100% | 100% |
| Branches | 88.57% | 95.71% |
| Functions | 100% | 100% |
| Lines | 100% | 100% |
| ESLint | ❌ não configurado | ✅ 0 erros |
| TypeScript strict | ✅ 0 erros | ✅ 0 erros |

[0.2.1]: https://github.com/tiagohanna123/yuzer-intelligence-engine/releases/tag/v0.2.1
[0.2.0]: https://github.com/tiagohanna123/yuzer-intelligence-engine/releases/tag/v0.2.0
[0.1.0]: https://github.com/tiagohanna123/yuzer-intelligence-engine/releases/tag/v0.1.0
