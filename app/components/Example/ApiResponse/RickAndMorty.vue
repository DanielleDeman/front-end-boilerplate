<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(4)

const { data, error } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => `character-page-${page.value}`,
  query: {
    page,
  },
} as UseApiDataOptions<Info<Character[]>>)

watch(data, () => {
  console.log('rm data', page.value, data?.value?.results?.length, data?.value?.results?.[0]?.name, error?.value)
}, { immediate: true })
</script>

<template>
  <div>
    <ExampleApiResponse :response="data" />
    <UButton
      color="yellow"
      size="xl"
      @click="page = page + 1"
    >
      next
    </UButton>
  </div>
</template>
