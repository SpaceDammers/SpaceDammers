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
// @import "@atoms/ButtonComponent/button.scss";

.button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 51px;
  gap: 10px;
  width: fit-content;
  background: rgba(237, 19, 93, 0.12);
  border: 4px dashed $landstede-rose;
  border-radius: 1080px;
  font-family: "Voyager";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  color: $landstede-rose;
  transition: 0.3s;

  &:hover {
    transform: scale(1.03);
    border: 4px solid $landstede-rose;
  }

  &.orange {
    background: rgba(255, 178, 139, 0.22);
    color: $orange;
    border: 4px dashed $orange;
    border-radius: 1080px;

    &:hover {
      transform: scale(1.03);
      border: 4px solid $orange;
    }
  }

  &.disabled {
    display: flex;
    padding: 12px 42px;
    gap: 10px;
    background: rgba(150, 150, 150, 0.6);
    border: 4px solid #9e9e9e;
    border-radius: 1080px;
    color: $disabled;
    cursor: not-allowed;

    &:hover {
      transform: scale(1);
    }
  }
}
</style>
