<template>
  <div
    class="
      flex
      fixed
      justify-between
      top-0
      items-center
      bg-pink-600
      w-full
      h-14
      px-20
    "
  >
    <h1 class="text-white font-bold">Logo</h1>
    <div class="flex">
      <h1 class="text-white font-bold cursor-pointer mr-3">
        {{ sharedState.currentUser.username }}
      </h1>
      <h1 class="text-white font-bold cursor-pointer" @click="logout">
        {{ sharedState.language.logout }}
      </h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { server } from "../helper";
import store from "../store";

export default {
  name: "Navbar",
  data() {
    return {
      sharedState: store.state,
    };
  },
  methods: {
    logout() {
      axios
        .post(`${server.baseURL}/auth/logout`, null, {
          withCredentials: true,
        })
        .then((res) => {
          store.removeCurrentUser();
          this.$router.push("/");
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>