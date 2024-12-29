<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(3)
// const query = ref({
//   page: page.value,
// })

const { data, error } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => `character-page-${page.value}`,
  query: computed(() => ({
    page: page.value,
  })),
} as UseApiDataOptions<Info<Character[]>>)

watch(data, () => {
  console.log('rm data', data?.value?.results?.length, data?.value?.results?.[0]?.name, error?.value)
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
