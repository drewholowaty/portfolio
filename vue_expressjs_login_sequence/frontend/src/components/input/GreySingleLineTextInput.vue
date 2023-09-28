<script setup>
  defineProps(['modelValue']);
  defineEmits(['update:modelValue']);
</script>

<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  > 
</template>

<style scoped>
  input {
/* Rectangle 17935 */

    width: 326px;
    height: 44px;
    left: 32px;
    top: 498px;
    background: #F3F4F4;
    border-radius: 10px;
    border: none;

    font-size: 16px;
    padding-left: 10px;
  }

  input::placeholder {
    font-weight: 400;
    font-size: 12px;
  }

  input:focus {
    border: 2px solid #000000;
    outline: none;
  }
</style>
