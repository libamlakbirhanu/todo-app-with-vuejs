<template>
  <div class="mt-20 mx-auto w-11/12 sm:w-4/5 flex flex-col">
    <div class="flex justify-center sm:justify-between mb-5 flex-wrap">
      <form @submit="displaySearchResults">
        <input
          class="
            bg-transparent
            border-b-2
            outline-none
            focus:border-pink-500
            text-pink-500
            p-1
            mr-2
            mb-5
          "
          type="text"
          :placeholder="sharedState.language.search"
          v-model="privateState.search"
          @keyup="clearSearchResults"
        />
      </form>
      <div class="flex gap-3 mb-5">
        <select
          name="filterOptions"
          id="filters"
          @change="displayFilterResults"
          class="px-1 py-0 text-gray-500"
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
            {{ sharedState.language.language }}
          </option>
          <option value="amh">amharic</option>
          <option value="en">english</option>
        </select>
      </div>
    </div>
    <form
      @submit="(e) => addTask(e, $refs.alertModal.openModal)"
      class="mb-5 flex flex-nowrap justify-around"
    >
      <input
        class="
          bg-transparent
          border-b-2
          outline-none
          w-4/5
          focus:border-pink-500
          text-pink-500
          p-1
          mr-2
        "
        type="text"
        :placeholder="sharedState.language.placeholder"
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
        {{ sharedState.language.add }}
      </button>
    </form>
    <div
      v-if="
        sharedState.isAuthenticated &&
        sharedState.currentUser.tasks &&
        sharedState.currentUser.tasks.length > 0
      "
    >
      <div
        v-for="task in sharedState.searchResults
          ? sharedState.searchResults
          : sharedState.filterResults
          ? sharedState.filterResults
          : sharedState.currentUser.tasks"
        :key="task.id"
      >
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
        task-width
        flex
        items-center
        justify-center
        m-auto
      "
    >
      <p class="text-gray-500 uppercase font-bold text-sm text-center">
        {{ sharedState.language.emptyTasks }}
      </p>
    </div>
  </div>

  <AlertModal ref="alertModal">
    <template v-slot:header>
      <h1 class="text-pink-600 uppercase font-extrabold text-sm m-auto">
        {{ sharedState.language.error }}
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
import store from "../store";
import Task from "../components/Task.vue";
import axios from "axios";
import { server } from "../helper";
import AlertModal from "./../components/AlertModal.vue";

export default {
  name: "Home",
  components: { Task, AlertModal },
  data() {
    return {
      privateState: { search: "", task: "", error: "" },
      sharedState: store.state,
    };
  },
  mounted() {
    !this.sharedState.loadingUser &&
      !this.sharedState.isAuthenticated &&
      this.$router.push({ name: "Login" });
    store.resetTasks();
  },
  methods: {
    displaySearchResults(e) {
      e.preventDefault();
      store.showSearchResults(this.privateState.search);
    },
    displayFilterResults(e) {
      store.showFilterResults(e.target.value);
    },
    changeLanguage(e) {
      store.selectLanguage(e.target.value);
    },
    clearSearchResults(e) {
      this.privateState.search === "" && store.clearSearchResults();
    },
    async addTask(e, cb) {
      e.preventDefault();

      try {
        axios
          .post(
            `${server.baseURL}/tasks`,
            { body: this.privateState.task.trim() },
            {
              headers: {
                "Content-type": "application/json",
              },
              withCredentials: true,
            }
          )
          .then((res) => {
            store.addTask({ ...res.data });
            this.privateState.task = "";
          })
          .catch((err) => {
            this.privateState.error = err.response.data.message[0];
            cb();
          });
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style>
.task-width {
  max-width: 450px;
}
</style>