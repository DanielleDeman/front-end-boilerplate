<script setup lang="ts">
const { data } = useRickAndMortyData('character')
</script>

<template>
  <ExampleApiResponse :response="data" />
</template>
