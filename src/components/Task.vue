<template>
  <div
    :class="[
      !task.completed
        ? 'bg-pink-100 rounded px-5 py-3 mb-5 shadow-md  flex gap-3'
        : 'bg-pink-100 rounded px-5 py-3 mb-5 shadow-md  flex gap-3 border-r-8 border-green-500',
    ]"
  >
    <div
      :class="[
        task.completed
          ? 'flex items-center flex-col gap-3 justify-center'
          : 'flex items-center flex-col gap-3 justify-between',
      ]"
    >
      <button @click="$refs.deleteModal.openModal">
        <font-awesome-icon icon="trash-alt" size="lg" class="text-pink-400" />
      </button>
      <button v-if="task.completed">
        <font-awesome-icon
          icon="check-circle"
          size="lg"
          class="text-green-400"
        />
      </button>
      <button v-else @click="() => markTaskComplete(task.id)">
        <font-awesome-icon
          icon="check-circle"
          size="lg"
          class="text-gray-400"
        />
      </button>
    </div>
    <div
      class="flex-grow flex flex-col justify-around cursor-pointer"
      @click="$refs.detailModal.openModal()"
    >
      <p
        :class="[
          !task.completed
            ? 'text-gray-500 uppercase font-bold text-sm'
            : 'text-gray-500 uppercase font-bold text-sm line-through',
        ]"
      >
        {{ task.body }}
      </p>
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
          {{ $store.state.language.task }}
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
          {{ $store.state.language.editTask }}
        </h1>
      </template>

      <template v-slot:body>
        <form
          class="mb-5"
          @submit.prevent="editTask(task.id, $refs.editModal.closeModal)"
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
            v-model="privateState.editTask"
          />
          <p
            v-if="v$.privateState.editTask.$error"
            class="text-red-500 text-sm"
          >
            {{ v$.privateState.editTask.$errors[0].$message }}
          </p>
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
            {{ $store.state.language.submit }}
          </button>
        </form>
      </template>
    </EditModal>
  </div>

  <DeleteModal ref="deleteModal">
    <template v-slot:header>
      <h1 class="text-pink-600 uppercase font-extrabold text-sm m-auto">
        {{ $store.state.language.alert }}
      </h1>
    </template>

    <template v-slot:body>
      <p class="text-gray-500 uppercase font-bold text-sm text-center">
        {{ $store.state.language.deletePrompt }}
      </p>
    </template>
    <template v-slot:actions>
      <button @click="$refs.deleteModal.closeModal" class="text-green-400">
        {{ $store.state.language.cancel }}
      </button>
      <button
        @click="() => removeTask(task.id, $refs.deleteModal.closeModal)"
        class="text-pink-500"
      >
        {{ $store.state.language.delete }}
      </button>
    </template>
  </DeleteModal>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import Modal from "./Modal.vue";
import EditModal from "./EditModal.vue";
import AlertModal from "./AlertModal.vue";
import DeleteModal from "./DeleteModal.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "Task",
  props: ["task"],
  data: function () {
    return {
      v$: useVuelidate(),
      privateState: { task: "", editTask: this.task.body, error: "" },
    };
  },
  validations() {
    return {
      privateState: {
        editTask: { required },
      },
    };
  },
  components: { Modal, EditModal, AlertModal, DeleteModal },
  created() {
    console.log(this.task.body);
    dayjs.extend(relativeTime);
  },
  methods: {
    dateFormat: (date) => {
      return dayjs(date);
    },

    displayFromNow: (date) => {
      return dayjs(date).fromNow();
    },

    editTask(id, cb) {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.$store.dispatch("editTask", {
          id,
          task: this.privateState.editTask,
          cb,
        });
      }
    },

    removeTask(id, cb) {
      this.$store.dispatch("removeTask", { id, cb });
    },

    markTaskComplete(id) {
      this.$store.dispatch("markTaskComplete", id);
    },
  },
};
</script>