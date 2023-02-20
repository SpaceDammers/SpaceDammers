<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
</template>

<style lang="scss">
@import "@/components/TestComponent/TestComponent.scss";
</style>
