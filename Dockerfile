# ── Build stage ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vitest.config.ts ./
COPY src/ src/
RUN npm run build

# ── Production stage ─────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/LICENSE ./
COPY --from=builder /app/README.md ./
COPY --from=builder /app/CHANGELOG.md ./

# Apenas runtime — zero dependências, copia só os artefatos
RUN npm pkg delete scripts devDependencies

USER node
CMD ["node", "-e", "console.log('yuzer-intelligence-engine v' + require('./package.json').version + ' — importe como pacote')"]
