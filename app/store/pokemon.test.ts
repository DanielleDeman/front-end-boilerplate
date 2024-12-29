import type { PokeAPI } from 'pokeapi-types'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePokemonStore } from './pokemon'

describe('pokemon store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = usePokemonStore()
    expect(store.pokemonByName.size).toBe(0)
    expect(store.pokemonByPage.size).toBe(0)
    expect(store.totalPokemon).toBe(0)
  })

  it('adds a Pokémon', () => {
    const store = usePokemonStore()
    const pokemon: PokeAPI.Pokemon = { name: 'pikachu' } as PokeAPI.Pokemon
    store.addPokemon(pokemon)
    expect(store.pokemonByName.size).toBe(1)
    expect(store.pokemonByName.get('pikachu')).toEqual(pokemon)
  })

  it('does not add a Pokémon without a name', () => {
    const store = usePokemonStore()
    const pokemon: PokeAPI.Pokemon = {} as PokeAPI.Pokemon
    store.addPokemon(pokemon)
    expect(store.pokemonByName.size).toBe(0)
  })

  it('checks if a Pokémon exists by name', () => {
    const store = usePokemonStore()
    const pokemon: PokeAPI.Pokemon = { name: 'pikachu' } as PokeAPI.Pokemon
    store.addPokemon(pokemon)
    expect(store.hasPokemonWithName('pikachu')).toBe(true)
    expect(store.hasPokemonWithName('bulbasaur')).toBe(false)
  })

  it('adds a list of Pokémon and associates them with a page', () => {
    const store = usePokemonStore()
    const pokemonList: PokeAPI.Pokemon[] = [
      { name: 'pikachu' } as PokeAPI.Pokemon,
      { name: 'bulbasaur' } as PokeAPI.Pokemon,
    ]
    store.addPokemonList(pokemonList, ['pikachu', 'bulbasaur'], 1)
    expect(store.pokemonByName.size).toBe(2)
    expect(store.pokemonByPage.size).toBe(1)
    expect(store.pokemonByPage.get(1)?.length).toBe(2)
  })

  it('updates the total number of Pokémon', () => {
    const store = usePokemonStore()
    store.updateTotalPokemon(150)
    expect(store.totalPokemon).toBe(150)
  })

  it('does not update the total number of Pokémon with a non-positive number', () => {
    const store = usePokemonStore()
    store.updateTotalPokemon(-1)
    expect(store.totalPokemon).toBe(0)
  })
})
