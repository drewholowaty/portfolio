<script setup>
</script>

<template>
  <button class="big-green-button"> 
    <slot/>
  </button>
</template>

<style>
  .big-green-button {
    width: 275px;
    height: 46px;
    background: #FFB338;
    border-radius: 28px;
    border: none;

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.04em;
    color: #FFFFFF;
  }

  .big-green-button:active {
    background-color: #8EC89E;
  }
</style>
