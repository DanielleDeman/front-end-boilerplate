<script setup lang="ts">
import type { Character, Info } from 'rickmortyapi'

const { data } = useRickAndMortyData<Info<Character[]>>('character')
</script>

<template>
  <ExampleApiResponse :response="data" />
</template>
