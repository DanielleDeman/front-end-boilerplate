<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <main class="min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
    <ApplicationHeader />

    <div>
      <UContainer>
        <h2 class="text-3xl my-12">
          <template v-if="error">
            {{ error?.statusCode }}: {{ error.message }}
          </template>
          <template v-else>
            An error occurred
          </template>
        </h2>
        <UButton
          color="blue"
          size="xl"
          @click="handleError"
        >
          Go to home page
        </UButton>
      </UContainer>
    </div>
  </main>
</template>
