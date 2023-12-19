// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DinoJsBase',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true
    })
  ]
})
