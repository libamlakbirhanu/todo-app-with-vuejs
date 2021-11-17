<template>
  <div class="container w-96 mx-auto my-20 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ sharedState.language.lTitle }}
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
      </div>
      <div class="text-center mt-3 mb-3">
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
          {{ sharedState.language.login }}
        </button>
      </div>
      <label class="block text-center" for="psw"
        >{{ sharedState.language.question }}
        <router-link to="/register">{{
          sharedState.language.rLink
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
  name: "Login",
  data() {
    return {
      privateState: { email: "", password: "" },
      sharedState: store.state,
    };
  },
  created() {
    this.sharedState.isAuthenticated && this.$router.push({ name: "Home" });
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      const formData = {
        email: this.privateState.email.trim(),
        password: this.privateState.password.trim(),
      };
      try {
        axios
          .post(`${server.baseURL}/auth/login`, formData, {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          })
          .then((res) => {
            store.setCurrentUser(res.data);
            this.$router.push({ name: "Home" });
          })
          .catch((err) => console.error(err.response.data.message));
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style >
.inputs {
  padding: 10px;
}
a {
  color: rgb(236, 72, 153);
}
</style>