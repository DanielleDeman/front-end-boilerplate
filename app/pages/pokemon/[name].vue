<script setup lang="ts">
import type { PokeAPI } from 'pokeapi-types'
import { usePokemonStore } from '~/store/pokemon'

// Stores
const pokemonStore = usePokemonStore()

// Fetch Pokemon details
const {
  pokemonName,
  status,
} = await useFetchPokemon()

// The current pokemon
const pokemon: ComputedRef<PokeAPI.Pokemon | null> = computed(() =>
  pokemonStore.pokemonByName.get(pokemonName.value) ?? null)

const pokemonImage: ComputedRef<string | null> = computed(() =>
  pokemon.value?.sprites?.other?.dream_world?.front_default
  ?? pokemon.value?.sprites?.other?.home?.front_default ?? null)
</script>

<template>
  <section>
    <UContainer>
      <ApplicationStatus
        v-if="status !== 'success'"
        :status="status"
      />

      <article v-else-if="pokemon">
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
      </article>
    </UContainer>
  </section>
</template>
