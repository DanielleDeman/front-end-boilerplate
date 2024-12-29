import type { AsyncDataRequestStatus } from '#app'
import type { Character, Info } from 'rickmortyapi'
import { validPageQueryParam } from '~/helpers/pageNumber'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Fetch Rick and Morty Characters from the API for a specific page
export default async (): Promise<{
  id: ComputedRef<string>
  status: Ref<AsyncDataRequestStatus>
}> => {
  const rickAndMortyStore = useRickAndMortyStore()
  // Route composable to get the current route
  const route = useRoute()
  const id: ComputedRef<string> = computed(() => (route.params as { id: string }).id)

  // Fetch the Character data
  const { data, error, status } = await useRickAndMortyData<Character>(`/character/${id.value}`, {
    key: () => `character-${id.value}`,
    client: true,
    getCachedData(key, nuxtApp) {
      // Use cached data if available
      return nuxtApp.payload.data[key]
        || nuxtApp.static.data[key]
        || (rickAndMortyStore.characterById.get(Number(id.value)) ?? undefined) // Check if the Character is already in the store
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
    id,
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
    if (data?.value?.results) {
      // Add the Character to the store
      rickAndMortyStore.addCharacterList(data.value.results, page.value)
    }
    if (data?.value?.info?.count) {
      // Update the total number of Characters
      rickAndMortyStore.updateTotalCharacters(data.value.info.count)
    }
  }, { immediate: true })

  watchEffect(() => {
    // Handle Characters not found
    if (error?.value || (data?.value?.results && !data.value.results.length)) {
      console.error(`Character Page Not Found ${page.value}, ${data?.value?.results?.length}`, error?.value)
      //   throw createError({
      //     statusCode: 404,
      //     statusMessage: result?.error?.value?.message ?? `Character Page Not Found ${page.value}, ${result?.data?.value?.results?.length}`,
      //   })
    }
  })

  return {
    status,
  }
}
