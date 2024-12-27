<script setup lang="ts">
import { useLayoutStore } from '~/store/layout'

import { LayoutTyping } from '~/types/ui'

// Stores
const { layout, updateLayout } = useLayoutStore()
</script>

<template>
  <nav class="flex space-x-3">
    <button :class="{ active: layout === LayoutTyping.Grid }" @click="updateLayout(LayoutTyping.Grid)">
      <UIcon name="icon-park-solid:all-application" class="w-5 h-5" />
    </button>
    <button :class="{ active: layout === LayoutTyping.List }" @click="updateLayout(LayoutTyping.List)">
      <UIcon name="icon-park-solid:activity-source" class="w-5 h-5" />
    </button>
  </nav>
</template>
