<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Navbar from "./components/Navbar.vue";
import { ref, onBeforeMount, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const showNavbar = computed(() => store.state.showNavbar);

// onBeforeMount(async () => {
//   store.dispatch("authCheck");
// });
</script>

<template>
  <Navbar v-show="showNavbar" />
  <router-view></router-view>
</template>

<style>
</style>
