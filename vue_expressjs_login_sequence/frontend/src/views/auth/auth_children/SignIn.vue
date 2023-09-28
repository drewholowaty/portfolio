<script setup>
import WhiteCurvedTopContainer from '../../../components/containers/WhiteCurvedTopContainer.vue'
import BigGreenButton from '../../../components/buttons/BigGreenButton.vue'
import GreySingleLineTextInput from '../../../components/input/GreySingleLineTextInput.vue'
import BigOutlineGreenButton from './../../../components/buttons/BigOutlineGreenButton.vue'
import BlueCheckbox from '../../../components/input/BlueCheckbox.vue'

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

const onetime_code = ref(null);
const remember_me = ref(null);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

async function onClick_SignIn() {
  if(remember_me.value === "remember_me") {
    remember_me.value = true;
  } else {
    remember_me.value = false;
  }

  const req_data = {
    email_or_phone: params.email_or_phone,
    user_id: params.user_id, 
    onetime_code: onetime_code.value,
    remember_me: remember_me.value
  }

  const res = await fetch(import.meta.env.VITE_MIDDLEWARE_URL + '/api/auth/login',
  {
    method: 'POST',
    credentials: "include",
    headers: {
      "Accept": "*/*",
      "Content-Type":"application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(req_data)
  });

  const res_body = await res.json();
  console.log(res_body);

  if(res.status === 200) {
    router.push({
      path: "/welcome",
    });
  }

}  
</script>

<template>
  <div class="c0">
    <img alt="PropertySwan" src="@/assets/phone_graphic.svg" class="img" >
    <WhiteCurvedTopContainer style="">
      <h1>SIGN IN</h1>
      <div class="c0c0">
        <p class="p1">Please enter below the OTP sent to your registered phone number or email.</p>
        <p class="p2">One-Time Password</p>
        <GreySingleLineTextInput v-model="onetime_code" type="text" placeholder="eg. 1234... "/>
        <div class="c0c1">
          <BlueCheckbox v-model="remember_me" value="remember_me" style="align-self: flex-start"></BlueCheckbox>
          <p class="p3">Remember Me</p>
        </div>
        <BigGreenButton @click="onClick_SignIn()" style="margin-top: 80px;">Sign In</BigGreenButton>
        <div class="c0c2">
          <p class="p4">Code not received?&nbsp;&nbsp;</p>
          <a>RESEND</a>
        </div>
      </div>
    </WhiteCurvedTopContainer>
  </div>
</template>

<style scoped>

  .img {
    width: 45%;
    margin-top: 50px;
    margin-bottom: 50px;
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
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    margin-top: 30px;
  }

  .c0c2 {
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
    font-weight: 400;
    font-size: 13px;
    line-height: 12px;
    margin-top: 5px;
    margin-bottom: 0px;

    color: #08090A;
    opacity: 0.8;
  }

  .p4 {
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
