import type { AsyncDataRequestStatus } from '#app'
import type { PokeAPI } from 'pokeapi-types'
import { usePokemonStore } from '~/store/pokemon'

// Fetch details for multiple Pokémon from the API
export default async (pokemonNames: ComputedRef<string[]>, page?: Ref<number>): Promise<{
  status: Ref<AsyncDataRequestStatus>
  refresh: () => Promise<void>
}> => {
  const { addPokemonList, hasPokemonWithName } = usePokemonStore()

  // If there are any Pokémon that we do not already have in the store, fetch their details and add them to the store
  const fetchPromises: ComputedRef<Promise<PokeAPI.Pokemon | undefined>[]> = computed(() =>
    pokemonNames?.value?.flatMap(name => Boolean(name) && !hasPokemonWithName(name)
      ? [$pokemon<PokeAPI.Pokemon>(`pokemon/${name}`)]
      : [],
    ) ?? [])

  // Convert the Pokémon names to a string for use in the cache key
  const namesToString: ComputedRef<string> = computed(() => pokemonNames.value.join('-'))

  // Fetch multiple endpoints at once with useAsyncData
  const { status, refresh } = await useAsyncData(`pokemonFetch-${namesToString.value}`, async () =>
    await Promise.all(fetchPromises.value)
      .then((results: (PokeAPI.Pokemon | undefined)[]) => {
        // Filter out any undefined results
        const newPokemon: PokeAPI.Pokemon[] = results.filter(result => result !== undefined)
        // Add the Pokémon to the store
        addPokemonList(newPokemon, pokemonNames.value, page?.value)
        return newPokemon
      })
      .catch((error) => {
        console.error('Error fetching Pokémon in useFetchPokemonDetails', error)
        return []
      }), {
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
    watch: [namesToString], // Watch for changes in the Pokémon names
  })

  // Handle errors
  watchEffect(() => {
    // Ensure the page number is valid, if there is one
    if (page?.value && page.value <= 0) {
      console.error('Invalid page number in useFetchPokemonDetails', page.value)
    }
  })

  return {
    status,
    refresh,
  }
}

// Fetch details for a single Pokémon from the API
export async function useFetchPokemonDetailSingle(pokemonName: string): Promise<{
  status: Ref<AsyncDataRequestStatus>
}> {
  const { addPokemon } = usePokemonStore()

  // Fetch the Pokémon data
  const { error, status } = await usePokemonData<PokeAPI.Pokemon>(`pokemon/${pokemonName}`, {
    key: () => `pokemon-${pokemonName}`,
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  }).then((result) => {
    if (result?.data?.value) {
      // Add the Pokémon to the store
      addPokemon(result.data.value)
    }
    return result
  })

  // Handle errors
  watchEffect(() => {
    if (error.value) {
      console.error('Error fetching data in useFetchPokemonDetailSingle', error.value)
    }
  })

  return {
    status,
  }
}
