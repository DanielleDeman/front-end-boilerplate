<script setup lang="ts">
import type { Character } from 'rickmortyapi'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Stores
const rickAndMortyStore = useRickAndMortyStore()

// Fetch Pokemon details
const {
  id,
  status,
} = await useFetchRMCharacter()

// The current character
const character: ComputedRef<Character | null> = computed(() =>
  rickAndMortyStore.characterById.get(Number(id.value)) ?? null)
</script>

<template>
  <section>
    <UContainer>
      <ApplicationStatus
        v-if="status !== 'success'"
        :status="status"
      />

      <article v-else-if="character">
        <PageTitle>
          {{ character.name ?? 'Character' }}
        </PageTitle>
        <img :src="character.image" :alt="character.name" class="my-12">
        <div class="my-12">
          <p><strong>Status:</strong> {{ character.status }}</p>
          <p><strong>Species:</strong> {{ character.species }}</p>
          <p><strong>Gender:</strong> {{ character.gender }}</p>
          <p><strong>Origin:</strong> {{ character.origin.name }}</p>
          <p><strong>Location:</strong> {{ character.location.name }}</p>
        </div>
      </article>
    </UContainer>
  </section>
</template>
