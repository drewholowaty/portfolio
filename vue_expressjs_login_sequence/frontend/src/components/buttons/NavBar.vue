<script setup>
</script>

<template>
  <!-- div tag added because parent component css affects root node of child component --> 
  <div>
    <button class="add-property-button" >
      <img alt="PropertySwan" src="@/assets/Add_Property_Button.svg" class="add-property-icon" >
    </button>

    <div class="c0">
      <div class="c0c0"></div>

      <div class="c0c1">
        <img alt="PropertySwan" src="@/assets/bottom_bar_background.svg" class="bottom-bar-background" >
        <button class="materials-button">
          <img alt="PropertySwan" src="@/assets/Iconly_Light_Bookmark.svg" class="materials-icon" >
          Materials
        </button>
        <button class="settings-button">
          <img alt="PropertySwan" src="@/assets/Setting_Icon.svg" class="materials-icon" >
          Settings
        </button>
      </div>

      <div class="c0c2"></div>

    </div>

  </div>

</template>

<style scoped>
  @media screen and (min-width: 429px) {
  }
    
  @media screen and (max-width: 429px) {
    .c0c1 {
      width: 100vw;
    }
  }

  .bottom-bar-background{
    width: 429px;
  }

  .add-property-button {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    bottom: 0.9px;

    background-color: transparent;
    border: none;
  }

  .add-property-icon {
    width:
  }

  .settings-icon {
    padding-bottom: 8px;
  }

  .materials-icon {
    padding-bottom: 8px;
  }

  .c0 {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 0px;

    display: flex;  
    flex-flow: row; 
    align-items: flex-end;
    justify-content: center;
    width: 100vw;
  }

  .c0c0 {
    display:flex;
    flex: 1;
    height: 71.5px;
    background-color: #FFFFFF;
  }

  .c0c2 {
    display:flex;
    flex: 1;
    height: 71.5px;
    background-color: #FFFFFF;
  }

  .c0c1 {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
    overflow-x: hidden;

    position: relative;
  }

  .c0c1 .materials-button {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;

    position: absolute;
    bottom: 15px;
    right: 75%;

    background-color: transparent;
    border: none;

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 11px;
    text-align: center;
    letter-spacing: 0.02em;
    color: #B6BABF;
  }
  
  .c0c1 .settings-button {
    display: flex; 
    flex-flow: column nowrap;
    flex: 0 0 auto;
    align-items: center;

    justify-content: flex-start;
    position: absolute;
    bottom: 15px;
    right: 12%;

    background-color: transparent;
    border: none;

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 11px;
    text-align: center;
    letter-spacing: 0.02em;
    color: #B6BABF;
  }
  
</style>
