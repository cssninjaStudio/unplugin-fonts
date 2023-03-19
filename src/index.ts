import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getHeadLinkTags } from './loaders'
import { fontsourceVirtualModule } from './loaders/fontsource'
import { customVirtualModule } from './loaders/custom'

const virtualStylesId = 'unfonts.css'
const resolvedVirtualStylesId = `\0${virtualStylesId}`

const virtualModuleId = 'unplugin-fonts/head'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export default createUnplugin<Options | undefined>((userOptions) => {
  const options = userOptions || {}
  let root: string

  return {
    name: 'unplugin-fonts',
    enforce: 'pre',
    resolveId(_id) {
      const id = _id.replace(/\?.*$/, '')

      if (id === virtualStylesId)
        return resolvedVirtualStylesId

      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },

    load(_id) {
      const id = _id.replace(/\?.*$/, '')

      if (id === resolvedVirtualModuleId)
        return `export const links = ${JSON.stringify(getHeadLinkTags(options, root))}`

      if (id === resolvedVirtualStylesId) {
        const source: string[] = []

        if (options.fontsource)
          source.push(fontsourceVirtualModule(options.fontsource))

        if (options.custom)
          source.push(customVirtualModule(options.custom, root))

        return source.join('\n')
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
