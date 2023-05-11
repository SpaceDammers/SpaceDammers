<template>
  <div id="chat">
    <h2>Chat Room</h2>
    <div>
      <ul>
        <li v-for="(message, index) in messages" :key="index" :class="message.sender === 'self' ? 'right' : (message.sender === 'server' ? 'server' : 'left')"> {{ message.msg }} </li>
      </ul>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>
<script>
  import io from "socket.io-client";
  import SocketioService from "@/services/socketio.service";

  export default {
    data() {
      return {
        messages: [],
        newMessage: "",
        messageFrom: "",

        userId: null,
      };
    },
    setup() {
      const socket = new SocketioService();
      return { socket };
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
      this.socket.joinRoom(this.roomPin);

      // Listen for new messages
      this.socket.socket.on("message", (message) => {
        // this.messages.push({ msg: message, sender: "other" });
        console.log('id', message.id)
        // Check if the message is from the server
        if (message.id === "server") {
          this.messageFrom = "server";
          console.log("De server heeft een bericht gestuurd");
        } else {
          this.messageFrom = "other";
          console.log("De user heeft een bericht gestuurd");
          // return;
        }

        this.messages.push({ msg: message.msg, sender: this.messageFrom })
      });
    },
    methods: {
      sendMessage() {

        // send new message to server
        // this.socket.emit("message", this.newMessage);
        this.socket.sendMessage(this.newMessage, this.roomPin, this.userId);


        // add new message to messages list
        this.messages.push({ msg: this.newMessage, sender: 'self' });

        // clear input field
        this.newMessage = "";
      }
    },
  };
</script>
<style scoped>
  .right {
    text-align: right;
  }

  .left {
    text-align: left;
  }

  .server {
    text-align: center;
    color: gray;
    font-style: italic;
  }

  #chat {
    color: white;
    border: 3px solid #d90000;
    height: 100%;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }

  ul {
    height: 440px;
    width: 224px;
    font: 16px/26px Georgia, Garamond, Serif;
    overflow: auto;
    list-style: none;
    padding: 0;
  }
</style>