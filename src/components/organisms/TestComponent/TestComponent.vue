<script lang="ts">
import ButtonComponent from "../../atoms/ButtonComponent/Button.vue";
import InputComponent from "../../atoms/InputComponent/Input.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { ButtonComponent, InputComponent },
  setup() {
    const message = "This is a test component";

    return {
      message,
    };
  },
});
</script>

<template>
  <h1>{{ message }}</h1>
  <h1>This is h1</h1>
  <h2>This is h2</h2>
  <h3>This is h3</h3>
  <h4>This is h4</h4>
  <h5>This is h5</h5>
  <h6>This is h6</h6>
  <p>This is p</p>
  <a href="#">This is link</a><br />
  <ButtonComponent /><br />
  <InputComponent /><br />
  <div class="flex">
    <div class="landstede-rose"></div>
    <div class="orange"></div>
  </div>
  <hr />
</template>

<style lang="scss">
@import "@/components/organisms/TestComponent/TestComponent.scss";
</style>
