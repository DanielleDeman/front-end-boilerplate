import type { AsyncDataRequestStatus } from '#app'
import type { Character, Info } from 'rickmortyapi'
import { validPageQueryParam } from '~/helpers/pageNumber'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Fetch Rick and Morty Characters from the API for a specific page
export default async (id: string): Promise<{
  status: Ref<AsyncDataRequestStatus>
}> => {
  const rickAndMortyStore = useRickAndMortyStore()

  // Fetch the Character data
  const { data, error, status } = await useRickAndMortyData<Character>(`/character/${id}`, {
    key: () => `character-${id}`,
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
        || (rickAndMortyStore.characterById.get(Number(id)) ?? undefined) // Check if the Character is already in the store
    },
  })

  watch(data, () => {
    if (data?.value) {
      // Add the Character to the store
      rickAndMortyStore.addCharacter(data.value)
    }
  }, { immediate: true })

  watchEffect(() => {
    // Handle character not found
    if (error.value || !data?.value?.id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Character Not Found',
      })
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
  const rickAndMortyStore = useRickAndMortyStore()
  const page: ComputedRef<number> = computed(() => validPageQueryParam(route.query.page as string))

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
        || (rickAndMortyStore.charactersByPage.get(page.value) ?? undefined) // Check if the Characters are already in the store
    },
  })

  watch(data, () => {
    console.log('inside watcher result')
    if (data?.value?.results) {
      console.log('result', data.value.results[0]?.name, page.value)
      // Add the Pokémon to the store
      rickAndMortyStore.addCharacterList(data.value.results, page.value)
    }
    if (data?.value?.info?.count) {
      // Update the total number of Characters
      rickAndMortyStore.updateTotalCharacters(data.value.info.count)
    }
  }, { immediate: true })

  watchEffect(() => {
    // Handle character not found
    if (error.value || !data?.value?.results?.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Character Page Not Found',
      })
    }
  })

  return {
    status,
  }
}
