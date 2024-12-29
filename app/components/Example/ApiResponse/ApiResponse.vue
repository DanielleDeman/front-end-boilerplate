<script setup lang="ts">
const props = defineProps<{
  response: any
}>()

const response = computed(() => {
  let stringifiedResponse

  try {
    stringifiedResponse = JSON.stringify(props.response, null, 2)
  }
  catch {
    stringifiedResponse = 'Error parsing response'
  }

  return stringifiedResponse
})
</script>

<template>
  <pre class="bg-stone-400 text-stone-900 rounded-sm max-h-60 overflow-auto text-xs">
    {{ response }}
  </pre>
</template>
