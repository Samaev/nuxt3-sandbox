<script setup>
</script>

<template>
<div>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator   duration="2000"/>
  <NuxtLink to="/">Nuxt 3 Sandbox</NuxtLink>
  <div class="d-flex flex-column">
    <NuxtLink to="/about">About us</NuxtLink>
    <NuxtLink to="/calculator">Calculator</NuxtLink>
  </div>
  <slot></slot>
</div>
</template>

<style scoped>

</style>