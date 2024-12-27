<template>
  <main class="min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
    <NuxtLoadingIndicator />
    <ApplicationHeader />
    <NuxtErrorBoundary>
      <slot />
      <template #fallback>
        <p>Oeps, er ging iets mis</p>
      </template>
    </NuxtErrorBoundary>
    <ApplicationFooter />
  </main>
</template>
