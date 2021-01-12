
import type { Plugin, HtmlTagDescriptor } from 'vite'
import injectGoogleFonts, { GoogleFonts } from './google-fonts'
import injectTypekitFonts, { TypeKitFonts } from './typekit'

type VitePluginFontsOptions = {
  google?: GoogleFonts
  typekit?: TypeKitFonts
}

function VitePluginFonts(options: VitePluginFontsOptions = {}) {
  return {
    name: 'vite-plugin-fonts',

    transformIndexHtml(): HtmlTagDescriptor[] {
      const tags: HtmlTagDescriptor[] = []

      if (options.typekit)
        tags.push(...injectTypekitFonts(options.typekit))

      if (options.google)
        tags.push(...injectGoogleFonts(options.google))

      return tags
    },
  }
}

export {
  VitePluginFonts as Plugin,
  VitePluginFontsOptions,
}
export default VitePluginFonts
