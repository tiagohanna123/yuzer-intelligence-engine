# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-05-05

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

[0.2.0]: https://github.com/tiagohanna123/yuzer-intelligence-engine/releases/tag/v0.2.0
[0.1.0]: https://github.com/tiagohanna123/yuzer-intelligence-engine/releases/tag/v0.1.0
