<script setup lang="ts">
import type { PokeAPI } from 'pokeapi-types'
import { usePokemonStore } from '~/store/pokemon'

// Route composable to get the current route
const route = useRoute()

// Stores
const pokemonStore = usePokemonStore()

const { name } = route.params as { name: string }

// Fetch Pokemon details
const {
  status,
} = await useFetchPokemon(name)

// The current pokemon
const pokemon: ComputedRef<PokeAPI.Pokemon | null> = computed(() =>
    pokemonStore.pokemonByName.get(name) ?? null)

const pokemonImage: ComputedRef<string | null> = computed(() =>
  pokemon.value?.sprites?.other?.dream_world?.front_default
  ?? pokemon.value?.sprites?.other?.home?.front_default ?? null)
</script>

<template>
  <div>
    <UContainer>
      <ApplicationStatus
        v-if="status !== 'success'"
        :status="status"
      />

      <template v-else-if="pokemon">
        <PageTitle>
          {{ pokemon?.name ?? 'Pokemon' }}
        </PageTitle>
        <img
          v-if="pokemonImage"
          :src="pokemonImage"
          alt=""
          class="w-32 h-32 my-12"
        >
        <div class="my-12">
          Types:
          <ul class="mb-4">
            <li v-for="type in pokemon.types" :key="`type-${type.type.name}`">
              {{ type.type.name }}
            </li>
          </ul>
        </div>
        <div class="my-12">
          <p>Height: {{ pokemon.height }}</p>
          <p>Weight: {{ pokemon.weight }}</p>
        </div>
        <div class="my-12">
          <p>Base Experience: {{ pokemon.base_experience }}</p>
        </div>
      </template>
    </UContainer>
  </div>
</template>
