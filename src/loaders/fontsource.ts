import type { FontsourceFonts } from '../types'

export function fontsourceVirtualModule(options?: FontsourceFonts) {
  const source: string[] = []

  const {
    families = [],
  } = options || {}

  for (const family of families) {
    if (!family)
      continue

    if (typeof family === 'string') {
      source.push(`@import "@fontsource/${family.toLowerCase()}";`)
      continue
    }
    const {
      name,
      variables,
      weights,
      styles,
      subset,
    } = family

    const subsetPrefix = subset ? `${subset}-` : ''

    if (variables) {
      if (weights)
        console.warn('unplugin-fonts: Variable fonts does not support weights. Ignoring weights.')

      for (const variable of variables)
        source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${variable}.css";`)
    }
    else if (weights) {
      for (const weight of weights) {
        if (styles) {
          for (const style of styles) {
            if (style === 'normal')
              source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${style}.css";`)
            else
              source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${weight}-${style}.css";`)
          }
        }
        else {
          source.push(`@import "@fontsource/${name.toLowerCase()}/${subsetPrefix}${weight}.css";`)
        }
      }
    }
    else {
      if (subset)
        source.push(`@import "@fontsource/${name.toLowerCase()}/${subset}.css";`)
      else
        source.push(`@import "@fontsource/${name.toLowerCase()}";`)
    }
  }

  return source.join('\n')
}
