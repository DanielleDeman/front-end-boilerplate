import type { PokeAPI } from 'pokeapi-types'

// The multiple of Pokémon is Pokémon
export const usePokemonStore = defineStore('pokemon', {
  state: (): {
    pokemonByName: Map<string, PokeAPI.Pokemon>
    pokemonByPage: Map<number, PokeAPI.Pokemon[]>
    totalPokemon: number
  } => ({
    /**
     * If we use the name we can also use the name in the url which is good for seo
     * Since the name is part of the API url we can assume it's unique
     * Because the Pokemon is an object having two maps will not take up more memory because an object is a reference
     */
    pokemonByName: new Map<string, PokeAPI.Pokemon>(), // Map of name -> Pokémon object
    pokemonByPage: new Map<number, PokeAPI.Pokemon[]>(), // Map of page number -> Pokémon object array
    totalPokemon: 0, // Total number of Pokémon in the show
  }),
  getters: {

    // Check if the store contains a Pokémon with a given name
    hasPokemonWithName: state => (name: string): boolean => {
      return state.pokemonByName.has(name)
    },

    // Check if the store contains a page of Pokémon
    hasPage: state => (page: number): boolean => {
      return state.pokemonByPage.has(page)
    },

    // Get a Pokémon based on its name
    getPokemonByName: state => (name: string): PokeAPI.Pokemon | undefined => {
      return state.pokemonByName.get(name)
    },
  },
  actions: {

    // Action to add a Pokémon
    addPokemon(pokemon: PokeAPI.Pokemon) {
      // Only add when pokemon has a name
      if (pokemon?.name) {
        this.pokemonByName.set(pokemon.name, pokemon)
      }
    },

    // Action to populate maps from an array of Pokémon
    addPokemonList(newPokemon: PokeAPI.Pokemon[], namesOnPage: string[], page = 1) {
      // Ensure the page number is valid
      if (page < 1) {
        console.error('Invalid page number at addPokemonToPage in pokemon store', page)
        return
      }

      // If there are any Pokemon that are not already in the store, add them
      if (newPokemon?.length) {
        // Add the Pokémon details to the store
        for (const pokemon of newPokemon) {
          this.addPokemon(pokemon)
        }
      }
      // Once all new pokemon have been added to the store, set up the page
      this.pokemonByPage.set(page, namesOnPage.flatMap(name =>
        this.hasPokemonWithName(name)
          ? [this.getPokemonByName(name) as PokeAPI.Pokemon]
          : []))
    },

      updateTotalPokemon(totalPokemon: number) {
          if (totalPokemon > 0) {
              this.totalPokemon = totalPokemon
          }
    },
  },
})
