/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        replaceAttrValues: {
          '#333333': 'currentColor',
          '#000000': 'currentColor',
          '#333': 'currentColor',
          '#000': 'currentColor',
          black: 'currentColor',
        },
        svgProps: {
          fill: 'currentColor',
        },
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    }
  }
});
