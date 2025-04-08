<script setup>
</script>

<template>
<div>
  <NuxtLink to="/">Nuxt 3 Sandbox</NuxtLink>
  <div class="d-flex gap-5">
    <NuxtLink to="/about">About us</NuxtLink>
    <NuxtLink to="/calculator">Calculator</NuxtLink>
    <NuxtLink to="/comments">Comments</NuxtLink>
    <NuxtLink to="/map">Map</NuxtLink>
  </div>
  <slot></slot>
</div>
</template>

<style scoped>

</style>