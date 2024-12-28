import { validPageQueryParam } from '~/helpers/pageNumber'

// A composable function to add the page query parameter to the route
export default (): {
  currentPage: Ref<number>
} => {
  const route = useRoute()
  const validPage: ComputedRef<number> = computed(() => validPageQueryParam(route.query.page as string))
  const currentPage: Ref<number> = ref(validPage.value)

  // Watch for changes to the page ref and update the page query param in the route
  watch(() => currentPage.value, async () => {
    if (currentPage.value !== validPage.value) {
      // Update the page query parameter in the route
      await navigateTo({ ...route, query: { ...route.query, page: currentPage.value } })
    }
  }, { immediate: true })

  return {
    currentPage,
  }
}
