
import type { Plugin } from 'vite'
import injectGoogleFonts, { GoogleFonts } from './google-fonts'
import injectTypekitFonts, { TypeKitFonts } from './typekit'

type VitePluginFontsOptions = {
  google?: GoogleFonts
  typekit?: TypeKitFonts
}

function VitePluginFonts(options: VitePluginFontsOptions = {}) {
  return {
    name: 'vite-plugin-fonts',

    transformIndexHtml(html: string) {
      let transformedHtml = html

      if (options.typekit)
        transformedHtml = injectTypekitFonts(options.typekit, transformedHtml)

      if (options.google)
        transformedHtml = injectGoogleFonts(options.google, transformedHtml)

      return transformedHtml
    },
  }
}

export {
  VitePluginFonts as Plugin,
  VitePluginFontsOptions,
}
export default VitePluginFonts
