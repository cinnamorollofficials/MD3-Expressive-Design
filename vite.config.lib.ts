import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Library build. Two entries:
//   - `index`  : the public component barrel (no CSS imports).
//   - `styles` : side-effect-only; imports tokens, themes, typography, and
//                resets. Its emitted CSS is what consumers pull in via
//                `import '@hadi_gunawan/md3-expressive-ds/style.css'`.
//
// We keep ES format only — UMD is incompatible with multi-entry libs and
// modern bundlers/runtimes don't need it.
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/lib', 'src/custom.d.ts'],
    }),
  ],
  build: {
    cssCodeSplit: false, // collapse component CSS modules + token CSS into one file
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        styles: resolve(__dirname, 'src/lib/styles.ts'),
      },
      name: 'MD3ExpressiveDS',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (info) => {
          if (info.name?.endsWith('.css')) return 'style.css';
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
