import type { AsyncDataRequestStatus } from '#app'
import type { PokeAPI } from 'pokeapi-types'
import { itemsPerPage } from '~/constants'
import { usePokemonStore } from '~/store/pokemon'

// Fetch Pokemon names from the API for a specific page
export default async (): Promise<{
  pokemonNames: Ref<string[]>
  status: Ref<AsyncDataRequestStatus>
}> => {
  const pokemonStore = usePokemonStore()
  const route = useRoute()
  const page: ComputedRef<number> = computed(() => Number.isNaN(Number(route.query.page)) ? 1 : Number(route.query.page) || 1)
  const pageIsValid: ComputedRef<boolean> = computed(() => Boolean(page.value && page.value > 0))
  const offset: ComputedRef<number> = computed(() => (pageIsValid.value ? page.value - 1 : 0) * itemsPerPage)
  const pokemonNames: Ref<string[]> = ref([])

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
  })

  watchEffect(() => {
    if (pokemonListData?.value?.count) {
      // Update the total number of Pokémon
      pokemonStore.updateTotalPokemon(pokemonListData.value.count)
    }
    if (pokemonListData?.value?.results) {
      // Extract the Pokémon names from the result
      pokemonNames.value = pokemonListData.value.results.flatMap(pokemon => pokemon.name
        ? [pokemon.name]
        : [])
    }
  })

  watchEffect(() => {
    // Handle Pokémon not found
    if (error.value || !pokemonListData?.value?.results?.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pokémon Page Not Found',
      })
    }
  })

  // Return the names of Pokemon
  return {
    pokemonNames,
    status,
  }
}
