<template>
  <Suspense>
    <template #default>
      <div v-for="comment of comments" :key="comment.id">
        <div>{{ comment.id }} - {{ comment.body }}</div>
      </div>
    </template>
    <template #fallback>
      Loading comments...
    </template>
  </Suspense>
</template>

<script setup>
import { useFetch } from '#app';

const { data: comments} = await useFetch( 'https://jsonplaceholder.typicode.com/comments');
</script>