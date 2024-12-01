declare module 'unfonts.css' {
  const content: string
  export default content
}

declare module 'unplugin-fonts/head' {
  import type { HtmlTagDescriptor } from 'vite'

  export const links: HtmlTagDescriptor[]
}
