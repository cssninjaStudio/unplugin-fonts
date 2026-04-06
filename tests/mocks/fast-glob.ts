import { vi } from 'vitest'

const fg = {
  sync: vi.fn<() => string[]>(() => []),
}

export default fg
