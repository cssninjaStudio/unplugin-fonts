import type { GoogleFonts } from './loaders/google-fonts'
import type { TypeKitFonts } from './loaders/typekit'
import type { CustomFonts } from './loaders/custom'

export interface Options {
  google?: GoogleFonts
  typekit?: TypeKitFonts
  custom?: CustomFonts
}
