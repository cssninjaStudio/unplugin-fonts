import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite';
import Unfonts from '../../src/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    Unfonts({
      google: {
        families: ['Crimson Pro', 'Open Sans', 'Material+Icons'],
      },

      custom: {
        display: 'swap',
        families: {
          'Dancing Script': {
            src: './src/assets/fonts/DancingScript*',
            transform(font) {
              if (font.basename === 'DancingScript-Bold')
                font.weight = 700

              return font
            },
          },
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
          },
        ],
      },
    }),
  ],
})
