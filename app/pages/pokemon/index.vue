<script setup lang="ts">
import type { PokeAPI } from 'pokeapi-types'
import ContentCard from '~/components/Card/Card.vue'
import ContentCardMinimal from '~/components/Card/Minimal.vue'
import LayoutGrid from '~/components/Layout/Grid.vue'
import LayoutList from '~/components/Layout/List.vue'
import { itemsPerPage, maxPaginationPages } from '~/constants'
import { useLayoutStore } from '~/store/layout'
import { usePokemonStore } from '~/store/pokemon'
import { LayoutTyping } from '~/types/ui'


// Get the page from the url query param
const {
    currentPage
} = usePageQueryParam()

// Stores
const pokemonStore = usePokemonStore()
const layoutStore = useLayoutStore()

// Fetch the pokemon for the current page
const {
  pokemonNames,
  status,
} = await useFetchPokemonNames()

const {
  status: statusDetails,
} = await useFetchPokemonList(pokemonNames)

// The merged status of the pokemon and pokemon details requests
const {
  mergedStatus,
} = useMergedStatus([status, statusDetails])

// The array of pokemon for the current page
const currentPagePokemon: ComputedRef<PokeAPI.Pokemon[]> = computed(() =>
    pokemonStore.pokemonByPage.get(currentPage.value) || [])

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
          Pokémon
        </h1>
        <LayoutToggle />
      </div>

      <ApplicationStatus
        v-if="mergedStatus !== 'success'"
        :status="mergedStatus"
        class="my-12"
      />

      <template v-else>
        <component :is="activeLayout" :items="currentPagePokemon" layout-index="pokemon" class="my-12">
          <template #default="{ item }">
            <component :is="activeCard" :to="{ name: 'pokemon-name', params: { name: item?.name } }">
              <template #title>
                <h2>{{ item?.name ?? 'Pokemon' }}</h2>
              </template>
              <template #image>
                <img
                  v-if="item?.sprites?.other?.dream_world?.front_default || item?.sprites?.other?.home?.front_default"
                  :src="item.sprites.other.dream_world?.front_default ?? item.sprites.other.home?.front_default"
                  alt=""
                  class="max-h-full"
                >
              </template>
              <template #content>
                <div v-if="item?.types?.length" class="flex space-x-3">
                  <span>types:</span>
                  <template
                    v-for="(type, index) in item.types"
                  >
                    <span
                      v-if="type?.type?.name"
                      :key="`${item.id}-${type.type.name}-${index}`"
                      class="space-x-3"
                    >
                      {{ type.type.name }}
                    </span>
                  </template>
                </div>
              </template>
            </component>
          </template>
        </component>

        <ClientOnly>
          <UPagination
            v-show="pokemonStore.totalPokemon && pokemonStore.totalPokemon > itemsPerPage"
            v-model="currentPage"
            :max="maxPaginationPages"
            :page-count="itemsPerPage"
            :total="pokemonStore.totalPokemon"
            class="my-12"
          />
        </ClientOnly>
      </template>
    </UContainer>
</section>
</template>
