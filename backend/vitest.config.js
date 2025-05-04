import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // include: ['tests/*.test.js'],
    globalSetup: './tests/globalSetup.js',
    hookTimeout: 30000, // Set timeout to 30 seconds
    // silent: true,
  },
});