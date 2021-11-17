<template>
  <div
    :class="[
      !task.completed
        ? 'bg-pink-100 rounded px-5 py-3 mb-5 shadow-md task-width flex gap-3'
        : 'bg-pink-100 rounded px-5 py-3 mb-5 shadow-md task-width flex gap-3 border-r-8 border-green-500',
    ]"
  >
    <div
      :class="[
        task.completed
          ? 'flex items-center flex-col gap-3 justify-center'
          : 'flex items-center flex-col gap-3 justify-between',
      ]"
    >
      <button @click="() => removeTask(task.id)">
        <font-awesome-icon icon="trash-alt" size="lg" class="text-pink-400" />
      </button>
      <button
        v-show="!task.completed"
        @click="() => markTaskComplete(task.id, $refs.alertModal.openModal)"
      >
        <font-awesome-icon
          icon="check-circle"
          size="lg"
          class="text-green-400"
        />
      </button>
    </div>
    <div
      class="flex-grow flex flex-col justify-around cursor-pointer"
      @click="$refs.detailModal.openModal()"
    >
      <p class="text-gray-500 uppercase font-bold text-sm">{{ task.body }}</p>
      <p class="text-gray-400 text-xs mt-2">
        {{ displayFromNow(task.createdAt) }}
      </p>
    </div>
    <font-awesome-icon
      icon="edit"
      size="lg"
      class="text-gray-400 cursor-pointer"
      @click="$refs.editModal.openModal()"
    />
    <Modal ref="detailModal">
      <template v-slot:header>
        <h1 class="text-gray-600 uppercase font-extrabold text-sm">
          {{ sharedState.language.task }}
        </h1>
      </template>

      <template v-slot:body>
        <p class="text-gray-500 uppercase font-bold text-sm">
          {{ task.body }}
        </p>
      </template>

      <template v-slot:status>
        <p
          :class="[
            task.completed
              ? 'text-green-500 uppercase font-bold text-sm mt-3'
              : 'text-pink-500 uppercase font-bold text-sm mt-3',
          ]"
        >
          {{ task.completed ? "COMPLETE" : "INCOMPLETE" }}
        </p>
      </template>

      <template v-slot:date>
        <p class="text-gray-400 uppercase font-bold text-sm mt-3">
          {{ dateFormat(task.createdAt) }}
        </p>
      </template>
    </Modal>
    <EditModal ref="editModal">
      <template v-slot:header>
        <h1 class="text-gray-600 uppercase font-extrabold text-sm">
          {{ sharedState.language.editTask }}
        </h1>
      </template>

      <template v-slot:body>
        <form
          class="mb-5"
          @submit="
            (e) =>
              editTask(
                e,
                task.id,
                $refs.editModal.closeModal,
                privateState.editTask
              )
          "
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
            "
            type="text"
            :placeholder="task.body"
            v-model="privateState.editTask"
            required
          />
          <button
            type="submit"
            class="
              bg-pink-500
              hover:bg-pink-700
              px-4
              py-2
              mt-5
              font-bold
              rounded
              text-white
              shadow-md
              block
            "
          >
            {{ sharedState.language.cancel }}
          </button>
        </form>
      </template>
    </EditModal>
  </div>

  <AlertModal ref="alertModal">
    <template v-slot:header>
      <h1 class="text-green-600 uppercase font-extrabold text-sm m-auto">
        congragulations
      </h1>
    </template>

    <template v-slot:body>
      <p class="text-gray-500 uppercase font-bold text-sm text-center">
        way to crush a task. be proud of yourself
      </p>
    </template>
  </AlertModal>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import store from "../store";
import axios from "axios";
import { server } from "../helper";
import Modal from "./Modal.vue";
import EditModal from "./EditModal.vue";
import AlertModal from "./AlertModal.vue";

export default {
  name: "Task",
  props: ["task"],
  data() {
    return {
      privateState: { task: "", editTask: "" },
      sharedState: store.state,
    };
  },
  components: { Modal, EditModal, AlertModal },
  created() {
    dayjs.extend(relativeTime);
  },
  methods: {
    dateFormat: (date) => {
      return dayjs(date);
    },

    displayFromNow: (date) => {
      return dayjs(date).fromNow();
    },

    editTask(e, id, cb) {
      e.preventDefault();

      axios
        .patch(
          `${server.baseURL}/tasks/${id}`,
          { body: this.privateState.editTask.trim() },
          {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          store.editTask(id, { ...res.data.task });
          this.privateState.editTask = "";
          cb();
        })
        .catch((err) => console.error(err.response.data.message));
    },

    removeTask: (id) => {
      axios
        .delete(`${server.baseURL}/tasks/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          store.removeTask(id);
        })
        .catch((err) => console.log(err.response));
    },

    markTaskComplete: (id, cb) => {
      axios
        .patch(
          `${server.baseURL}/tasks/complete/${id}`,
          {},
          {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          store.markTaskComplete(id);
          cb();
        })
        .catch((err) => console.log(err.response.data.message));
    },
  },
};
</script>