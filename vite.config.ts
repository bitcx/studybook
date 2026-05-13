// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '/pages': resolve(__dirname, 'pages'),
    },
  },
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
