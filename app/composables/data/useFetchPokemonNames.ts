import type { AsyncDataRequestStatus } from '#app'
import type { PokeAPI } from 'pokeapi-types'
import { itemsPerPage } from '~/constants'

// Fetch Pokemon names from the API for a specific page
export default async (page: Ref<number>): Promise<{
  pokemonNames: ComputedRef<string[]>
  pokemonCount: ComputedRef<number>
  status: Ref<AsyncDataRequestStatus>
}> => {
  const pageIsValid: ComputedRef<boolean> = computed(() => Boolean(page?.value && page.value > 0))
  const offset: ComputedRef<number> = computed(() => (pageIsValid.value ? page.value - 1 : 0) * itemsPerPage)

  // Fetch the Pokémon data
  const { data: pokemonListData, error, status } = await usePokemonData<PokeAPI.NamedAPIResourceList | null>('pokemon', {
    key: () => `pokemon-list-${itemsPerPage}-${offset.value}`,
    query: {
      limit: itemsPerPage,
      offset,
    },
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
    watch: [offset], // Watch for changes in the offset
  })

  // Extract the Pokémon names from the result
  const pokemonNames: ComputedRef<string[]> = computed(() =>
    pokemonListData?.value?.results?.flatMap(pokemon => pokemon.name
      ? [pokemon.name]
      : [])
    ?? [])

  // Extract the Pokémon count from the result
  const pokemonCount: ComputedRef<number> = computed(() => pokemonListData?.value?.count || 0)

  // Handle errors
  watchEffect(() => {
    if (error.value) {
      console.error('Error fetching data in useFetchPokemonNames', error.value)
    }
  })

  // Handle wrong page numbers
  watchEffect(() => {
    // Ensure the page number is valid
    if (!pageIsValid.value) {
      console.error('Invalid page number at useFetchPokemonNames', page.value)
    }
  })

  // Return the names of Pokemon
  return {
    pokemonNames,
    pokemonCount,
    status,
  }
}
