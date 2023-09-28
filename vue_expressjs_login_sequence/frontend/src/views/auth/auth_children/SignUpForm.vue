<script setup>
import WhiteCurvedTopContainer from '../../../components/containers/WhiteCurvedTopContainer.vue'
import BigGreenButton from '../../../components/buttons/BigGreenButton.vue'
import GreySingleLineTextInput from '../../../components/input/GreySingleLineTextInput.vue'
import BigOutlineGreenButton from './../../../components/buttons/BigOutlineGreenButton.vue'

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

const name = ref(null);
const email = ref(null);
const phone = ref(null);
const preferred_zip_code = ref(null);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

if(params.auth_type === 'email') {
  email.value = params.email_or_phone;
} else if (params.auth_type === 'phone') {
  phone.value = params.email_or_phone;
}

async function onClick_Continue() {

  router.push({ 
    path: "/auth/signup",
    query: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      preferred_zip_code: preferred_zip_code.value
    }
  });

}

</script>

<template>
  <div class="c0">
    <img alt="PropertySwan" src="@/assets/logo_white.svg" class="img" >
    <WhiteCurvedTopContainer>
      <h1>SIGN UP</h1>
      <div class="c0c0">
        <p class="p1">Your Name</p>
        <GreySingleLineTextInput v-model="name" type="text" placeholder=""/>
        <p class="p1">Email Address</p>
        <GreySingleLineTextInput v-model="email" type="text" placeholder="hello@example.com"/>
        <p class="p1">Phone Number</p>
        <GreySingleLineTextInput v-model="phone" type="text" placeholder="+16145551234"/>
        <p class="p1">Preferred Zip Code (can be changed later)</p>
        <GreySingleLineTextInput v-model="preferred_zip_code" type="text" placeholder=""/>
        <BigGreenButton @click="onClick_Continue()" style="margin-top: 64px;">Continue</BigGreenButton>
      </div>
    </WhiteCurvedTopContainer>
  </div>
</template>

<style scoped>

  .img {
    width: 30%;
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

  .p1 {
    align-self: start;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300;
    color: #171A18;
    font-size: 14px;
    letter-spacing: 0.02em;
    margin-top: 40px;
  }

</style>
