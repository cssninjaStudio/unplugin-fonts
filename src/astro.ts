import type { Options } from './types'
import unplugin from '.'
// import { getHeadLinkTags } from './loaders'

export default function (options: Options) {
  return {
    name: 'unplugin-fonts',
    hooks: {
      'astro:config:setup': async (astro: any) => {
        if (options?.custom)
          options.custom.stripPrefix = 'public/'

        astro.config.vite.plugins ||= []
        astro.config.vite.plugins.push(unplugin.vite(options))

        // const links = getHeadLinkTags(options, astro.config.root.toString())
        // const linksString: string[] = []

        // for (const link of links) {
        //   linksString.push(`<link ${Object.entries(link.attrs || {}).map(([key, value]) => `${key}="${value}"`).join(' ')} />`)
        // }

        astro.injectScript('page-ssr', 'import "unfonts.css";')
      },
    },
  }
}
