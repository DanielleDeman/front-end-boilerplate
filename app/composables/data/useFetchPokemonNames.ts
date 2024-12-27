import type { AsyncDataRequestStatus } from '#app'
import type { PokeAPI } from 'pokeapi-types'
import { itemsPerPage } from '~/constants'
import { usePokemonStore } from '~/store/pokemon'

// Fetch Pokemon names from the API for a specific page
export default async (page: Ref<number>): Promise<{
  pokemonNames: ComputedRef<string[]>
  status: Ref<AsyncDataRequestStatus>
}> => {
  const { updateTotalPokemon } = usePokemonStore()
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
  }).then((result) => {
    // Extract the Pokémon count from the result
    if (result?.data?.value?.count) {
      updateTotalPokemon(result.data.value.count)
    }
    return result
  })

  // Extract the Pokémon names from the result
  const pokemonNames: ComputedRef<string[]> = computed(() =>
    pokemonListData?.value?.results?.flatMap(pokemon => pokemon.name
      ? [pokemon.name]
      : [])
    ?? [])

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
    status,
  }
}
