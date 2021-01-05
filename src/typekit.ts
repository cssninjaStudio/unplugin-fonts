import type { HtmlTagDescriptor } from 'vite'

export type TypeKitFonts = {
  id: string
  defer?: boolean
}

const TypekitFontBase = 'https://use.typekit.net/'

function injectFonts({
  id,
  defer = true,
}: TypeKitFonts): HtmlTagDescriptor[] {
  const tags: HtmlTagDescriptor[] = []

  if (typeof id !== 'string') {
    console.warn('A Typekit id is required')

    return tags
  }

  if (defer)
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'style',
        onload: "this.rel='stylesheet'",
        href: `${TypekitFontBase}${id}.css`,
      }
    })
  else
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        href: `${TypekitFontBase}${id}.css`,
      }
    })

  return tags
}

export default injectFonts
