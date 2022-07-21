import type { HtmlTagDescriptor } from 'vite'

export interface TypeKitFonts {
  id: string
  defer?: boolean
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

const TypekitFontBase = 'https://use.typekit.net/'

function injectFonts({
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

export default injectFonts
