import MagicString from 'magic-string'
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
    order: 'pre',
    resolveId(id) {
      if (id.startsWith(virtualStylesId))
        return resolvedVirtualStylesId

      if (id.startsWith(virtualModuleId))
        return resolvedVirtualModuleId
    },

    load(id) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        const tags = getHeadLinkTags(options, root)
        const s = new MagicString(`export const links = ${JSON.stringify(tags)};\n`)

        return {
          code: s.toString(),
          map: options.sourcemap
            ? s.generateMap({ hires: true })
            : undefined,
        }
      }

      if (id.startsWith(resolvedVirtualStylesId)) {
        const s = new MagicString('')

        if (options.fontsource)
          s.append(`${fontsourceVirtualModule(options.fontsource)}\n`)

        if (options.custom)
          s.append(`${customVirtualModule(options.custom, root)}\n`)

        return {
          code: s.toString(),
          map: options.sourcemap
            ? s.generateMap({ hires: true })
            : undefined,
        }
      }
    },
    vite: {
      configResolved(viteConfig) {
        root = viteConfig.root
      },
      transformIndexHtml: {
        order: 'pre',
        handler: () => getHeadLinkTags(options, root),
      },
    },
  }
})
