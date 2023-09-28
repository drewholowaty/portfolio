<script setup>
</script>

<template>
  <div class="background">
    <router-view></router-view>
  </div>
</template>

<style scoped>
  .background {
    display:flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #000000;
    height: 100vh;
    width: 100vw;
    overflow: scroll;
    padding: 0px;
  }
</style>

