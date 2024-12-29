<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(4)

const { data } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => `character-page-${page.value}`,
  query: {
    page,
  },
  client: true,
} as UseApiDataOptions<Info<Character[]>>)
</script>

<template>
  <div>
    <ExampleApiResponse :response="data" />
  </div>
</template>
