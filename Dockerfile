# =============================================================================
# Dockerfile — yuzer-intelligence-engine
# =============================================================================
# Multi-stage build for a pure TypeScript library (zero runtime deps).
#
# Usage:
#   docker build -t yuzer-intelligence-engine .
#   docker run --rm yuzer-intelligence-engine           # shows version
#   docker run --rm --entrypoint node yuzer-intelligence-engine \
#     -e "require('/app/dist/index.cjs').analyze(...)"   # use programmatically
#
# As base image in downstream Dockerfiles:
#   FROM yuzer-intelligence-engine AS lib
#   FROM node:22-alpine
#   COPY --from=lib /app /opt/lib
#   # Then import via relative path or npm link
#
# As CI test runner:
#   docker build --target builder -t yuzer-engine-builder .
#   docker run --rm yuzer-engine-builder npm test
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1 — Builder
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /build

# 1) Install dependencies (package-lock.json required for npm ci)
COPY package*.json ./
RUN npm ci --ignore-scripts

# 2) Copy source and build
COPY tsconfig.json ./
COPY src/ src/
RUN npm run build

# Remove devDependencies — only needed for build, not for runtime
RUN npm prune --omit=dev

# ---------------------------------------------------------------------------
# Stage 2 — Runtime
# ---------------------------------------------------------------------------
# Using node:22-alpine for practicality (shell, smaller debugging surface).
# Alternative: gcr.io/distroless/nodejs22 (~50% smaller image, no shell).
# Trade-off: distroless has no apt, no sh, no npm — harder to extend.
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and package metadata from builder
COPY --from=builder /build/dist         ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./
COPY --from=builder /build/LICENSE      ./
COPY --from=builder /build/README.md    ./

# Verify both CJS and ESM entry points load correctly at build time
RUN node -e "const m = require('/app/dist/index.cjs'); console.log('CJS OK —', Object.keys(m).length, 'exports')" && \
    node --input-type=module \
      -e "import('/app/dist/index.js').then(m => console.log('ESM OK —', Object.keys(m).length, 'exports'))"

# ---------------------------------------------------------------------------
# Metadata
# ---------------------------------------------------------------------------
LABEL org.opencontainers.image.title="yuzer-intelligence-engine" \
      org.opencontainers.image.description="Financial analytics engine — CAGR, correlation, Pareto, forecast, seasonality, product growth. Zero runtime dependencies." \
      org.opencontainers.image.version="0.2.0" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/tiagohanna123/yuzer-intelligence-engine" \
      org.opencontainers.image.documentation="https://github.com/tiagohanna/yuzer-intelligence-engine#readme"

# ---------------------------------------------------------------------------
# Healthcheck
# ---------------------------------------------------------------------------
# Since there is no CLI binary yet, healthcheck verifies the module loads.
# Once a CLI is added (e.g. --version), replace with:
#   CMD node /app/dist/cli.js --version || exit 1
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('/app/dist/index.cjs')" || exit 1

# ---------------------------------------------------------------------------
# Default entrypoint
# ---------------------------------------------------------------------------
# Shows version info — useful for verifying the image was built correctly.
CMD ["node", "-e", "\
  const p = require('/app/package.json');\
  console.log(p.name + ' v' + p.version + ' — ' + p.description);\
  console.log('Use as base image or mount your app and import via /app/dist');\
"]
