<template>
    <img src="/src/assets/rocketOne.png" class="rocket rocket__2">
  <div class="begin-game">
  <h1>Sign in account</h1>
  <p><input type="text" placeholder="Email" v-model="email" class="inputBox"/></p>
  <p><input type="password" placeholder="Password" v-model="password" class="inputBox" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button @click="register" class="buttons">Submit</button></p>
  <p><button @click="signInWithGoogle" class="buttonsLink">Sign In With Google</button></p>
</div>
</template>
<script setup>
  import { ref } from "vue";
  import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import { useRouter } from "vue-router";

  const email = ref("");
  const password = ref("");
  const errMsg = ref("");
  const router = useRouter();

  const register = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Successfully signed in!");

        console.log(auth.currentUser);

        router.push("/start");
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case "auth/invalid-email":
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errMsg.value = "Wrong password";
            break;
          default:
            errMsg.value = "Email or password is incorrect";
        }
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

<style scoped >

.begin-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-top: -6rem;
}

</style>