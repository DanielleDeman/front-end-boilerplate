import type { PokeAPI } from 'pokeapi-types'
import { itemsPerPage } from '~/constants'
import { usePokemonStore } from '~/store/pokemon'

// Fetch Pokemon names from the API for a specific page
export default async (page: number): Promise<string[]> => {
  const { hasPage } = usePokemonStore()

  // Ensure the page number is valid
  if (page < 1) {
    console.error('Invalid page number at useFetchPokemonNames', page)
    return []
  }
  if (!hasPage(page)) {
    const offset = (page - 1) * itemsPerPage
    const limit = itemsPerPage
    const { data: pokemonListData, error } = await usePokemonData<PokeAPI.NamedAPIResourceList | null>(`pokemon?limit=${limit}&offset=${offset}`)

    if (error.value) {
        console.error('Error fetching data in useFetchPokemonNames', error.value)
      return []
    }

    // Extract the Pokémon from the result
    const pokemonList: PokeAPI.NamedAPIResource[] = pokemonListData?.value?.results?.length
      ? pokemonListData.value.results
      : []

    // Only return the names of Pokemon that have a name
    return pokemonList.flatMap(pokemon => pokemon.name
      ? [pokemon.name]
      : [])
  }
  return []
}
