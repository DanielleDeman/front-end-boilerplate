<template>
  <header class="bg-zinc-100 border-b border-b-zinc-200 dark:bg-zinc-700 dark:border-b-zinc-600 py-8">
    <UContainer class="flex items-center">
      <nav>
        <ul class="flex gap-2">
          <li>
            <ApplicationHeaderLink :to="{ name: 'index' }" label="Home" />
          </li>
          <li>
            <ApplicationHeaderLink :to="{ name: 'assignment' }" label="Read the assignment instructions" />
          </li>
          <li>
            <ApplicationHeaderLink :to="{ name: 'pokemon' }" label="Pokemon" />
          </li>
          <li>
            <ApplicationHeaderLink :to="{ name: 'rick-and-morty' }" label="Rick and Morty" />
          </li>
        </ul>
      </nav>
      <div class="ml-auto">
        <UButton to="https://github.com/spend-cloud-tom/front-end-boilerplate" icon="mdi:github" color="blue" label="GitHub repository" variant="outline" />
      </div>
    </UContainer>
  </header>
</template>
