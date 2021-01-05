import { defineConfig } from 'vite'
import ViteFonts from "vite-fonts";

export default defineConfig({
  plugins: [
    ViteFonts({
      google: {
        families: ['Crimson Pro', 'Open Sans'],
      },
      typekit: {
        id: 'glm4yoq',
      }
    })
  ]
})