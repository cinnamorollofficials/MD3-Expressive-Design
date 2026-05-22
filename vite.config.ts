import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
  return {
    plugins: [react()],
    base: process.env.GITHUB_ACTIONS ? '/MD3-Expressive-Design/' : '/',
    server: { port: 5173, open: true },
    build: {
      outDir: 'dist-demo',
    },
  };
});
