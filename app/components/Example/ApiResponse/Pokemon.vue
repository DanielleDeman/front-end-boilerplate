<script setup lang="ts">
const { data } = usePokemonData('pokemon')
</script>

<template>
  <ExampleApiResponse :response="data" />
</template>
