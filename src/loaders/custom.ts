import type { HtmlTagDescriptor } from 'vite'
import { sync as glob } from 'fast-glob'
import { resolve, join, relative } from 'pathe'

interface CustomFontFace {
  src: string[]
  name: string
  weight: number | string
  style: string
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  local?: string | string[]
}

export interface CustomFontFamily {
  /**
   * Name of the font family.
   * @example 'Comic Sans MS'
   */
  name: string
  /**
   * Regex(es) of font files to import. The names of the files will
   * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
   *
   * @example
   * A value of `./RobotoBoldItalic.*` will create this `@font-rule`:
   *
   * ```css
   * font-face {
   *    font-family: 'Roboto';
   *    src: url(./RobotoBoldItalic.ttf) format('truetype')
   *         url(./RobotoBoldItalic.woff) format('woff')
   *         url(./RobotoBoldItalic.woff2) format('woff2');
   *    font-weight: bold;
   *    font-style: italic;
   *    font-display: auto;
   * }
   * ```
   */
  src: string | string[]
  /**
   * Local name of the font. Used to add `src: local()` to `@font-rule`.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face#description
   */
  local?: string | string[]
}

export interface CustomFonts {
  /**
   * Font families.
   */
  families: CustomFontFamily[] | Record<string, string | string[] | Omit<CustomFontFamily, 'name'>>
  /**
   * Defines the default `font-display` value used for the generated
   * `@font-rule` classes.
   * @see https://developer.mozilla.org/fr/docs/Web/CSS/@font-face/font-display
   * @default 'auto'
   */
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  /**
   * Using `<link rel="preload">` will trigger a request for the WebFont
   * early in the critical rendering path, without having to wait for the
   * CSSOM to be created.
   * @see https://web.dev/optimize-webfont-loading/#preload-your-webfont-resources
   * @default true
   */
  preload?: boolean

  /**
   * Using `<link rel="prefetch">` is intended for prefetching resources
   * that will be used in the next navigation/page load
   * (e.g. when you go to the next page)
   *
   * Note: this can not be used with `preload`
   * @default false
   */
  prefetch?: boolean
  /**
   * @default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'

  /**
   * Remove the prefix from the front path
   * @default: 'public/'
   */
  stripPrefix?: string
}

const resolveWeight = (weightOrSrc?: string | number) => {
  if (typeof weightOrSrc === 'number')
    return weightOrSrc
  if (!weightOrSrc)
    return 400
  weightOrSrc = weightOrSrc.toLowerCase()
  if (weightOrSrc.includes('thin'))
    return 100
  if (weightOrSrc.includes('extralight'))
    return 200
  if (weightOrSrc.includes('ultralight'))
    return 200
  if (weightOrSrc.includes('light'))
    return 300
  if (weightOrSrc.includes('normal'))
    return 400
  if (weightOrSrc.includes('medium'))
    return 500
  if (weightOrSrc.includes('semibold'))
    return 600
  if (weightOrSrc.includes('demibold'))
    return 600
  if (weightOrSrc.includes('extrabold'))
    return 800
  if (weightOrSrc.includes('ultrabold'))
    return 800
  if (weightOrSrc.includes('bold'))
    return 700
  if (weightOrSrc.includes('black'))
    return 900
  if (weightOrSrc.includes('heavy'))
    return 900
  return 400
}

const resolveStyle = (styleOrSrc?: string) => {
  if (!styleOrSrc)
    return 'normal'
  styleOrSrc = styleOrSrc.toLowerCase()
  if (styleOrSrc.includes('normal'))
    return 'normal'
  if (styleOrSrc.includes('italic'))
    return 'italic'
  if (styleOrSrc.includes('oblique'))
    return 'oblique'
  return 'normal'
}

const createFontFaceCSS = ({ name, src, local, weight, style, display }: CustomFontFace) => {
  // --- Format sources.
  const srcs = (Array.isArray(src) ? src : [src])
    .filter(Boolean)
    .map((url) => {
      let format = url.split('.').pop()
      if (format === 'ttf')
        format = 'truetype'
      if (format === 'otf')
        format = 'opentype'
      return `url('${join('/', url)}') format('${format}')`
    })
    .join(',\n\t\t')

  // --- Format local.
  const locals = (Array.isArray(local) ? local : [local])
    .filter(Boolean)
    .map(x => `local('${x}')`)
    .join(', ')

  // --- Return CSS rule as string.
  return `@font-face {
  font-family: '${name}';
  src: ${[srcs, locals].filter(Boolean).join(',')};
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
}`
}

