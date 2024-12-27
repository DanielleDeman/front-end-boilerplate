import { LayoutTyping } from '~/types/ui'

export const useLayoutStore = defineStore('layout', {
  state: (): {
    layout: LayoutTyping
  } => ({
    layout: LayoutTyping.Grid,
  }),
  actions: {
    updateLayout(layout: LayoutTyping) {
      // Check if the layout is a valid layout
      if (layout && Object.values(LayoutTyping).includes(layout)) {
        this.layout = layout
      }
    },
  },
})
