<script setup lang="ts">
import type { Character } from 'rickmortyapi'
import useFetchRickAndMortyCharacters from '~/composables/data/useFetchRickAndMortyCharacters'
import { maxPaginationPages } from '~/constants'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

const { characterById, charactersByPage } = useRickAndMortyStore()
const currentPage = ref(1)

// The array of character for the current page
const currentPageCharacters: ComputedRef<Character[]> = computed(() =>
  charactersByPage.get(currentPage.value) || [])

// Watch for changes in the current page
watch(() => currentPage.value, async () => {
  if (!charactersByPage.has(currentPage.value)) {
    // Fetch the character for the current page
    await useFetchRickAndMortyCharacters(currentPage.value)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <h1>Rick and Morty</h1>
    <UCard v-for="character in currentPageCharacters" :key="`character-card-${character.id}`">
      <template #header>
        <h2>{{ character.name }}</h2>
      </template>
    </UCard>

    <UPagination
      v-model="currentPage"
      :max="maxPaginationPages"
      :total="characterById.size"
      show-last
      show-first
    />
  </div>
</template>
