<template>
  <section>
    <header v-if="$slots.default" class="my-12">
      <h2 class="text-3xl font-bold capitalize">
        <slot />
      </h2>
    </header>
  </section>
</template>
