import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { LayoutTyping } from '~/types/ui'
import { useLayoutStore } from './layout'

describe('layout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default layout', () => {
    const store = useLayoutStore()
    expect(store.layout).toBe(LayoutTyping.Grid)
  })

  it('updates the layout when a valid layout is provided', () => {
    const store = useLayoutStore()
    store.updateLayout(LayoutTyping.List)
    expect(store.layout).toBe(LayoutTyping.List)
  })

  it('does not update the layout when an invalid layout is provided', () => {
    const store = useLayoutStore()
    store.updateLayout('InvalidLayout' as LayoutTyping)
    expect(store.layout).toBe(LayoutTyping.Grid)
  })
})
