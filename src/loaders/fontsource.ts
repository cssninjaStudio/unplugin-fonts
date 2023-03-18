
export interface FontsourceFontFamily {
  name: string
  weights: (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)[]
  styles?: ('italic' | 'normal')[]
  subset?: string
}
export interface FontsourceFonts {
  families: (string | FontsourceFontFamily)[]
  text?: string
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
}

export function fontsourceVirtualModule(options?: FontsourceFonts) {
  const source: string[] = []

  const {
    families = [],
  } = options || {}

  for(const family of families) {
    if(typeof family === 'string') {
      source.push(`@import "@fontsource/${family.toLowerCase()}";`)
    } else {
      const {
        name,
        weights,
        styles,
        subset
      } = family


      const subsetPrefix = subset ? `${subset}-` : ''

      if (weights) {
        for (const weight of weights) {
          if (styles) {
            for (const style of styles) {
              if (style === 'normal') {
                source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${style}.css";`)
              } else {
                source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${weight}-${style}.css";`)
              }
            }
          } else {
            source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${weight}.css";`)
          }
        }
      } else {
        if (subset) {
          source.push(`@import "@fontsource/${name.toLowerCase()}/${subset}.css";`)
        } else {
          source.push(`@import "@fontsource/${name.toLowerCase()}";`)
        }
      }

    }
  }

  return source.join('\n')
}