import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['packages/**/*.test.ts'],
    passWithNoTests: true          // ← add this line
  }
});
