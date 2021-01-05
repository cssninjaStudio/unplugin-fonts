# vite-plugin-fonts

Webfont loader for vite

### Install

```sh
npm i --save-dev vite-plugin-fonts # yarn add -D vite-plugin-fonts
```

### Add it to vite.config.js

```ts
// vite.config.js
import ViteFonts from 'vite-plugin-fonts'

export default {
  plugins: [
    ViteFonts({
      google: {
        families: ['Source Sans Pro']
      },
    })
  ],
}
```


## Options

```ts
// vite.config.js
import ViteFonts from 'vite-plugin-fonts'

export default {
  plugins: [
    ViteFonts({
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
        defer: true
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
         * values: auto, block, swap(default), fallback, optional
         * default: undefined
         */
        text: 'ViteAwsom',

        
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
            defer: true
          }
        ]
      },
    })
  ],
}
```


## Ressources

- https://web.dev/optimize-webfont-loading/
- https://csswizardry.com/2020/05/the-fastest-google-fonts/
- _(unmaintained)_ https://www.npmjs.com/package/webfontloader