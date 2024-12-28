<script setup lang="ts">
import type { Character } from 'rickmortyapi'
import { useRickAndMortyStore } from '~/store/rick-and-morty'

// Route composable to get the current route
const route = useRoute()

// Stores
const rickAndMortyStore = useRickAndMortyStore()

const { id } = route.params as { id: string }

// Fetch Pokemon details
const {
  status,
} = await useFetchRMCharacter(id)

// The current character
const character: ComputedRef<Character | null> = computed(() =>
    rickAndMortyStore.characterById.get(Number(id)) ?? null)
</script>

<template>
  <div>
    <UContainer>
      <ApplicationStatus
        v-if="status !== 'success'"
        :status="status"
      />

      <div v-else-if="character">
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
      </div>
    </UContainer>
  </div>
</template>
