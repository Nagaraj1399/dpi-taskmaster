import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: [
        'src/server/services/**/*.ts',
        'src/components/**/hooks/*.ts',
        'src/shared/**/*.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/shared/bricsData.ts'],
    },
  },
});
