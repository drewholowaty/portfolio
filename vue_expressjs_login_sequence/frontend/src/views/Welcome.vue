<script setup>
import WhiteCurvedTopContainer from '../components/containers/WhiteCurvedTopContainer.vue'
import BigGreenButton from '../components/buttons/BigGreenButton.vue'

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

</script>

<template>
  <div class="c0">
    <img alt="Graphic" src="@/assets/SVG_Logo.svg" class="img" >
    <WhiteCurvedTopContainer style="">
      <h1>Welcome to the Sample App</h1>
      <p>
        This page could be a dashboard, a feed, a menu...
      </p>
    </WhiteCurvedTopContainer>
  </div>
</template>

<style scoped>
  @media screen and (min-width: 429px) {
    .img {
      margin-top: 30px;
      margin-bottom: 45px;
      width: 15%;
    }
  }

  @media screen and (max-width: 429px) {
    .img {
      width: 15%;
      margin-top: 30px;
      margin-bottom: 45px;
    }
  }

  .c0 {
    display:flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #F3F4F3;
    height: 100vh;
    width: 100vw;
    overflow: scroll;
    padding: 0px;
  }
  
  h1 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 34px;
    letter-spacing: 0.02em;
    color: #000000;
    margin-top: 25px;
    margin-bottom: 0px;
    text-align: center;
    width: 300px;
  }

  p {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 25px;
    letter-spacing: 0.03em;
    color: #08182F;
    margin-top: 40px;
    margin-bottom: 0px;
    text-align: center;
    width: 320px;
  }

</style>

