<template>
  <div
    v-if="privateState.error"
    class="absolute top-5 left-5 text-red-500 flex gap-2 items-center"
  >
    <font-awesome-icon icon="flag" size="lg" class="text-red-500" />
    <p class="bg-gray-300 p-2">{{ privateState.error }}</p>
  </div>
  <div class="container max-w-md mx-auto my-10 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ $t("message.rTitle") }}
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5"></div>
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col my-5">
        <label class="my-2" for="uname">{{ $t("message.email") }}</label>
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
        <label class="my-2" for="uname">{{ $t("message.username") }}</label>
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
        />
        <p v-if="v$.privateState.username.$error" class="text-red-500 text-sm">
          {{
            v$.privateState.username.$errors[0].$message.replace(
              "Value",
              "Username"
            )
          }}
        </p>
        <label class="my-2" for="psw">{{ $t("message.password") }}</label>
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
        <label class="my-2" for="psw">{{
          $t("message.confirmPassword")
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
        />
        <p
          v-if="v$.privateState.confirmPassword.$error"
          class="text-red-500 text-sm"
        >
          {{
            v$.privateState.confirmPassword.$errors[0].$message.replace(
              "Value",
              "Confirm Password"
            )
          }}
        </p>
      </div>
      <div class="text-center my-3">
        <button
          type="reset"
          class="px-7 py-2 mx-2 font-semibold text-gray-800 bg-gray-100 rounded"
        >
          {{ $t("message.reset") }}
        </button>
        <button
          type="submit"
          class="px-7 py-2 mx-2 font-semibold text-white bg-pink-600 rounded"
        >
          {{ $t("message.register") }}
        </button>
      </div>
      <label class="text-center block" for="psw"
        >{{ $t("message.question2") }}
        <router-link to="/">{{ $t("message.login") }}</router-link></label
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, minLength } from "@vuelidate/validators";

export default {
  name: "Register",
  data() {
    return {
      v$: useVuelidate(),
      privateState: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
      },
    };
  },
  created() {
    this.$store.commit("showNavbar", this.$router.currentRoute._value.path);
  },
  validations() {
    return {
      privateState: {
        password: { required, minLength: minLength(8) },
        email: { required, email },
        username: { required },
        confirmPassword: {
          required,
          sameAs: sameAs(this.privateState.password),
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      const formData = {
        username: this.privateState.username.trim(),
        password: this.privateState.password.trim(),
        confirmPassword: this.privateState.confirmPassword.trim(),
        email: this.privateState.email.trim(),
      };
      this.v$.$validate();
      if (!this.v$.$error) {
        this.$store
          .dispatch("register", {
            formData,
            routeToLogin: () => this.$router.push({ name: "Login" }),
          })
          .catch((err) => {
            this.privateState.error = err.response.data.message;
            setTimeout(() => {
              this.privateState.error = "";
            }, 2000);
          });
      }
    },
  },
};
</script>

<style>
</style>