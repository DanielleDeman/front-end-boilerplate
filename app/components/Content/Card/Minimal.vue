<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink :to="to">
    <UCard :ui="{ body: { padding: 'px-2 py-2 sm:p-3' } }">
      <div class="flex space-x-4 items-center justify-stretch">
        <div class="w-16 grow-0">
          <slot v-if="$slots.image" name="image" />
        </div>
        <div class="grow">
          <slot v-if="$slots.title" name="title" />
        </div>
        <div class="grow-0">
          <slot v-if="$slots.content" name="content" />
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
