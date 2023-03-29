<template>
  <div class="begin-game">
    <h1 class="title">SPACEDAMMERS</h1>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="success">Success: {{ success }}</div>
    <div class="game-pin" v-if="showGamePin">
      <h1 class="title">Enter Game Pin</h1>
      <div class="form">
        <InputComponent
          :placeholder="'_ _ _ _'"
          :class="'game-pin-input'"
          :orange="true"
          :max-characters="4"
          :min-characters="4"
          v-model="pin"
          @keydown.enter="sendPin"
        />
        <ButtonComponent :text="'Start game'" @click="sendPin" />
      </div>
    </div>
    <div class="name-field" v-if="showNameInput">
      <h1 class="title">Enter Name</h1>
      <div class="form">
        <InputComponent
          :placeholder="'John doe...'"
          :class="'name-input'"
          :orange="true"
          :max-characters="10"
          :min-characters="3"
          v-model="name"
          @keydown.enter="sendName"
        />
        <ButtonComponent :text="'Set name'" @click="sendName" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonComponent from "../../atoms/ButtonComponent/Button.vue";
import InputComponent from "../../atoms/InputComponent/Input.vue";
import SocketioService from "../../../services/socketio.service.js";

export default {
  name: "GamePinComponent",
  components: {
    ButtonComponent,
    InputComponent,
  },
  data() {
    return {
      pin: "",
      name: "",
      error: "",
      success: "",
      loader: false,
      showGamePin: true,
      showNameInput: false,
    };
  },
  methods: {
    async sendPin() {
      this.error = "";
      if (!this.pin) {
        this.error = "Please enter a pin";
        return;
      } else if (this.pin.length !== 4) {
        this.error = "Please enter a 4 digit pin";
        return;
      } else if (this.pin.includes(" ")) {
        this.error = "Please enter a 4 digit pin without spaces";
        return;
      } else {
        this.error = "";
        this.success = await new SocketioService().joinRoom(this.pin);
        if (this.success) {
          this.success = "Room joined successfully";
          this.showGamePin = false;
          this.showNameInput = true;
        } else {
          this.error = "Room " + this.pin + " is full";
        }
      }
    },
    sendName() {
      this.error = "";
      this.success = "";
      if (!this.name) {
        this.error = "Please enter a name";
        return;
      } else if (this.name.length < 3) {
        this.error = "Please enter a name that is longer then 3 characters";
        return;
      } else if (this.name.length > 10) {
        this.error = "Please enter a name that is shorter then 10 characters";
        return;
      } else if (this.name.includes(" ")) {
        this.error = "Please enter a 4 digit pin without spaces";
        return;
      } else {
        sessionStorage.setItem("name", this.name);
        this.$router.push("/board");
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/components/organisms/GamePinComponent/GamePinComponent.scss";
</style>
