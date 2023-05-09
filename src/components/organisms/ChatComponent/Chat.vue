<template>
  <div>
    <div>
      <!-- Alle messages -->
      <ul>
        <li
          v-for="(message, index) in messages"
          :key="index"
          :class="message.sender === 'self' ? 'right' : 'left'"
        >
          {{ message.msg }}
        </li>
      </ul>
    </div>
    <!-- Input and send -->
    <form @submit.prevent="sendMessage">
      <div>
        <div>
          <!-- Input field -->
          <input type="text" v-model="newMessage" />
        </div>
        <div>
          <!-- Send button -->
          <button type="submit">Send</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import SocketioService from "@/services/socketio.service";
export default {
  name: "ChatComponent",
  data() {
    return {
      messages: [],
      newMessage: "",
      roomPin: "",

      userId: null,
    };
  },
  setup() {
    const IOserver = new SocketioService();
    return { IOserver };
  },
  created() {
    // Check if roomPin is in session storage
    if (!sessionStorage.getItem("roomPin")) {
      this.$router.push({ name: "home" });
    }

    // Get roomPin and userId from session storage
    this.roomPin = sessionStorage.getItem("roomPin");
    this.userId = sessionStorage.getItem("name");

    // Join room
    this.IOserver.joinRoom(this.roomPin);

    // Listen for new messages
    this.IOserver.socket.on("message", (message) => {
      this.messages.push({ msg: message, sender: "other" });
    });
  },
  methods: {
    async sendMessage() {
      // send message to server
      this.IOserver.sendMessage(this.newMessage, this.roomPin, this.userId);

      // add new message to messages list
      this.messages.push({ msg: this.newMessage, sender: "self" });

      // // clear input field
      this.newMessage = "";
    },
  },
};
</script>

<style lang="scss">
@import "@/components/organisms/ChatComponent/Chat.scss";
</style>
