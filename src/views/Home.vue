<template>
  <div class="flex justify-end gap-3 mb-5 mt-20 mr-5 sm:mr-20">
    <select
      name="filterOptions"
      id="filters"
      @change="displayFilterResults"
      class="px-1 py-0 text-gray-500"
      v-show="$store.state.isAuthenticated"
    >
      <option value="all">all</option>
      <option value="complete">complete</option>
      <option value="incomplete">incomplete</option>
    </select>
    <select
      name="languages"
      id="languages"
      @change="changeLanguage"
      class="p-2 text-gray-500"
    >
      <option value="none" selected disabled hidden>
        {{ $store.state.language.language }}
      </option>
      <option value="amh">amharic</option>
      <option value="en">english</option>
    </select>
  </div>
  <div class="mx-auto w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 flex flex-col">
    <form
      @submit.prevent="(e) => addTask(e, $refs.alertModal.openModal)"
      class="mb-5 flex flex-nowrap justify-between w-full"
    >
      <input
        class="
          bg-transparent
          border-b-2
          outline-none
          focus:border-pink-500
          text-pink-500
          p-1
          mr-3
          w-3/4
        "
        type="text"
        :placeholder="$store.state.language.placeholder"
        v-model="privateState.task"
        required
      />
      <button
        type="submit"
        class="
          bg-pink-500
          hover:bg-pink-700
          px-5
          font-bold
          rounded
          text-white
          shadow-md
        "
      >
        {{ $store.state.language.add }}
      </button>
    </form>
    <div v-if="authenticatedAndHasTasks" class="flex justify-center flex-col">
      <div v-for="task in activeList" :key="task.id">
        <Task :task="task" />
      </div>
    </div>
    <div
      v-else
      class="
        bg-pink-100
        rounded
        sm:px-20
        px-10
        py-10
        mt-10
        shadow-md
        flex
        items-center
        justify-center
        m-auto
      "
    >
      <p class="text-gray-500 uppercase font-bold text-sm text-center">
        {{ $store.state.language.emptyTasks }}
      </p>
    </div>
  </div>

  <AlertModal ref="alertModal">
    <template v-slot:header>
      <h1 class="text-pink-600 uppercase font-extrabold text-sm m-auto">
        {{ $store.state.language.error }}
      </h1>
    </template>

    <template v-slot:body>
      <p class="text-gray-500 uppercase font-bold text-sm text-center">
        {{ privateState.error }}
      </p>
    </template>
  </AlertModal>
</template>

<script>
import Task from "../components/Task.vue";
import axios from "axios";
import AlertModal from "./../components/AlertModal.vue";

export default {
  name: "Home",
  components: { Task, AlertModal },
  data() {
    return {
      privateState: { task: "", error: "" },
    };
  },
  beforeCreate() {
    // !this.$store.state.isAuthenticated && this.$router.push({ name: "Login" });
  },
  created() {
    this.$store.commit("showNavbar", this.$router.currentRoute._value.path);
  },
  mounted() {
    this.$store.commit("resetTasks");
  },
  computed: {
    authenticatedAndHasTasks() {
      return (
        this.$store.state.isAuthenticated &&
        this.$store.state.currentUser.tasks &&
        this.$store.state.currentUser.tasks.length > 0
      );
    },
    activeList() {
      return this.$store.state.searchResults
        ? this.$store.state.searchResults
        : this.$store.state.filterResults
        ? this.$store.state.filterResults
        : this.$store.state.currentUser.tasks;
    },
  },
  methods: {
    displayFilterResults(e) {
      this.$store.commit("showFilterResults", e.target.value);
    },
    changeLanguage(e) {
      this.$store.commit("selectLanguage", e.target.value);
    },
    async addTask(e, cb) {
      this.$store.dispatch("addTask", { cb, task: this.privateState.task });
      this.privateState.task = "";
    },
  },
};
</script>

<style>
.task-width {
  max-width: 450px;
}
</style>