# Release Checklist — Yuzer Intelligence Engine

## Pré-requisitos (uma vez por projeto)

- [ ] `NPM_TOKEN` configurado como secret no GitHub (`tiagohanna123/yuzer-intelligence-engine`)
  - Gerar em: https://www.npmjs.com/settings/tiagohanna123/tokens
  - Permissão: `automation` (basta para CI publish com --provenance)

## Para cada release (ex: v0.3.0)

1. **Atualizar versão no código**
   ```bash
   npm version 0.3.0 --no-git-tag-version
   ```

2. **Atualizar CHANGELOG.md**
   - Adicionar entrada `## [0.3.0] — YYYY-MM-DD`
   - Categorias: Adicionado, Corrigido, Melhorado, Removido

3. **Atualizar ROADMAP.md**
   - Mover versão atual para "✅ Complete"
   - Atualizar "Current version"

4. **Validar tudo**
   ```bash
   npm run build && npm test && npm run typecheck && npm run lint
   ```

5. **Commit e tag**
   ```bash
   git add -A
   git commit -m "chore: bump to v0.3.0"
   git tag v0.3.0
   git push origin main --tags
   ```

6. **CI faz automaticamente**: GitHub Release + npm publish (--provenance)

## Rollback

```bash
git tag -d v0.3.0
git push origin :refs/tags/v0.3.0
npm unpublish yuzer-intelligence-engine@0.3.0
```
