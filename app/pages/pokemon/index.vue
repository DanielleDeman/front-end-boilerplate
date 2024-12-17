<script setup lang="ts">
import type { PokeAPI } from 'pokeapi-types'
import useFetchPokemonDetails from '~/composables/useFetchPokemonDetails'
import { maxPaginationPages } from '~/constants'
import { usePokemonStore } from '~/store/pokemon'

const { pokemonByName, pokemonByPage } = usePokemonStore()
const currentPage = ref(1)

// The array of pokemon for the current page
const currentPagePokemon: ComputedRef<PokeAPI.Pokemon[]> = computed(() =>
  pokemonByPage.get(currentPage.value) || [])

// Fetch the pokemon for the current page
async function fetchPokemonForPage(): Promise<void> {
  const pagePokemonNames: string[] = await useFetchPokemonNames(currentPage.value)
  await useFetchPokemonDetails(pagePokemonNames, currentPage.value)
}

// Watch for changes in the current page
watch(() => currentPage.value, () => {
  if (!pokemonByPage.has(currentPage.value)) {
    fetchPokemonForPage()
  }
})
</script>

<template>
  <div>
    <h1>Pokemon</h1>
    <UCard v-for="pokemon in currentPagePokemon" :key="`pokemon-card-${pokemon.name}`">
      <template #header>
        <h2>{{ pokemon.name }}</h2>
      </template>
    </UCard>

    <UPagination
      v-model="currentPage"
      :max="maxPaginationPages"
      :total="pokemonByName.size"
      show-last
      show-first
    />
  </div>
</template>
