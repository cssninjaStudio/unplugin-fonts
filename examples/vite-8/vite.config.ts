import Unfonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Unfonts({
      google: {
        families: [
          {
            name: 'Crimson Pro',
            fallback: { category: 'sans-serif' },
          },
          { name: 'Open Sans', fallback: { category: 'sans-serif' } },
          { name: 'Material+Icons' },
        ],
      },

      custom: {
        display: 'swap',
        families: {
          'Dancing Script': {
            src: './assets/fonts/DancingScript*',
            fallback: { category: 'serif' },
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
            fallback: { category: 'sans-serif' },
          },
          {
            name: 'Truculenta',
            weights: [400, 700],
            fallback: { category: 'sans-serif' },
          },
        ],
      },
    }),
  ],
})
