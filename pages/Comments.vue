<template>
  <div ref="commentList" v-for="comment of visibleComments" :key="comment.id">
    <div>{{ comment.id }} - {{ comment.body }}</div>
  </div>
  <div v-if="hasMoreComments" class="loading">Loading more comments...</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
 

const comments = ref([]); // Array to store fetched comments
const visibleComments = ref([]); // Array for currently displayed comments
const hasMoreComments = ref(true); // Flag to indicate availability of more comments
const isLoading = ref(false); // Flag to prevent duplicate requests

const fetchComments = async (startIndex = 0, limit = 50) => {
  isLoading.value = true;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_start=${startIndex}&_limit=${limit}`);
    const newComments = await response.json();

    // Update visibleComments directly with new comments
    visibleComments.value = visibleComments.value.concat(newComments);

    comments.value = comments.value.concat(newComments); // Update full comments list

    if (newComments.length < limit) {
      hasMoreComments.value = false;
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = () => {
  if (isLoading.value || !hasMoreComments.value) return;

  const {scrollTop, scrollHeight, clientHeight} = document.documentElement || document.body;
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // Threshold for near bottom

  if (isNearBottom) {
    fetchComments(comments.value.length); // Fetch more comments based on current length
  }
};

onMounted(async () => {
  await fetchComments();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // Clean up event listener (optional, if performance is critical)
  window.removeEventListener('scroll', handleScroll);
});


</script>

<style scoped>
.loading {
  text-align: center;
  margin: 10px 0;
}
</style>