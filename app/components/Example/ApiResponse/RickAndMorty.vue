<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(3)
// const query = ref({
//   page: page.value,
// })

const { data } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => `character-page-${page.value}`,
  query: {
    page,
  },
} as UseApiDataOptions<Info<Character[]>>)

watch(data, () => {
  console.log('rm data', data?.value?.results?.[0]?.name)
}, { immediate: true })
</script>

<template>
  <div>
    <ExampleApiResponse :response="data" />
    <UButton
      color="blue"
      size="xl"
      @click="page = page + 1"
    >
      next
    </UButton>
  </div>
</template>
