import { defineConfig } from 'vite'
import Unfonts from '../../src/vite'

export default defineConfig({
  plugins: [
    Unfonts({
      google: {
        families: ['Crimson Pro', 'Open Sans', 'Material+Icons'],
      },

      custom: {
        display: 'swap',
        families: {
          'Dancing Script': './assets/fonts/DancingScript*',
        },
      },
    }),
  ],
})
