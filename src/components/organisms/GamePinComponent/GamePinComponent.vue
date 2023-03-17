<script lang="ts">
import ButtonComponent from "@/components/atoms/ButtonComponent/button.vue";
import InputComponent from "@/components/atoms/InputComponent/Input.vue";

export default {
  name: "GamePinComponent",
  components: {
    ButtonComponent,
    InputComponent,
  }
};

// log the gamepin when it changes
</script>

<template>
  <div class="begin-game">
    <h1 class="title">SPACEDAMMERS</h1>
    <div class="game-pin">
      <h1 class="title">Enter Game Pin</h1>
      <div class="start">
        <InputComponent
          :placeholder="'_ _ _ _'"
          :class="'game-pin-input'"
          :max-characters="4"
        />
        <ButtonComponent :text="'Start game'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/components/organisms/GamePinComponent/GamePinComponent.scss";
</style>
