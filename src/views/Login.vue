<template>
  <div class="container max-w-md mx-auto my-20 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ $store.state.language.lTitle }}
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5"></div>

    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col my-5">
        <div v-if="privateState.error !== ''">
          <p class="border-2 text-center text-red-500 rounded p-2">
            {{ privateState.error }}
          </p>
        </div>
        <label class="my-2" for="uname">{{
          $store.state.language.email
        }}</label>
        <input
          type="text"
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
        />
        <p v-if="v$.privateState.email.$error" class="text-red-500 text-sm">
          {{
            v$.privateState.email.$errors[0].$message.replace("Value", "Email")
          }}
        </p>
        <label class="my-2" for="psw">{{
          $store.state.language.password
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
        />
        <p v-if="v$.privateState.password.$error" class="text-red-500 text-sm">
          {{
            v$.privateState.password.$errors[0].$message.replace(
              "Value",
              "Password"
            )
          }}
        </p>
      </div>
      <div class="text-center mt-3 mb-3">
        <button
          type="reset"
          class="px-7 py-2 mx-2 font-semibold text-gray-800 bg-gray-100 rounded"
        >
          {{ $store.state.language.reset }}
        </button>
        <button
          type="submit"
          class="px-7 py-2 mx-2 font-semibold text-white bg-pink-600 rounded"
        >
          {{ $store.state.language.login }}
        </button>
      </div>
      <label class="block text-center" for="psw"
        >{{ $store.state.language.question }}
        <router-link to="/register">{{
          $store.state.language.rLink
        }}</router-link></label
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import AlertModal from "./../components/AlertModal.vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

export default {
  name: "Login",
  data() {
    return {
      v$: useVuelidate(),
      privateState: { email: "", password: "", error: "" },
    };
  },
  validations() {
    return {
      privateState: {
        password: { required },
        email: { required, email },
      },
    };
  },
  components: { AlertModal },
  created() {
    this.$store.commit("showNavbar", this.$router.currentRoute._value.path);
  },
  methods: {
    handleSubmit(e) {
      this.v$.$validate();
      if (!this.v$.$error) {
        const formData = {
          email: this.privateState.email.trim(),
          password: this.privateState.password.trim(),
        };
        this.$store.dispatch("login", {
          formData,
          routeToHome: () => this.$router.push({ name: "Home" }),
        });

        this.privateState.error = "Incorrect credentials";
        setTimeout(() => {
          this.privateState.error = "";
        }, 1500);
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