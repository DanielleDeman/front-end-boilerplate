<script setup lang="ts">
import type { UseApiDataOptions } from '#build/module/nuxt-api-party'
import type { Character, Info } from 'rickmortyapi'

const page = ref(4)
const query = computed(() => ({
  page: page.value,
}))

const { data, error } = await useRickAndMortyData<Info<Character[]>>('character', {
  key: () => `character-page-${page.value}`,
  query,
} as UseApiDataOptions<Info<Character[]>>)

const { data: otherData, error: otherError } = await useRickAndMortyData<Info<Character[]>>(`character?page=${page.value}`, {
  key: () => `character-page-other-${page.value}`,
} as UseApiDataOptions<Info<Character[]>>)

watch(data, () => {
  console.log('rm data', page.value, query.value, data?.value?.results?.length, data?.value?.results?.[0]?.name, error?.value)
}, { immediate: true })

watch(otherData, () => {
  console.log('rm otherdata', page.value, otherData?.value?.results?.length, otherData?.value?.results?.[0]?.name, otherError?.value)
}, { immediate: true })
</script>

<template>
  <div>
    <ExampleApiResponse :response="data" />
    <ExampleApiResponse :response="otherData" />
    <UButton
      color="red"
      size="xl"
      @click="page = page + 1"
    >
      next
    </UButton>
  </div>
</template>
