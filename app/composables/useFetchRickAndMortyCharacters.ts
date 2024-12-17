import type { Character, Info } from 'rickmortyapi'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Fetch Rick and Morty Characters from the API for a specific page
export default async (page: number): Promise<void> => {
  const { addCharacterList, hasPage } = useRickAndMortyStore()

  // Ensure the page number is valid
  if (page < 1) {
    console.error('Invalid page number at useFetchPokemonNames', page)
    return
  }

  // If page has not previously been fetched, fetch the data
  if (!hasPage(page)) {
    const { data: rickAndMortyData, error } = await useRickAndMortyData<Info<Character[]>>(`character?page=${page}`)
    const rickAndMortyCharacters: Character[] = rickAndMortyData?.value?.results || []

    if (error.value) {
      console.error('Error fetching data in useFetchPokemonNames', error.value)
      return
    }

    // If we fetched any characters, add them to the store
    if (rickAndMortyCharacters?.length) {
      addCharacterList(rickAndMortyCharacters, page)
    }
  }
}
