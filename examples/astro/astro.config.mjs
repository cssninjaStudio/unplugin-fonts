import { defineConfig } from 'astro/config'
import Unfonts from 'unplugin-fonts/astro'

export default defineConfig({
  integrations: [
    Unfonts({
      google: {
        families: ['Crimson Pro', 'Open Sans', 'Material+Icons'],
      },

      custom: {
        display: 'swap',
        families: {
          'Dancing Script': {
            src: './public/assets/fonts/DancingScript*',
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
            subset: 'latin-ext',
          },
        ],
      },
    }),
  ],
})
