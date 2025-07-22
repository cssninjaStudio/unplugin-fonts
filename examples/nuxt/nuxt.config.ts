import Unfonts from '../../src/nuxt'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-29',
  modules: [
    Unfonts,
  ],

  unfonts: {
    google: {
      families: ['Crimson Pro', 'Open Sans', 'Material+Icons'],
    },

    custom: {
      display: 'swap',
      families: {
        'Dancing Script': './public/fonts/DancingScript*',
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
        {
          name: 'Noto Sans JP Variable',
        },
      ],
    },
  },
})
