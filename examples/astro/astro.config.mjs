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
          'Dancing Script': './public/assets/fonts/DancingScript*',
        },
      },
    }),
  ],
})
