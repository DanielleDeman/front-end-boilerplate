import type { Character } from 'rickmortyapi'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useRickAndMortyStore } from './rick-and-morty'

describe('rick and morty store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useRickAndMortyStore()
    expect(store.characterById.size).toBe(0)
    expect(store.charactersByPage.size).toBe(0)
    expect(store.totalCharacters).toBe(0)
  })

  it('adds a character', () => {
    const store = useRickAndMortyStore()
    const character: Character = { id: 1, name: 'Rick Sanchez' } as Character
    store.addCharacter(character)
    expect(store.characterById.size).toBe(1)
    expect(store.characterById.get(1)).toEqual(character)
  })

  it('does not add a character without id', () => {
    const store = useRickAndMortyStore()
    const character: Character = { name: 'Unknown' } as Character
    store.addCharacter(character)
    expect(store.characterById.size).toBe(0)
  })

  it('adds a list of characters', () => {
    const store = useRickAndMortyStore()
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez' } as Character,
      { id: 2, name: 'Morty Smith' } as Character,
    ]
    store.addCharacterList(characters, 1)
    expect(store.characterById.size).toBe(2)
    expect(store.charactersByPage.size).toBe(1)
    expect(store.charactersByPage.get(1)).toEqual(characters)
  })

  it('does not add characters if page number is invalid', () => {
    const store = useRickAndMortyStore()
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez' } as Character,
      { id: 2, name: 'Morty Smith' } as Character,
    ]
    store.addCharacterList(characters, 0)
    expect(store.characterById.size).toBe(0)
    expect(store.charactersByPage.size).toBe(0)
  })

  it('updates total characters', () => {
    const store = useRickAndMortyStore()
    store.updateTotalCharacters(100)
    expect(store.totalCharacters).toBe(100)
  })

  it('does not update total characters if number is invalid', () => {
    const store = useRickAndMortyStore()
    store.updateTotalCharacters(-1)
    expect(store.totalCharacters).toBe(0)
  })

  it('checks if character exists by id', () => {
    const store = useRickAndMortyStore()
    const character: Character = { id: 1, name: 'Rick Sanchez' } as Character
    store.addCharacter(character)
    expect(store.hasCharacterWithId(1)).toBe(true)
    expect(store.hasCharacterWithId(2)).toBe(false)
  })

  it('checks if page exists', () => {
    const store = useRickAndMortyStore()
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez' } as Character,
      { id: 2, name: 'Morty Smith' } as Character,
    ]
    store.addCharacterList(characters, 1)
    expect(store.hasPage(1)).toBe(true)
    expect(store.hasPage(2)).toBe(false)
  })
})
