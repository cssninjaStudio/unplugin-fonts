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

      fontsource: {
        families: [
          {
            name: 'ABeeZee',
            weights: [400],
            styles: ['italic'],
          },
          {
            name: 'Truculenta',
            weights: [400, 700],
            subset: 'latin-ext',
          },
        ],
      },
    }),
  ],
})
