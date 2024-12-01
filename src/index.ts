import type { Options } from './types'
import MagicString from 'magic-string'
import { extname, join } from 'pathe'
import { createUnplugin } from 'unplugin'
import { getHeadLinkTags } from './loaders'
import { customVirtualModule } from './loaders/custom'
import { fontsourceImports, fontsourceVirtualModule } from './loaders/fontsource'

const virtualStylesId = 'unfonts.css'
const resolvedVirtualStylesId = `\0${virtualStylesId}`

const virtualModuleId = 'unplugin-fonts/head'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const fontFileRegex = /\.(?:woff2?|ttf|eot|otf)(?:\?.*)?$/i

export default createUnplugin<Options | undefined>((userOptions) => {
  const options = userOptions || {}
  let root: string
  let base: string

  return {
    name: 'unplugin-fonts',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith(virtualStylesId))
        return resolvedVirtualStylesId

      if (id.startsWith(virtualModuleId))
        return resolvedVirtualModuleId
    },

    load(id) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        const tags = getHeadLinkTags(options)
        const s = new MagicString(`export const links = ${JSON.stringify(tags)};\n`)

        s.append(`export const importMap = ${JSON.stringify(fontsourceImports(options.fontsource))};\n`)
        s.append(`export const styles = ${JSON.stringify(fontsourceVirtualModule(options.fontsource))};\n`)

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
        base = viteConfig.base
      },
      generateBundle(_options, bundle) {
        if ('VITEPRESS_CONFIG' in globalThis) {
          generateVitepressBundle(options, base, bundle, (globalThis as any).VITEPRESS_CONFIG)
          return
        }

        for (const chunk in bundle) {
          const info = bundle[chunk]
          if (info.name?.endsWith('.astro') || info.name === 'pages/all') {
            // @todo inject head to astro
          }
        }
      },
      // inject head tags on vite 4/5 in spa/mpa mode
      transformIndexHtml: {
        order: 'post',
        handler: (html, ctx) => {
          const tags = getHeadLinkTags(options)
          const files = Object.keys(ctx.bundle ?? {}).filter(key => fontFileRegex.test(key))
          const { prefetch: wantPrefetch, preload: wantPreload } = options?.custom || {}
          for (const file of files) {
            if (!(
              wantPrefetch === true || wantPreload === true ||
              (wantPrefetch === undefined && wantPreload === undefined)
            ))
              continue
            const ext = extname(file)
            tags.push({
              tag: 'link',
              injectTo: options?.custom?.injectTo ?? 'head-prepend',
              attrs: {
                rel: options?.custom?.prefetch ? 'prefetch' : 'preload',
                as: 'font',
                type: `font/${ext.replace('.', '')}`,
                href: join(base, file),
                crossorigin: 'anonymous',
              },
            })
          }
          let tagsReturned = tags
          if (options?.custom?.linkFilter) {
            const newTags: object[] | boolean = options?.custom?.linkFilter(tags)
            if (Array.isArray(newTags)) {
              tagsReturned = newTags
            } else {
              tagsReturned = newTags ? tags : []
            }
          }
          return tagsReturned
        },
      },
    },
  }
})

let vitepressInjected = false
function generateVitepressBundle(
  options: Options,
  base: string,
  bundle: any,
  vitepressConfig: any,
) {
  if (vitepressInjected)
    return
  vitepressInjected = true

  const tags = getHeadLinkTags(options)
  const files = Object.keys(bundle ?? {}).filter(key => fontFileRegex.test(key))
  const { prefetch: wantPrefetch, preload: wantPreload } = options?.custom || {}
  for (const file of files) {
    if (!(
      wantPrefetch === true || wantPreload === true ||
      (wantPrefetch === undefined && wantPreload === undefined)
    ))
      continue

    const ext = extname(file)
    tags.push({
      tag: 'link',
      injectTo: options.custom?.injectTo ?? 'head-prepend',
      attrs: {
        rel: options.custom?.prefetch ? 'prefetch' : 'preload',
        as: 'font',
        type: `font/${ext.replace('.', '')}`,
        href: join(base, file),
        crossorigin: 'anonymous',
      },
    })
  }

  let tagsReturned = tags
  if (options?.custom?.linkFilter) {
    const newTags: object[] | boolean = options?.custom?.linkFilter(tags)
    if (Array.isArray(newTags)) {
      tagsReturned = newTags
    } else {
      tagsReturned = newTags ? tags : []
    }
  }

  for (const tag of tagsReturned) {
    vitepressConfig?.site?.head?.push([
      tag.tag,
      tag.attrs?.onload === 'this.rel=\'stylesheet\''
        ? {
            rel: 'stylesheet',
            href: tag.attrs?.href,
          }
        : tag.attrs,
    ])
  }
}
