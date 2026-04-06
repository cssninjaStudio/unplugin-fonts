import type { Options } from './types'
import { addTemplate, addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import unplugin from './index'
import { getHeadLinkTags } from './loaders'
import { customVirtualModule } from './loaders/custom'
import { generateAllFallbacks, hasFallbacks } from './loaders/fallback'
import { fontsourceImports } from './loaders/fontsource'

export default defineNuxtModule({
  meta: {
    name: 'unplugin-fonts',
    configKey: 'unfonts',
  },
  setup(options: Options, nuxt) {
    const needsCSSTemplate = 'fontsource' in options || 'custom' in options || hasFallbacks(options)

    if (needsCSSTemplate) {
      nuxt.options.css ||= []
      if (options.fontsource) {
        for (const src of fontsourceImports(options.fontsource))
          nuxt.options.css.push(src)
      }

      if (options.custom) {
        options.custom.prefetchPrefix = nuxt.options.app.buildAssetsDir
      }

      nuxt.options.css.push('#build/unfonts.css')
      addTemplate({
        filename: 'unfonts.css',
        getContents: async () => {
          let css = options.custom
            ? customVirtualModule(options.custom, nuxt.options.rootDir)
            : ''
          const fallbackCSS = await generateAllFallbacks(options, nuxt.options.rootDir)
          if (fallbackCSS)
            css += `\n${fallbackCSS}`
          return css
        },
      })
    }

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
