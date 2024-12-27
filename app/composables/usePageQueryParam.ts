// A composable function to add the page query parameter to the route
export default (page: Ref<number>): void => {
  const route = useRoute()
  const router = useRouter()

  // Get the page query param from the route and update the page ref to match it if it is different
  if (route?.query?.page && Number(route.query.page) !== page.value) {
    page.value = Number(route.query.page)
  }
  watch(() => page.value, () => {
    // Ensure the page number is valid
    if (!page.value || page.value < 1) {
      console.error('Invalid page number at usePageQueryParam', page.value)
    }
    else if (page.value !== Number(route.query.page)) {
      // Update the page query parameter in the route
      router.push({ ...route, query: { ...route.query, page: page.value } })
    }
  }, { immediate: true })
}
