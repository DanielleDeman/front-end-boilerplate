import type { AsyncDataRequestStatus } from '#app'
import type { PokeAPI } from 'pokeapi-types'
import { validPageQueryParam } from '~/helpers/pageNumber'
import { usePokemonStore } from '~/store/pokemon'

// Fetch details for a single Pokémon from the API
export async function useFetchPokemon(): Promise<{
  pokemonName: ComputedRef<string>
  status: Ref<AsyncDataRequestStatus>
}> {
  const route = useRoute()
  const pokemonStore = usePokemonStore()

  const pokemonName = computed(() => (route.params as { name: string }).name)

  // Fetch the Pokémon data
  const { data, status } = await usePokemonData<PokeAPI.Pokemon>(`pokemon/${pokemonName.value}`, {
    key: () => `pokemon-${pokemonName.value}`,
    client: true,
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
        || (pokemonStore.pokemonByName.get(pokemonName.value) ?? undefined) // Check if the Pokémon is already in the store
    },
  })

  watch(data, () => {
    // Handle Pokémon not found
    if (!data?.value?.name) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pokémon Not Found',
      })
    }
    else if (data?.value) {
      // Add the Pokémon to the store
      pokemonStore.addPokemon(data.value)
    }
  }, { immediate: true })

  return {
    pokemonName,
    status,
  }
}

// Fetch details for multiple Pokémon from the API
export async function useFetchPokemonList(pokemonNames: Ref<string[]>): Promise<{
  status: Ref<AsyncDataRequestStatus>
  refresh: () => Promise<void>
}> {
  const route = useRoute()
  const pokemonStore = usePokemonStore()
  const page: ComputedRef<number> = computed(() => validPageQueryParam(route.query.page as string))

  // If there are any Pokémon that we do not already have in the store, fetch their details and add them to the store
  const fetchPromises: ComputedRef<Promise<PokeAPI.Pokemon | undefined>[]> = computed(() =>
    pokemonNames?.value?.flatMap(name => Boolean(name) && !pokemonStore.hasPokemonWithName(name)
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
        pokemonStore.addPokemonList(newPokemon, pokemonNames.value, page.value)
        return newPokemon
      })
      .catch((error) => {
        console.error('Error fetching Pokémon in useFetchPokemonDetails', error)
        return []
      }), {
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
    },
    watch: [namesToString], // Watch for changes in the Pokémon names
  }).then((result) => {
    // Handle Pokémon error
    if (result?.error?.value) {
      console.error('Error fetching Pokémon in useFetchPokemonDetails', result.error.value)
    }
    return result
  })

  return {
    status,
    refresh,
  }
}
