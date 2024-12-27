<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'

defineProps<{
  status: AsyncDataRequestStatus
}>()
</script>

<template>
    <template v-if="status === 'idle'">
        <p>Api not responding</p>
      </template>
      <template v-if="status === 'pending'">
        <ApplicationLoader />
      </template>
      <template v-else-if="status === 'error'">
        <p>Error fetching pokemon</p>
      </template>
</template>