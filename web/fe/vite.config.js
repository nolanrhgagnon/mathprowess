import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import prerender from 'vite-plugin-prerender';

export default defineConfig({
  plugins: [
      react(), 
      tailwindcss(),
      prerender({
        staticDir: 'dist', 
        routes: ['/', '/about', '/courses'],
      }),
  ],
  resolve: {
      alias: {
          '~': path.resolve(__dirname, './src'),
      },
  },
});
