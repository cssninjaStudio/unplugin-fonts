import { defineConfig } from 'vite'
import ViteFonts from 'vite-plugin-fonts'

export default defineConfig({
  plugins: [
    ViteFonts({
      google: {
        families: ['Crimson Pro', 'Open Sans', 'Material+Icons'],
      },

      custom: {
        families: {
          'Dancing Script': './assets/fonts/DancingScript*',
        },
      },
    }),
  ],
})
