import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/types.ts', 'src/constants.ts', 'src/formatters.ts', 'src/metrics/index.ts'],
      thresholds: {
        statements: 100,
        branches: 85,
        functions: 100,
        lines: 100,
      },
    },
  },
})
