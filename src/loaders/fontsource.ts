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
      const name = family.toLowerCase().replace(/ /g, '-')
      source.push(`@import "@fontsource/${name}";`)
      continue
    }

    const name = family.name.toLowerCase().replace(/ /g, '-')
    const subsetPrefix = family.subset ? `${family.subset}-` : ''

    if ('variables' in family) {
      for (const variable of family.variables)
        source.push(`@import "@fontsource/${name}/${subsetPrefix}${variable}.css";`)
    }
    else if ('weights' in family) {
      for (const weight of family.weights) {
        if (family.styles) {
          for (const style of family.styles) {
            if (style === 'normal')
              source.push(`@import "@fontsource/${name}/${subsetPrefix}${style}.css";`)
            else
              source.push(`@import "@fontsource/${name}/${subsetPrefix}${weight}-${style}.css";`)
          }
        }
        else {
          source.push(`@import "@fontsource/${name}/${subsetPrefix}${weight}.css";`)
        }
      }
    }
  }

  return source.join('\n')
}
