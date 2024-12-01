// Workaround for:
// src/nuxt.ts(5,1): error TS2742: The inferred type of 'default' cannot be named without a reference to '.pnpm/@nuxt+schema@3.0.0_rollup@3.7.3/node_modules/@nuxt/schema'. This is likely not portable. A type annotation is necessary.
import type {} from '@nuxt/schema'
import type { Options } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import unplugin from '.'
import { getHeadLinkTags } from './loaders'
import { fontsourceImports } from './loaders/fontsource'

export default defineNuxtModule({
  meta: {
    name: 'unplugin-fonts',
    configKey: 'unfonts',
  },
  setup(options: Options, nuxt) {
    if ('fontsource' in options || 'custom' in options) {
      nuxt.options.css ||= []
      nuxt.options.css.push('unfonts.css')
      if ('fontsource' in options) {
        for (const src of fontsourceImports(options.fontsource))
          nuxt.options.css.push(src)

        delete options.fontsource
      }
    }

    if (options.custom)
      options.custom.prefetchPrefix = nuxt.options.runtimeConfig.app.buildAssetsDir

    const links = getHeadLinkTags(options)

    nuxt.options.app.head ||= {}
    nuxt.options.app.head.link ||= []

    for (const link of links) {
      nuxt.options.app.head.link.push({
        ...link.attrs as any,
      })
    }

    addWebpackPlugin(unplugin.webpack(options))
    addVitePlugin(unplugin.vite(options))
  },
})
