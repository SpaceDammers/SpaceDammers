<script lang="ts">
export default {
  name: "InputComponent",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    orange: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxCharacters: {
      type: Number,
      default: -1,
    },
  },
};
</script>

<template>
  <input
    type="text"
    class="input"
    :class="{ orange: orange, disabled: disabled }"
    :placeholder="placeholder"
    :maxlength="maxCharacters"
  />
</template>

<style lang="scss" scoped>
@import "@atoms/InputComponent/Input.scss";
</style>
