<script setup lang="ts">
import type { Character } from 'rickmortyapi'
import ContentCard from '~/components/Card/Card.vue'
import ContentCardMinimal from '~/components/Card/Minimal.vue'
import LayoutGrid from '~/components/Layout/Grid.vue'
import LayoutList from '~/components/Layout/List.vue'
import { charactersPerPage, maxPaginationPages } from '~/constants'
import { useLayoutStore } from '~/store/layout'
import { useRickAndMortyStore } from '~/store/rick-and-morty'
import { LayoutTyping } from '~/types/ui'

// Get the page from the url query param
const {
  currentPage,
} = usePageQueryParam()

// Stores
const rickAndMortyStore = useRickAndMortyStore()
const layoutStore = useLayoutStore()

// Fetch the characters for the current page
const {
  status,
} = await useFetchRMCharactersByPage()

// The array of characters for the current page
const currentPageCharacters: ComputedRef<Character[]> = computed(() =>
  rickAndMortyStore.charactersByPage.get(currentPage.value) || [])

// The active tab and component
const activeLayout = computed(() =>
  layoutStore.layout === LayoutTyping.Grid ? LayoutGrid : LayoutList,
)
// The card component is not coupled to the layout component so you can use the same layout component with different card components
const activeCard = computed(() =>
  layoutStore.layout === LayoutTyping.Grid ? ContentCard : ContentCardMinimal,
)
</script>

<template>
  <section>
    <UContainer>
      <div class="flex justify-between my-12">
        <h1 class="text-3xl">
          Rick and Morty Characters
        </h1>
        <LayoutToggle />
      </div>

      <ApplicationStatus
        v-if="status !== 'success'"
        :status="status"
        class="my-12"
      />

      <template v-else>
        <component :is="activeLayout" :items="currentPageCharacters" layout-index="rick-and-morty" class="my-12">
          <template #default="{ item }">
            <component :is="activeCard" :to="{ name: 'rick-and-morty-id', params: { id: item?.id } }">
              <template #title>
                <h2 class="text-xl">
                  {{ item?.name ?? 'Character' }}
                </h2>
              </template>
              <template #image>
                <img
                  :src="item?.image"
                  alt=""
                  class="max-h-full"
                >
              </template>
              <template #content>
                <p>Status: {{ item?.status }}</p>
                <p>Species: {{ item?.species }}</p>
              </template>
            </component>
          </template>
        </component>

        <ClientOnly>
          <UPagination
            v-show="rickAndMortyStore.totalCharacters && rickAndMortyStore.totalCharacters > charactersPerPage"
            v-model="currentPage"
            :max="maxPaginationPages"
            :page-count="charactersPerPage"
            :total="rickAndMortyStore.totalCharacters"
            class="my-12"
          />
        </ClientOnly>
      </template>
    </UContainer>
</section>
</template>
