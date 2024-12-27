import type { AsyncDataRequestStatus } from '#app'
import type { Character, Info } from 'rickmortyapi'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Fetch Rick and Morty Characters from the API for a specific page
export default async (id: string): Promise<{
  status: Ref<AsyncDataRequestStatus>
}> => {
  const { addCharacter, characterById } = useRickAndMortyStore()

  // Fetch the Character data
  const { error, status } = await useRickAndMortyData<Character>(`/character/${id}`, {
    key: () => `character-${id}`,
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
        || (characterById.get(Number(id)) ?? undefined) // Check if the Character is already in the store
    },
  }).then((result) => {
    if (result?.data?.value) {
      // Add the Character to the store
      addCharacter(result.data.value)
    }
    return result
  })

  // Handle errors
  watchEffect(() => {
    if (error.value) {
      console.error('Error fetching data in useFetchRMCharacter', error.value)
    }
  })

  return {
    status,
  }
}

// Fetch Rick and Morty Character from the API with a specific id
export async function useFetchRMCharactersByPage(): Promise<{
  status: Ref<AsyncDataRequestStatus>
}> {
  const route = useRoute()
  const { addCharacterList, updateTotalCharacters, charactersByPage } = useRickAndMortyStore()
  const page: ComputedRef<number> = computed(() => Number(route.query.page) || 1)

  // Fetch the Pokémon data
  const { data, error, status } = await useRickAndMortyData<Info<Character[]>>('character', {
    key: () => `character-page-${page.value}`,
    query: {
      page,
    },
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
        || (charactersByPage.get(page.value) ?? undefined) // Check if the Characters are already in the store
    },
  }).then((result) => {
    if (result?.data?.value?.info?.count) {
      // Update the total number of Characters
      updateTotalCharacters(result.data.value.info.count)
    }
    return result
  })

  watchEffect(() => {
    if (data?.value?.results) {
      // Add the Pokémon to the store
      addCharacterList(data.value.results, page.value)
    }
  })

  // Handle errors
  watchEffect(() => {
    if (error.value) {
      console.error('Error fetching data in useFetchRMCharactersByPage', error.value)
    }
  })

  return {
    status,
  }
}
