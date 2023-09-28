<script setup>

</script>

<template>
  <div>
    <div class="c0">
      <input id="ipt1" />
      <label for="ipt1">
        <img alt="PropertySwan" src="@/assets/search_button_icon.svg" class="materials-icon" >
      </label> 
    </div>
  </div>
</template>

<style scoped>
  @media screen and (min-width: 429px) {
    .c0 {
      width: 429px;
    }

    input:focus {
      width: 343px;
    }

  }
    
  @media screen and (max-width: 429px) {
    .c0 {
      width: 100vw;
    }

    input:focus {
      width: 80%;
    }

  }

  .materials-icon {
    width: 129%;
    background-color: transparent;
  }
  .c0 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    background-color: transparent;
    border: none;
    position: absolute;
    right: 30px;
    margin-top: 4.5px;
  }

  input {
    margin: 4px 4px 4px 80%;
    background-color: #FFFFFF;
    border: none;
    outline: none;
    height: 51.5px;
    border-top-left-radius: 6px; 
    border-bottom-left-radius: 6px;
    padding: 0; 
    width: 0;
    transition: margin-left 0.4s, width 0.4s;

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 12px;
    letter-spacing: 0.14px;
    color: #F3F4F3;
  }

  input:focus {
    margin-left: -9%;
    padding-left: 15px;
    transition: margin-left 0.4s, width 0.4s;

    background-color: #FFFFFF;
    color: #171A18;
  }

</style>
