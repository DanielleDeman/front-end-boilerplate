<script setup lang="ts">
withDefaults(defineProps<{
  items: any[]
  layoutIndex?: string // The layoutIndex is used to generate unique keys when there are multiple instances of the same layout
}>(), {
  items: () => [],
  layoutIndex: 'default',
})
</script>

<template>
  <ul v-if="items?.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <li v-for="(item, index) in items" :key="`grid-item-${layoutIndex}-${index}`">
      <slot :item="item" />
    </li>
  </ul>
</template>
