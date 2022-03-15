import { HtmlTagDescriptor, ResolvedConfig } from 'vite'
import { sync as glob } from 'glob'
import { chain as _ } from 'lodash'

type CustomFontFace = {
  src: string[]
  name?: string
  weight?: number | string
  style?: string
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  local?: string | string[]
}

export type CustomFontFamily = {
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

export type CustomFonts = {
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
}

const resolveWeight = (weightOrSrc?: string | number) => {
  if (typeof weightOrSrc === 'number') return weightOrSrc
  if (!weightOrSrc) return 400
  weightOrSrc = weightOrSrc.toLowerCase()
  if (weightOrSrc.includes('thin')) return 100
  if (weightOrSrc.includes('extralight')) return 200
  if (weightOrSrc.includes('ultralight')) return 200
  if (weightOrSrc.includes('light')) return 300
  if (weightOrSrc.includes('normal')) return 400
  if (weightOrSrc.includes('medium')) return 500
  if (weightOrSrc.includes('semibold')) return 600
  if (weightOrSrc.includes('demibold')) return 600
  if (weightOrSrc.includes('bold')) return 700
  if (weightOrSrc.includes('extrabold')) return 800
  if (weightOrSrc.includes('ultrabold')) return 800
  if (weightOrSrc.includes('black')) return 900
  if (weightOrSrc.includes('heavy')) return 900
  return 400
}

const resolveStyle = (styleOrSrc?: string) => {
  if (!styleOrSrc) return 'normal'
  styleOrSrc = styleOrSrc.toLowerCase()
  if (styleOrSrc.includes('normal')) return 'normal'
  if (styleOrSrc.includes('italic')) return 'italic'
  if (styleOrSrc.includes('oblique')) return 'oblique'
  return 'normal'
}

const createFontFaceCSS = (options: CustomFontFace) => {
  // --- Format sources.
  const srcs = _(options.src)
    .castArray()
    .filter(Boolean)
    .map((url) => {
      let format = url.split('.').pop()
      if (format === 'ttf') format = 'truetype'
      return `url('${url}') format('${format}')`
    })
    .join(',\n\t\t')
    .value()

  // --- Format local.
  const local = _(options.local)
    .castArray()
    .filter(Boolean)
    .map(x => `local('${x}')`)
    .join(', ')
    .value()

  // --- Merge local and sources.
  const src = [srcs, local].filter(Boolean).join(', ')

  // --- Return CSS rule as string.
  return `@font-face {
  font-family: '${options.name}';
  src: ${src};
  font-weight: ${resolveWeight(options.weight || srcs)};
  font-style: ${resolveStyle(options.style ?? srcs)};
  font-display: ${options.display ?? 'auto'};
}`
}

const createFontFaceLink = (href: string) => {
  return {
    tag: 'link',
    attrs: {
      rel: 'preload',
      as: 'font',
      type: `font/${href.split('.').pop()}`,
      href,
      crossorigin: true,
    },
  }
}

export default (options: CustomFonts, config: ResolvedConfig) => {
  const tags: HtmlTagDescriptor[] = []
  const css: string[] = []

  // --- Extract and defaults plugin options.
  let {
    families = [],
    // eslint-disable-next-line prefer-const
    display = 'auto',
    // eslint-disable-next-line prefer-const
    preload = true,
  } = options

  // --- Cast as array of `CustomFontFamily`.
  if (!Array.isArray(families)) {
    families = _(families)
      .map((family, name) => (Array.isArray(family) || typeof family === 'string')
        ? { name, src: family }
        : { name, ...family },
      )
      .value()
  }

  // --- Iterate over font families and their faces.
  for (const { name, src, local } of families) {
    // --- Resolve glob(s) and group faces with the same name.
    const faces = _(src)
      .castArray()
      .map(x => glob(x, { nodir: true, root: config.root, absolute: true }))
      .flatten()
      .groupBy(x => x.match(/(.*)\.(\w|\d)+$/)?.[1].toLowerCase())
      .filter(Boolean)
      .map(src => ({
        name,
        src,
        weight: resolveWeight(src[0]),
        style: resolveStyle(src[0]),
        display,
        local,
      }))
      .value()

    const hrefs = _(faces)
      .flatMap(face => face.src)
      .map(src => src.replace(config.root, '.'))
      .value()

    // --- Generate `<link>` tags.
    if (preload) tags.push(...hrefs.map(createFontFaceLink))

    // --- Generate CSS `@font-face` rules.
    for (const face of faces) css.push(createFontFaceCSS(face))
  }

  // --- Return tags and CSS.
  return {
    tags,
    css: css.join('\n\n'),
  }
}
