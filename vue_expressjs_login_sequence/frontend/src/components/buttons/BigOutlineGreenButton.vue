<script setup>
</script>

<template>
  <button class="big-outline-green-button"> 
    <slot/>
  </button>
</template>

<style>
  .big-outline-green-button {
    width: 275px;
    height: 46px;
    background: #FFFFFF;
    border-radius: 28px;
    border: 1px solid #5DB075;

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.04em;
    color: #5DB075;
  }

  .big-outline-green-button:active {
    /*background-color: #8EC89E;*/
  }
</style>
