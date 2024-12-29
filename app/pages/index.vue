<template>
  <div class="py-8">
    <UContainer>
      <header class="border-b mb-8 py-2 text-xl">
        <h1>
          Welcome to the home page!
        </h1>
      </header>
      <div>
        <p>Have a good time reviewing my code!</p>
      </div>
      <div class="grid gap-4 xl:grid-cols-2">
        <section title="Rick and Morty API response">
          <ExampleApiResponseRickAndMorty />
        </section>
        <section title="Pokemon API response">
          <ExampleApiResponsePokemon />
        </section>
      </div>
    </UContainer>
  </div>
</template>
