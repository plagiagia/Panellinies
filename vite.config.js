import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: ['index.html', 'math.html', 'physics.html', 'math-2026.html', 'physics-2026.html', 'math-2025.html', 'physics-2025.html', 'topics.html', 'community.html'],
    },
  },
});
