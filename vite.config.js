 import { defineConfig } from 'vite';
import fs from 'fs';
import { resolve } from 'path';

const htmlFiles = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith('.html'))
  .reduce((inputs, file) => {
    inputs[file.replace('.html', '')] = resolve(__dirname, file);
    return inputs;
  }, {});

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
});
