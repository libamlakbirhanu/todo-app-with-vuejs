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
      sm:px-20
      px-5
    "
  >
    <h1 class="text-white font-bold">Logo</h1>
    <form @submit.prevent="displaySearchResults" class="flex">
      <input
        class="
          bg-transparent
          w-3/4
          border-b-2
          outline-none
          focus:border-pink-800
          text-gray-300
          m-auto
          px-1
        "
        type="text"
        :placeholder="$t('message.search')"
        v-model="privateState.search"
        @keyup="clearSearchResults"
      />
    </form>
    <div class="flex">
      <h1
        v-show="$store.state.isAuthenticated"
        class="text-white font-bold cursor-pointer mr-3"
      >
        {{ $store.state.currentUser && $store.state.currentUser.username }}
      </h1>
      <h1
        v-if="$store.state.isAuthenticated"
        class="text-white font-bold cursor-pointer"
        @click="logout"
      >
        {{ $t("message.logout") }}
      </h1>
      <div v-else class="flex gap-3">
        <h1
          class="text-white font-bold cursor-pointer"
          @click="() => $router.push({ name: 'Login' })"
        >
          {{ $t("message.login") }}
        </h1>
        <h1
          class="text-white font-bold cursor-pointer"
          @click="() => $router.push({ name: 'Register' })"
        >
          {{ $t("message.register") }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import store from "storejs";

export default {
  name: "Navbar",
  data() {
    return {
      privateState: { search: "" },
    };
  },
  methods: {
    displaySearchResults(e) {
      this.privateState.search !== "" &&
        this.$store.commit("showSearchResults", this.privateState.search);
    },
    clearSearchResults(e) {
      this.privateState.search === "" &&
        this.$store.commit("clearSearchResults");
    },
    logout() {
      store.set("accessToken", "");
      this.$store.commit("removeCurrentUser");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>