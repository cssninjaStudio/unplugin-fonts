import type { HtmlTagDescriptor } from 'vite'

export interface GoogleFontFamily {
  name: string
  styles?: string
  defer?: boolean
}
export interface GoogleFonts {
  families: (string | GoogleFontFamily)[]
  text?: string
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  preconnect?: boolean
  /**
   * @default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

const GoogleFontsBase = 'https://fonts.googleapis.com/css2'
const GStaticBase = 'https://fonts.gstatic.com/'

export function googleLoader({
  families,
  text,
  preconnect = true,
  display = 'swap',
  injectTo = 'head-prepend',
}: GoogleFonts): HtmlTagDescriptor[] {
  const specs: string[] = []
  const deferedSpecs: string[] = []
  const tags: HtmlTagDescriptor[] = []

  if (!Array.isArray(families)) {
    console.warn('Google font families is required')

    return tags
  }

  if (families.length >= 0) {
    for (const family of families) {
      if (typeof family === 'string') {
        deferedSpecs.push(family)
        continue
      }

      if (!(family as GoogleFontFamily))
        continue

      const {
        name,
        styles,
        defer = true,
      } = family

      if (!name) {
        console.warn('A google font family name is missing')
        continue
      }

      let spec = name

      if (typeof styles === 'string')
        spec += `:${styles}`

      if (defer)
        deferedSpecs.push(spec)
      else
        specs.push(spec)
    }
  }

  // warm up the fonts’ origin
  if (preconnect && specs.length + deferedSpecs.length > 0) {
    tags.push({
      tag: 'link',
      injectTo,
      attrs: {
        rel: 'preconnect',
        href: GStaticBase,
        crossorigin: true,
      },
    })
  }

  // defer loading font-faces definitions
  // @see https://web.dev/optimize-lcp/#defer-non-critical-css
  if (deferedSpecs.length > 0) {
    let href = `${GoogleFontsBase}?family=${deferedSpecs.join('&family=')}`

    if (typeof display === 'string' && display !== 'auto')
      href += `&display=${display}`

    if (typeof text === 'string' && text.length > 0)
      href += `&text=${text}`

    tags.push({
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'style',
        onload: 'this.rel=\'stylesheet\'',
        href,
      },
    })
  }

  // load critical fonts
  if (specs.length > 0) {
    let href = `${GoogleFontsBase}?family=${specs.join('&family=')}`

    if (typeof display === 'string' && display !== 'auto')
      href += `&display=${display}`

    if (typeof text === 'string' && text.length > 0)
      href += `&text=${text}`

    tags.push({
      tag: 'link',
      injectTo,
      attrs: {
        rel: 'stylesheet',
        href,
      },
    })
  }

  return tags
}
