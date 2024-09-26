<script setup>
import { ref, computed } from 'vue';

const firstNumber = ref(null);
const secondNumber = ref(null);
const action = ref(null);

const result = computed(() => {
  // Ensure both numbers are present
  if (firstNumber.value === null || secondNumber.value === null) {
    return 'Please provide both numbers';
  }

  const num1 = Number(firstNumber.value);
  const num2 = Number(secondNumber.value);

  switch (action.value) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      // Handle division by zero
      return num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
    default:
      return 'Select a valid operation';
  }
});
</script>

<template>
  <div>
    <h2>Calculator</h2>
    <NuxtLink to="/">Home</NuxtLink>
    <section>
      <input type="number" v-model.number="firstNumber" placeholder="First Number" />
      <select v-model="action">
        <option disabled value="">Select an operation</option>
        <option>+</option>
        <option>-</option>
        <option>*</option>
        <option>/</option>
      </select>
      <input type="number" v-model.number="secondNumber" placeholder="Second Number" />
      <div>Equals:</div>
      <div>{{ result }}</div>
    </section>
  </div>
</template>

<style scoped>
input, select {
  margin-right: 10px;
  padding: 5px;
}
div {
  margin-top: 10px;
}
</style>
