<script setup>

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 395 45" class="white-curved-top-container-0" >
    <path fill="#fff" d="M0 45c0-12.665 8.719-23.714 21.106-26.352 124.259-26.453 231.483-23.35 352.705.41C386.177 21.48 395 32.398 395 45H0Z" />
  </svg>
  <div class="white-curved-top-container-1">
    <slot />
  </div>
</template>

<style scoped>
  @media screen and (min-width: 429px) {
    .white-curved-top-container-0 {
      width: 429px;
    }
    .white-curved-top-container-1 {
      width: 429px;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
      padding-bottom: 50px;
      margin-bottom: 50px;
    }
  }
    
  @media screen and (max-width: 429px) {
    .white-curved-top-container-1 {
      width: 100vw;
      height: 100vh;
      padding-bottom: 10%;
    }
  }

  .white-curved-top-container-0 {
    margin-bottom: -4px;
  }

  .white-curved-top-container-1 {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
  }

</style>