const createFontFaceLink = (
  prefetch = false,
  injectTo: 'head' | 'body' | 'head-prepend' | 'body-prepend' = 'head-prepend',
) => (href: string) => {
  return {
    tag: 'link',
    injectTo,
    attrs: {
      rel: prefetch ? 'prefetch' : 'preload',
      as: 'font',
      type: `font/${href.split('.').pop()}`,
      href,
      crossorigin: true,
    },
  }
}

function resolveFontfaceFiles({ src, root }: { 
  src: string | string[] 
  root: string
}) {
  const facesGrouped: Record<string, string[]> = {};

  (Array.isArray(src) ? src : [src])
      .flatMap(x => {
        return glob(join(root, x), { absolute: true, cwd: root, onlyFiles: true })
      })
      .filter(Boolean)
      .forEach((src) => {
        const srcNoExt = src.match(/(.*)\.(\w|\d)+$/)?.[1].toLowerCase()
        if (srcNoExt)
          facesGrouped[srcNoExt] = (facesGrouped[srcNoExt] ?? []).concat(src)
      })

  return Object.entries(facesGrouped).map(([srcNoExt, src]) => ({
    srcNoExt, src
  }))
}

export function customVirtualModule(options: CustomFonts, root: string) {
  const css: string[] = []

  /* eslint-disable prefer-const */
  let {
    families = [],
    display = 'auto',
    stripPrefix = 'public/',
  } = options
  /* eslint-enable prefer-const */

  // --- Cast as array of `CustomFontFamily`.
  if (!Array.isArray(families)) {
    families = Object.entries(families)
      .map(([name, family]) => (Array.isArray(family) || typeof family === 'string')
        ? { name, src: family }
        : { name, ...family },
      )
  }

  for (const { name, src, local } of families) {
    const faces = resolveFontfaceFiles({ src, root })
      .map((item) => ({
        name,
        src: item.src.map(x => relative(root, x.replace(stripPrefix, ''))),
        weight: resolveWeight(item.srcNoExt),
        style: resolveStyle(item.srcNoExt),
        display,
        local,
      }))
    // --- Generate CSS `@font-face` rules.
    for (const face of faces) css.push(createFontFaceCSS(face))
  }

  return css.join('\n\n')
}

export function customLoader(options: CustomFonts, root: string) {
  const tags: HtmlTagDescriptor[] = []
  // const css: string[] = []

  // --- Extract and defaults plugin options.
  /* eslint-disable prefer-const */
  let {
    families = [],
    preload = true,
    prefetch = false,
    injectTo = 'head-prepend',
    stripPrefix = 'public/',
  } = options
  /* eslint-enable prefer-const */

  // --- Cast as array of `CustomFontFamily`.
  if (!Array.isArray(families)) {
    families = Object.entries(families)
      .map(([name, family]) => (Array.isArray(family) || typeof family === 'string')
        ? { name, src: family }
        : { name, ...family },
      )
  }

  // --- Iterate over font families and their faces.
  for (const { src } of families) {
    const faces = resolveFontfaceFiles({ src, root })

    const hrefs = faces
      .flatMap(face => face.src)
      .map(src => relative(root, src.replace(stripPrefix, '')))

    // --- Generate `<link>` tags.
    // --- We can not do a prefetch and a preload for the same files.
    if (preload && prefetch) {
      console.warn('vite-plugin-fonts: Prefetch and a Preload options can not be used together.')
      console.warn('vite-plugin-fonts: The prefetch stand for a lower priority for the resource (maybe we will need it in a future page) whereas preload is for the current page, so we can not have both.')
    }
    if (preload || prefetch)
      tags.push(...hrefs.map(createFontFaceLink(prefetch, injectTo)))

    // // --- Generate CSS `@font-face` rules.
    // for (const face of faces) css.push(createFontFaceCSS(face))
  }

  // --- Return tags and CSS.
  return tags
}

