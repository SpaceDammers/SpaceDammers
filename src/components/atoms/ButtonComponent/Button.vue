<script lang="ts">
export default {
  name: "ButtonComponent",
  props: {
    text: {
      type: String,
      default: "This is a button",
    },
    href: {
      type: String,
      default: "#",
    },
    target: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "This is a button",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    orange: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <a
    :href="href"
    :target="target"
    :title="title"
    :class="{ disabled: disabled, orange: orange }"
    class="button"
  >
    {{ text }}
  </a>
</template>

<style lang="scss">
@import "./Button.scss";
</style>
