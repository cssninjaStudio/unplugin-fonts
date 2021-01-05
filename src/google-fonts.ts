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
}: GoogleFonts, html: string): string {
  const specs: string[] = []
  const deferedSpecs: string[] = []
  let links = ''

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
    links += '<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />'

  // defer loading font-faces definitions 
  // @see https://web.dev/optimize-lcp/#defer-non-critical-css
  if (deferedSpecs.length > 0) {
    let deferedFonts = `${GoogleFontsBase}?family=${deferedSpecs.join('&family=')}`

    if (typeof display === 'string' && display !== 'auto')
      deferedFonts += `&display=${display}`
    
    if (typeof text === 'string' && text.length > 0)
      deferedFonts += `&text=${text}`

    links += `<link rel="preload" href="${deferedFonts}" as="style" onload="this.rel='stylesheet'">`
  }

  // load critical fonts
  if (specs.length > 0) {
    let criticalFonts = `${GoogleFontsBase}?family=${specs.join('&family=')}`

    if (typeof display === 'string' && display !== 'auto')
      criticalFonts += `&display=${display}`
    
    if (typeof text === 'string' && text.length > 0)
      criticalFonts += `&text=${text}`

    links += `<link rel="stylesheet" href="${criticalFonts}" />`
  }

  return html.replace(
    /<head>/,
    `<head>${links}`,
  )
}
export default injectFonts
