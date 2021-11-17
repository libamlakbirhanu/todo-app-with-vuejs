<template>
  <div class="container w-96 mx-auto my-10 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ sharedState.language.rTitle }}
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5"></div>
    <form @submit="handleSubmit">
      <div class="flex flex-col my-5">
        <label class="my-2" for="uname">{{ sharedState.language.email }}</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="privateState.email"
          class="
            mt-1
            mb-3
            shadow-md
            border-none
            focus:ring-transparent
            rounded-sm
            bg-gray-100
            text-pink-500
            inputs
          "
          required
        />
        <label class="my-2" for="uname">{{
          sharedState.language.username
        }}</label>
        <input
          type="text"
          id="uname"
          name="uname"
          v-model="privateState.username"
          class="
            mt-1
            mb-3
            shadow-md
            border-none
            focus:ring-transparent
            rounded-sm
            bg-gray-100
            text-pink-500
            inputs
          "
          required
        />
        <label class="my-2" for="psw">{{
          sharedState.language.password
        }}</label>
        <input
          type="password"
          id="psw"
          name="psw"
          v-model="privateState.password"
          class="
            mt-1
            mb-3
            shadow-md
            border-none
            focus:ring-transparent
            rounded-sm
            bg-gray-100
            text-pink-500
            inputs
          "
          required
        />
        <label class="my-2" for="psw">{{
          sharedState.language.confirmPassword
        }}</label>
        <input
          type="password"
          id="confpsw"
          name="confpsw"
          v-model="privateState.confirmPassword"
          class="
            mt-1
            mb-3
            shadow-md
            border-none
            focus:ring-transparent
            rounded-sm
            bg-gray-100
            text-pink-500
            inputs
          "
          required
        />
      </div>
      <div class="text-center my-3">
        <button
          type="reset"
          class="px-7 py-2 mx-2 font-semibold text-gray-800 bg-gray-100 rounded"
        >
          {{ sharedState.language.reset }}
        </button>
        <button
          type="submit"
          class="px-7 py-2 mx-2 font-semibold text-white bg-pink-600 rounded"
        >
          {{ sharedState.language.register }}
        </button>
      </div>
      <label class="text-center block" for="psw"
        >{{ sharedState.language.question2 }}
        <router-link to="/">{{
          sharedState.language.login
        }}</router-link></label
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { server } from "../helper";
import store from "../store";

export default {
  name: "Register",
  data() {
    return {
      sharedState: store.state,
      privateState: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      const formData = {
        username: this.privateState.username.trim(),
        password: this.privateState.password.trim(),
        confirmPassword: this.privateState.confirmPassword.trim(),
        email: this.privateState.email.trim(),
      };
      console.log(formData);
    },
  },
};
</script>

<style>
</style>