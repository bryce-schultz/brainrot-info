import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools'
import { combineJsonPlugin } from './vite-plugin-combine-json.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    imagetools(),
    combineJsonPlugin({
      sources: {
        rebirths: 'src/data/rebirths.json',
        brainrots: 'src/data/brainrots.json',
        types:     'src/data/types.json',
        traits:    'src/data/traits.json',
        machine:   'src/data/machine.json',
        events:    'src/data/events.json',
      },
    }),
  ],
})
