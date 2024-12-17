<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

const props = defineProps<{
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
  label: string
}>()
</script>

<template>
  <UButton :to="props.to" :label="props.label" variant="ghost" color="gray" />
</template>
