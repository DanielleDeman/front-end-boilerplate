import type { AsyncDataRequestStatus } from '#app'

// Merge the statuses for fetching the pokemon and get a single status
export default (statuses: (Ref<AsyncDataRequestStatus>)[]): {
  mergedStatus: ComputedRef<AsyncDataRequestStatus>
} => {
  const mergedStatus: ComputedRef<AsyncDataRequestStatus> = computed(() => {
    const nonSuccessStatus: AsyncDataRequestStatus[] = ['error', 'idle', 'pending']

    // Return the first non-success status
    for (const status of statuses) {
      if (nonSuccessStatus.includes(status.value)) {
        return status.value
      }
    }

    return 'success' as AsyncDataRequestStatus
  })

  return {
    mergedStatus,
  }
}
