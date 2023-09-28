<script setup>
</script>

<template>
  <input 
    type="checkbox"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  > 
</template>

<style scoped>

  input {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid #B6C7D2;
  }

</style>
