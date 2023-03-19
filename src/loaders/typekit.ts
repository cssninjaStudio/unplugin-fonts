import type { HtmlTagDescriptor } from 'vite'
import type { TypeKitFonts } from '../types'

const TypekitFontBase = 'https://use.typekit.net/'

export function typekitLoader({
  id,
  defer = true,
  injectTo = 'head-prepend',
}: TypeKitFonts): HtmlTagDescriptor[] {
  const tags: HtmlTagDescriptor[] = []

  if (typeof id !== 'string') {
    console.warn('A Typekit id is required')

    return tags
  }

  if (defer) {
    tags.push({
      tag: 'link',
      injectTo,
      attrs: {
        rel: 'preload',
        as: 'style',
        onload: 'this.rel=\'stylesheet\'',
        href: `${TypekitFontBase}${id}.css`,
      },
    })
  }
  else {
    tags.push({
      tag: 'link',
      injectTo,
      attrs: {
        rel: 'stylesheet',
        href: `${TypekitFontBase}${id}.css`,
      },
    })
  }

  return tags
}
