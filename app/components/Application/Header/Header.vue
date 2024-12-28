<template>
  <header class="bg-zinc-100 border-b border-b-zinc-200 dark:bg-zinc-700 dark:border-b-zinc-600 py-8">
    <UContainer class="flex items-center">
      <nav>
        <ul class="flex gap-2">
          <li>
            <ApplicationHeaderLink :to="{ name: 'pokemon', query: { page: 1 } }" label="Pokemon" />
          </li>
          <li>
            <ApplicationHeaderLink :to="{ name: 'rick-and-morty', query: { page: 1 } }" label="Rick and Morty" />
          </li>
        </ul>
      </nav>
    </UContainer>
  </header>
</template>
