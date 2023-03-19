import { defineConfig } from 'vitepress'
import Unfonts from '../../src/vite'

export default defineConfig({
  base: '/unplugin-fonts/',
  // site-level options
  title: 'VitePress',
  description: 'Just playing around.',

  themeConfig: {
    // theme-level options
  },

  vite: {
    plugins: [
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
  },
})
