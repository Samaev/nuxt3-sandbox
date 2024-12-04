<script setup>
</script>

<template>
<div>
  <NuxtLink to="/">Nuxt 3 Sandbox</NuxtLink>
  <div class="d-flex">
    <NuxtLink to="/about">About us</NuxtLink>
    <NuxtLink to="/calculator">Calculator</NuxtLink>
    <NuxtLink to="/comments">Comments</NuxtLink>
  </div>
  <slot></slot>
</div>
</template>

<style scoped>

</style>