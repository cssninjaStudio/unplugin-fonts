import type { CustomFonts } from './loaders/custom'
import type { FontsourceFonts } from './loaders/fontsource'
import type { GoogleFonts } from './loaders/google-fonts'
import type { TypeKitFonts } from './loaders/typekit'

export interface Options {
  custom?: CustomFonts
  fontsource?: FontsourceFonts
  google?: GoogleFonts
  typekit?: TypeKitFonts
}
