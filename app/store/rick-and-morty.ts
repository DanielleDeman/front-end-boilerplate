import type { Character } from 'rickmortyapi'

export const useRickAndMortyStore = defineStore('rick-and-morty', {
  state: (): {
    characterById: Map<number, Character>
    charactersByPage: Map<number, Character[]>
    totalCharacters: number
  } => ({
    // Because the Character is an object having two maps will not take up more memory because an object is a reference
    characterById: new Map<number, Character>(), // Map of id -> Character object
    charactersByPage: new Map<number, Character[]>(), // Map of page number -> Character object array
    totalCharacters: 0, // Total number of Characters in the Rick and Morty show
  }),
    getters: {
      
    // Check if the store contains a Character with a given id
    hasCharacterWithId: state => (id: number): boolean => {
      return state.characterById.has(id)
      },
      
    // Check if the store contains a page of Characters
    hasPage: state => (page: number): boolean => {
      return state.charactersByPage.has(page)
    },
  },
    actions: {
    // Action to add a Character
    addCharacter(character: Character) {
      // Only add when character has an id
      if (character?.id) {
        this.characterById.set(character.id, character)
      }
    },

    // Action to populate maps from an array of Character
    addCharacterList(characterList: Character[], page = 1) {
      // Ensure the page number is valid
      if (page < 1) {
        console.error('Invalid page number at addCharacterList in characters store', page)
        return
      }

      // Ensure the Character list is not empty
      if (characterList?.length) {
        // Add the Character to the page map
        this.charactersByPage.set(page, characterList)

        for (const character of characterList) {
          this.addCharacter(character)
        }
      }
      },
    
      updateTotalCharacters(totalCharacters: number) {
        this.totalCharacters = totalCharacters
      },
  },
})
