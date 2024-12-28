<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink :to="to" class="hover:opacity-50">
    <UCard>
      <template #header>
        <slot v-if="$slots.title" name="title" />
      </template>
      <div class="h-36 flex items-center justify-center">
        <slot v-if="$slots.image" name="image" />
      </div>
      <template #footer>
        <slot v-if="$slots.content" name="content" />
      </template>
    </UCard>
  </NuxtLink>
</template>
