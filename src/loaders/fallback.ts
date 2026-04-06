import type { CustomFontFamily, FontFallbackConfig, Options } from '../types'
import { pathToFileURL } from 'node:url'
import { parse, walk } from 'css-tree'
import {
  generateFallbackName,
  generateFontFace,
  getMetricsForFamily,
  readMetrics,
  resolveCategoryFallbacks,
} from 'fontaine'
import MagicString from 'magic-string'
import { resolveFontFiles, resolveUserOption } from './custom'

/**
 * Find a representative font file to read metrics from.
 * Prefers regular (400) weight, then .ttf/.woff2 formats.
 */
function findRepresentativeFontFile(
  family: CustomFontFamily,
  root: string,
): string | undefined {
  const options = resolveUserOption({
    families: [family],
    display: 'auto',
  })
  const faces = resolveFontFiles(family, options, root)
  if (faces.length === 0)
    return undefined

  // Prefer the regular weight face
  const regularFace = faces.find(f => f.weight === 400) ?? faces[0]

  // Prefer .ttf > .woff2 > .woff > .otf for reliable metrics
  const preferredOrder = ['.ttf', '.woff2', '.woff', '.otf']
  for (const ext of preferredOrder) {
    const file = regularFace.files.find(f => f.ext === ext)
    if (file)
      return file.src
  }

  return regularFace.files[0]?.src
}

/**
 * Generate fallback @font-face CSS for a single font family.
 */
async function generateFallbackForFamily(params: {
  familyName: string
  config: FontFallbackConfig
  fontFilePath?: string
}): Promise<string> {
  const { familyName, config, fontFilePath } = params

  // 1. Get web font metrics — try by name first, then by file
  let metrics = await getMetricsForFamily(familyName)
  if (!metrics && fontFilePath) {
    metrics = await readMetrics(pathToFileURL(fontFilePath)).catch(() => null)
  }

  if (!metrics) {
    console.warn(
      `unplugin-fonts: Could not resolve metrics for "${familyName}", skipping fallback generation`,
    )
    return ''
  }

  // 2. Resolve system fallback fonts
  const systemFonts = config.fallbacks
    ?? resolveCategoryFallbacks({
      fontFamily: familyName,
      fallbacks: {},
      metrics: config.category
        ? { ...metrics, category: config.category }
        : metrics,
    })

  // 3. Generate fallback @font-face for each system font
  const fallbackName = config.name ?? generateFallbackName(familyName)
  const css: string[] = []

  for (const systemFont of systemFonts) {
    const systemMetrics = await getMetricsForFamily(systemFont)
    if (!systemMetrics)
      continue

    css.push(generateFontFace(metrics, {
      name: fallbackName,
      font: systemFont,
      metrics: systemMetrics,
    }))
  }

  return css.join('')
}

/**
 * Check if any font family across all loaders has fallback configured.
 */
export function hasFallbacks(options: Options): boolean {
  if (options.custom) {
    const resolved = resolveUserOption(options.custom)
    if (resolved.families.some(f => f.fallback))
      return true
  }
  if (options.google) {
    for (const family of options.google.families) {
      if (typeof family !== 'string' && family.fallback)
        return true
    }
  }
  if (options.fontsource) {
    for (const family of options.fontsource.families) {
      if (family && typeof family !== 'string' && family.fallback)
        return true
    }
  }
  if (options.typekit?.families) {
    for (const family of options.typekit.families) {
      if (typeof family !== 'string' && family.fallback)
        return true
    }
  }
  return false
}

/**
 * Generate fallback CSS for all font families that have opted in.
 */
