export type TypeKitFonts = {
  id: string
  defer?: boolean
}

const TypekitFontBase = 'https://use.typekit.net/'

function injectFonts({
  id,
  defer = true,
}: TypeKitFonts, html: string): string {
  let links = ''

  if (typeof id !== 'string') {
    console.warn('A Typekit id is required')
    
    return html
  }

  if (defer)
    links += `<link rel="preload" href="${TypekitFontBase}${id}.css" as="style" onload="this.rel='stylesheet'">`
  else
    links += `<link rel="stylesheet" href="${TypekitFontBase}${id}.css" />`

  return html.replace(
    /<head>/,
    `<head>${links}`,
  )
}

export default injectFonts
