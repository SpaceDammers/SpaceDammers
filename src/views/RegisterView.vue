<template>
    <img src="/src/assets/rocketTwo.png" class="rocket rocket__1">

  <div class="begin-game">
  <h1>Create an account</h1>
  <p><input type="text" placeholder="Email" v-model="email" class="inputBox"/></p>
  <p><input type="password" placeholder="Password" v-model="password" class="inputBox" /></p>
  <p><button @click="register" class="buttons">Submit</button></p>
  <p><button @click="signInWithGoogle" class="buttonsLink">Sign In With Google</button></p>
</div>
</template>
<script setup>
  import { ref } from "vue";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import { useRouter } from "vue-router";

  const email = ref("");
  const password = ref("");
  const router = useRouter();

  const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");

        console.log(auth.currentUser);

        router.push("/start");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        console.log(result);
        router.push("/feed");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
</script>

<style scoped>
.begin-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-top: -6rem;
}

.rocket__1 {
    right: 10%;
    top: 20%;
}
</style>