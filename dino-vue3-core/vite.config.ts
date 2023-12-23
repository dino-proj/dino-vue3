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
      entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/request/axios.ts')],
      name: 'DinoVue3Core',
      fileName: (format, entry) => `${entry}.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@vue/runtime-core', 'axios', 'lodash-es'],
      output: {
        globals: {
          vue: 'Vue',
          uni: 'uni',
          wx: 'wx'
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
