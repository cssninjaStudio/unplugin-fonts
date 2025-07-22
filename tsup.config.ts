import type { Options } from 'tsup'

export default <Options>{
  entry: [
    'src/*.ts',
    'src/astro/component.astro',
  ],
  loader: {
    '.astro': 'copy',
  },
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:fix',
  external: ['@nuxt/schema', '@nuxt/kit'],
}
