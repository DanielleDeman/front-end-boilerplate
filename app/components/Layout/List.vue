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
  <ul v-if="items?.length" class="space-y-4">
    <li v-for="(item, index) in items" :key="`list-item-${layoutIndex}-${index}`">
      <slot :item="item" />
    </li>
  </ul>
</template>
