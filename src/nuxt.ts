import type { Options } from './types'
import { addTemplate, addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import unplugin from '.'
import { getHeadLinkTags } from './loaders'
import { customVirtualModule } from './loaders/custom'
import { fontsourceImports } from './loaders/fontsource'

export default defineNuxtModule({
  meta: {
    name: 'unplugin-fonts',
    configKey: 'unfonts',
  },
  setup(options: Options, nuxt) {
    if ('fontsource' in options || 'custom' in options) {
      nuxt.options.css ||= []
      if (options.fontsource) {
        for (const src of fontsourceImports(options.fontsource))
          nuxt.options.css.push(src)
      }

      if (options.custom) {
        nuxt.options.css.push('#build/unfonts.css')
        options.custom.prefetchPrefix = nuxt.options.runtimeConfig.app.buildAssetsDir

        addTemplate({
          filename: 'unfonts.css',
          getContents: () => customVirtualModule(options.custom!, nuxt.options.rootDir),
        })
      }
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