const VARIABLE_SUFFIX_RE = /(?: Variable|-variable)$/
const CSS_RE = /\.(?:css|scss|sass|less|styl|stylus|pcss|postcss)(?:\?.*)?$/
export async function generateAllFallbacks(
  options: Options,
  root: string,
): Promise<string> {
  const results: string[] = []

  // Custom fonts — read metrics from font files
  if (options.custom) {
    const resolved = resolveUserOption(options.custom)
    for (const family of resolved.families) {
      if (!family.fallback)
        continue

      const fontFilePath = findRepresentativeFontFile(family, root)
      results.push(
        await generateFallbackForFamily({
          familyName: family.name,
          config: family.fallback,
          fontFilePath,
        }),
      )
    }
  }

  // Google fonts — look up metrics by name
  if (options.google) {
    for (const family of options.google.families) {
      if (typeof family === 'string')
        continue
      if (!family.fallback)
        continue

      results.push(
        await generateFallbackForFamily({
          familyName: family.name,
          config: family.fallback,
        }),
      )
    }
  }

  // Fontsource fonts — look up metrics by name
  if (options.fontsource) {
    for (const family of options.fontsource.families) {
      if (!family)
        continue
      if (typeof family === 'string')
        continue
      if (!family.fallback)
        continue

      const name = family.name
        .replace(VARIABLE_SUFFIX_RE, '')

      results.push(
        await generateFallbackForFamily({
          familyName: name,
          config: family.fallback,
        }),
      )
    }
  }

  // Typekit fonts — look up metrics by name (user must declare families)
  if (options.typekit?.families) {
    for (const family of options.typekit.families) {
      if (typeof family === 'string')
        continue
      if (!family.fallback)
        continue

      results.push(
        await generateFallbackForFamily({
          familyName: family.name,
          config: family.fallback,
        }),
      )
    }
  }

  return results.filter(Boolean).join('')
}

/**
 * Build a map of font family name → fallback name for all fonts
 * that have fallback configured. Used by the transform hook.
 */
export function collectFallbackNames(options: Options): Map<string, string> {
  const map = new Map<string, string>()

  if (options.custom) {
    const resolved = resolveUserOption(options.custom)
    for (const family of resolved.families) {
      if (!family.fallback)
        continue
      map.set(family.name, family.fallback.name ?? generateFallbackName(family.name))
    }
  }

  if (options.google) {
    for (const family of options.google.families) {
      if (typeof family === 'string' || !family.fallback)
        continue
      map.set(family.name, family.fallback.name ?? generateFallbackName(family.name))
    }
  }

  if (options.fontsource) {
    for (const family of options.fontsource.families) {
      if (!family || typeof family === 'string' || !family.fallback)
        continue
      const name = family.name.replace(VARIABLE_SUFFIX_RE, '')
      map.set(name, family.fallback.name ?? generateFallbackName(name))
    }
  }

  if (options.typekit?.families) {
    for (const family of options.typekit.families) {
      if (typeof family === 'string' || !family.fallback)
        continue
      map.set(family.name, family.fallback.name ?? generateFallbackName(family.name))
    }
  }

  return map
}

/**
 * Transform CSS to append fallback font names to font-family declarations.
 * Only modifies declarations that reference a font with fallback configured.
 */
export function transformFontFamilyDeclarations(
  code: string,
  id: string,
  fallbackNames: Map<string, string>,
  sourcemap?: boolean,
): { code: string, map?: any } | undefined {
  if (!CSS_RE.test(id))
    return undefined
  if (fallbackNames.size === 0)
    return undefined

  const s = new MagicString(code)
  const ast = parse(code, { positions: true })

  walk(ast, {
    visit: 'Declaration',
    enter(node) {
      if (node.property !== 'font-family' && node.property !== 'font')
        return
      // Don't modify @font-face declarations
      if (this.atrule && this.atrule.name === 'font-face')
        return
      if (node.value.type !== 'Value')
        return

      for (const child of node.value.children) {
        let family: string | undefined

        if (child.type === 'String') {
          family = child.value.replace(/^['"]|['"]$/g, '')
        }
        else if (child.type === 'Identifier' && child.name !== 'inherit') {
          family = child.name
        }

        if (!family)
          continue

        const fallbackName = fallbackNames.get(family)
        if (!fallbackName)
          continue

        s.appendRight(child.loc!.end.offset, `, "${fallbackName}"`)
      }
    },
  })

  if (!s.hasChanged())
    return undefined

  return {
    code: s.toString(),
    map: sourcemap
      ? s.generateMap({ source: id, includeContent: true })
      : undefined,
  }
}
