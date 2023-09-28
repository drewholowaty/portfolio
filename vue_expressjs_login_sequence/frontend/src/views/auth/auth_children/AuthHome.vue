<script setup>
import WhiteCurvedTopContainer from '../../../components/containers/WhiteCurvedTopContainer.vue'
import BigGreenButton from '../../../components/buttons/BigGreenButton.vue'
import GreySingleLineTextInput from '../../../components/input/GreySingleLineTextInput.vue'
import BigOutlineGreenButton from './../../../components/buttons/BigOutlineGreenButton.vue'

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

const email_or_phone = ref(null);

async function onClick_Continue() {
  const req_data = {
      email_or_phone: email_or_phone.value,
  }

  const res = await fetch(import.meta.env.VITE_MIDDLEWARE_URL + '/api/auth/verify_user',
  {
    method: 'POST',
    body: JSON.stringify(req_data),
    headers: {
      "Accept": "*/*",
      "Content-Type":"application/json",
      "Cache-Control": "no-cache",
    }
  });

  const res_body = await res.json();

  if(res.status === 404) {
    router.push({ 
      path: "/auth/signupform",
      query: {
        email_or_phone: email_or_phone.value,
        auth_type: res_body.auth_type
      }
    });
  } else if (res.status === 200) {
    router.push({
      path: "auth/signin",
      query: {
        email_or_phone: email_or_phone.value,
        user_id: res_body.user_id,
      }
    });
  }
}

</script>

<template>
  <div class="c0">
    <img alt="Logo" src="@/assets/SVG_Logo.svg" class="img" >
    <WhiteCurvedTopContainer>
      <h1>Get Started!</h1>
      <div class="c0c0">
        <p class="p1"> Please enter below your email address or phone number to continue. </p>
        <p class="p2"> Email or Phone Number </p>
        <GreySingleLineTextInput v-model="email_or_phone" type="text" placeholder="eg. +16145551234, hello@example.com"/> 
        <BigGreenButton @click="onClick_Continue()" style="margin-top: 64px;">Continue</BigGreenButton>
        <div class="c0c1">
          <p class="p3"> By continuing, you agree to our &nbsp; </p>
          <a>Terms & Conditions </a>
        </div>
      </div>
    </WhiteCurvedTopContainer>
  </div>
</template>

<style scoped>

  .img {
    width: 15%;
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .c0 {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
  }

  .c0c0 {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
  }

  .c0c1 {
    display:flex;
    flex-flow: row nowrap;
    margin-top: 80px;
  }

  h1 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: 0.02em;
    color: #171A18;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  h2 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #CCCCCC;
    letter-spacing: 0.01em;
    align-self: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .p1 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    color: #171A18;
    letter-spacing: 0.02em;
    line-height: 28px;
    text-align: center;
    width: 310px;
  }

  .p2 {
    align-self: start;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    color: #171A18;
    font-size: 14px;
    letter-spacing: 0.02em;
    margin-top: 70px;
  }

  .p3 {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    color: #171A18;
    letter-spacing: 0.02em;
    
  }

  a {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0.01em;
    padding-top: 12px;
  }

</style>
