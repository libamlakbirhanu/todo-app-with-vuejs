<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Navbar from "./components/Navbar.vue";
import store from "./store";
import { server } from "./helper";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const sharedState = ref(store.state);
const router = useRouter();
const route = useRoute();
const state = computed(() => sharedState.value);

const authCheck = function () {
  store.selectLanguage("amh");
  axios
    .post(`${server.baseURL}/auth/authcheck`, null, {
      withCredentials: true,
    })
    .then((res) => {
      store.setCurrentUser(res.data);
      store.toggleLoadingUser();
      route.path === "/" && router.push({ name: "Home" });
    })
    .catch((err) => console.error(err));
};
onMounted(authCheck);
</script>

<template>
  <Navbar v-if="sharedState.isAuthenticated" />
  <router-view></router-view>
</template>

<style>
</style>
