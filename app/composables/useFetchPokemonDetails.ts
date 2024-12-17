import type { PokeAPI } from 'pokeapi-types'
import { usePokemonStore } from '~/store/pokemon'

export default async (names: string[], page: number): Promise<void> => {
  const { addPokemonList, hasPokemonWithName, getPokemonByName } = usePokemonStore()
  const nuxtApp = useNuxtApp()

  // Filter out any Pokémon we already have in the store so we do not refetch them
  const unknownUrls: string[] = names
    .flatMap(name => !hasPokemonWithName(name)
      ? [`pokemon/${name}`]
      : [])

  // Get all Pokémon we already have in the store
  const knownPokemon: PokeAPI.Pokemon[] = names.flatMap(name => hasPokemonWithName(name)
    ? [getPokemonByName(name) as PokeAPI.Pokemon] // Needs a type assertion because we know the Pokémon is in the store but typescript does not
    : [])

  // If there are any Pokémon that we do not already have, fetch their details and add them to the store
  const fetchPromises = unknownUrls.map(url => nuxtApp.runWithContext(() =>
    usePokemonData<PokeAPI.Pokemon>(url)))

  // Get all detail data and filter out any null values
  const pokemonDetails: PokeAPI.Pokemon[] = await Promise.all(fetchPromises) // Fetch all detail data in parallel
    .then(results => results
      .flatMap(result => result?.data?.value ? [result.data.value] : []))
    .catch((error) => {
      console.error('Error fetching Pokémon details:', error)
      return []
    })

  // Combine known and fetched Pokémon
  const allPokemonDetails: PokeAPI.Pokemon[] = [...knownPokemon, ...pokemonDetails]

  // If we fetched any details, add them to the store
  if (pokemonDetails?.length) {
    addPokemonList(allPokemonDetails, page)
  }
}
