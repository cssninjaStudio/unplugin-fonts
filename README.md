# vite-plugin-fonts

Webfont loader for vite

### Install

```sh
npm i --save-dev vite-plugin-fonts # yarn add -D vite-plugin-fonts
```

### Add it to vite.config.js

```ts
// vite.config.js
import { VitePluginFonts } from 'vite-plugin-fonts'

export default {
  plugins: [
    VitePluginFonts({
      google: {
        families: ['Source Sans Pro'],
      },
    }),
  ],
}
```

### Import generated `@font-rules` CSS
Only needed if using local/custom fonts
```ts
// main.ts
import 'virtual:fonts.css'
```

If using `nuxt@>3` or `nuxt-edge`, you can leverage the virtual file system to import the generated CSS.
```ts
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'
import Fonts from 'vite-plugin-fonts'

export default defineNuxtConfig({
  css: [
    'virtual:fonts.css',
  ],
  vite: {
    plugins: [
      Fonts({ /** vite-plugin-fonts config */}),
    ],
  },
})
```

> :warning:
> This will not inject Google/Typekit fonts, only custom fonts will be loaded.

## Options

```ts
// vite.config.js
import { VitePluginFonts } from 'vite-plugin-fonts'

export default {
  plugins: [
    VitePluginFonts({
      // Typekit API
      typekit: {
        /**
         * Typekit project id
         */
        id: '<projectId>',

        /**
         * enable non-blocking renderer
         *   <link rel="preload" href="xxx" as="style" onload="this.rel='stylesheet'">
         * default: true
         */
        defer: true,

        /**
         * define where the font load tags should be inserted
         * default: 'head-prepend'
         *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
         */
        injectTo: 'head-prepend',
      },

      // Google Fonts API V2
      google: {
        /**
         * enable preconnect link injection
         *   <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
         * default: true
         */
        preconnect: false,

        /**
         * values: auto, block, swap(default), fallback, optional
         * default: 'swap'
         */
        display: 'block',

        /**
         * define which characters to load
         * default: undefined (load all characters)
         */
        text: 'ViteAwsom',

        /**
         * define where the font load tags should be inserted
         * default: 'head-prepend'
         *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
         */
        injectTo: 'head-prepend',

        /**
         * Fonts families lists
         */
        families: [
          // families can be either strings (only regular 400 will be loaded)
          'Source Sans Pro',

          // or objects
          {
            /**
             * Family name (required)
             */
            name: 'Roboto',

            /**
             * Family styles
             */
            styles: 'ital,wght@0,400;1,200',

            /**
             * enable non-blocking renderer
             *   <link rel="preload" href="xxx" as="style" onload="this.rel='stylesheet'">
             * default: true
             */
            defer: true,
          },
        ],
      },

      // Custom fonts.
      custom: {
        /**
         * Fonts families lists
         */
        families: [{
          /**
           * Name of the font family.
           */
          name: 'Roboto',
          /**
           * Local name of the font. Used to add `src: local()` to `@font-rule`.
           */
          local: 'Roboto',
          /**
           * Regex(es) of font files to import. The names of the files will
           * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
           */
          src: './src/assets/fonts/*.ttf',
        }],

        /**
         * Defines the default `font-display` value used for the generated
         * `@font-rule` classes.
         */
        display: 'auto',

        /**
         * Using `<link rel="preload">` will trigger a request for the WebFont
         * early in the critical rendering path, without having to wait for the
         * CSSOM to be created.
         */
        preload: true,

        /**
         * Using `<link rel="prefetch">` is intended for prefetching resources
         * that will be used in the next navigation/page load
         * (e.g. when you go to the next page)
         *
         * Note: this can not be used with `preload`
         */
        prefetch: false,

        /**
         * define where the font load tags should be inserted
         * default: 'head-prepend'
         *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
         */
        injectTo: 'head-prepend',
      },
    }),
  ],
}
```


## Ressources

- https://web.dev/optimize-webfont-loading/
- https://csswizardry.com/2020/05/the-fastest-google-fonts/
- _(unmaintained)_ https://www.npmjs.com/package/webfontloader
