<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const { data } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => 'character-page-1',
  query: {
    page: 1,
  },
} as UseApiDataOptions<Info<Character[]>>)
</script>

<template>
  <ExampleApiResponse :response="data" />
</template>
