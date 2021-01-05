import type { HtmlTagDescriptor } from 'vite'

export type GoogleFontFamily = {
  name: string
  styles?: string
  defer?: boolean
}
export type GoogleFonts = {
  families: (string | GoogleFontFamily)[]
  text?: string
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  preconnect?: boolean
}

const GoogleFontsBase = 'https://fonts.googleapis.com/css2'

function injectFonts({
  families,
  text,
  preconnect = true,
  display = 'swap',
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
        deferedSpecs.push(encodeURIComponent(family))
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

      let spec = encodeURIComponent(name)

      if (typeof styles === 'string')
        spec += `:${encodeURIComponent(styles)}`

      if (defer)
        deferedSpecs.push(spec)
      else
        specs.push(spec)
    }
  }

  // warm up the fonts’ origin
  if (preconnect && specs.length + deferedSpecs.length > 0)
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
        crossorigin: '',
      }
    })

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
        onload: "this.rel='stylesheet'",
        href,
      }
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
      attrs: {
        rel: 'stylesheet',
        href,
      }
    })
  }

  return tags
}
export default injectFonts
