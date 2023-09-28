<script setup>
import WhiteBackground from '../components/containers/WhiteBackground.vue'
</script>

<template>
  <WhiteBackground>
      <div class="parent">
        <img alt="Logo" src="@/assets/SVG_Logo.svg" class="img" >
        <h1>Sample App</h1>
      </div>
  </WhiteBackground>
</template>

<style scoped>
  .img {
    width: 100px;
    padding-bottom: 15px;
  }

  .parent {
    display: flex; 
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  h1 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0.2em;
  } 
</style>
