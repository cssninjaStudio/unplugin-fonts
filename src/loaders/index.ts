import type { HtmlTagDescriptor } from 'vite'
import type { Options } from '../types'
import { customLoader } from './custom'
import { typekitLoader } from './typekit'
import { googleLoader } from './google-fonts'

export function getHeadLinkTags(resolvedOptions: Options, root: string) {
  const tags: HtmlTagDescriptor[] = []

  if (resolvedOptions.typekit)
    tags.push(...typekitLoader(resolvedOptions.typekit))

  if (resolvedOptions.google)
    tags.push(...googleLoader(resolvedOptions.google))

  if (resolvedOptions.custom)
    tags.push(...customLoader(resolvedOptions.custom, root))

  return tags
}
