<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(3)

const { data } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => 'character-page-3',
  query: computed(() => ({
    page: page.value,
  })),
} as UseApiDataOptions<Info<Character[]>>)
</script>

<template>
  <ExampleApiResponse :response="data" />
</template>
