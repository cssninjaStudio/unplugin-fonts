import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getHeadLinkTags } from './loaders'
import { fontsourceVirtualModule } from './loaders/fontsource'
import { customVirtualModule } from './loaders/custom'

const MODULE_ID = 'unfonts.css'
const MODULE_ID_RESOLVED = '/@unplugin-fonts/fonts.css'

export default createUnplugin<Options | undefined>((userOptions) => {
  const options = userOptions || {}
  let root: string

  return {
    name: 'unplugin-fonts',
    enforce: 'pre',
    resolveId(id) {
      if (id === MODULE_ID)
        return MODULE_ID_RESOLVED
    },

    load(id) {
      if (id === MODULE_ID_RESOLVED) {
        const source: string[] = []

        if (options.fontsource) {
          source.push(fontsourceVirtualModule(options.fontsource))
        }

        if (options.custom) {
          source.push(customVirtualModule(options.custom, root))
        }

        return source.join('\n\n')
      }
    },
    vite: {
      configResolved(viteConfig) {
        root = viteConfig.root
      },
      transformIndexHtml: {
        enforce: 'pre',
        transform: () => getHeadLinkTags(options, root),
      },
    },
  }
})
