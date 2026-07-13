import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Das ist der entscheidende Teil!
  },
});