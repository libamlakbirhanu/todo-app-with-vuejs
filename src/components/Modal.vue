<template>
  <transition name="fade">
    <div class="modal" v-if="show">
      <div class="modal__backdrop" @click="closeModal()" />

      <div class="modal__dialog">
        <div class="modal__header">
          <slot name="header" />
          <button type="button" class="modal__close" @click="closeModal()">
            <span class="font-extrabold text-pink-400"
              ><font-awesome-icon icon="times" size="lg"
            /></span>
          </button>
        </div>

        <div class="modal__body">
          <slot name="body" />
        </div>

        <div class="modal__footer">
          <h1 class="font-bold text-gray-600 uppercase">
            {{ $t("message.status") }}
          </h1>
          <slot name="status" />
        </div>

        <div class="modal__footer">
          <h1 class="font-bold text-gray-600 uppercase">
            {{ $t("message.date") }}
          </h1>
          <slot name="date" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import store from "./../VueXStore";

export default {
  name: "Modal",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    },
  },
};
</script>


<style scoped>
.modal {
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
}
.modal__backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
.modal__dialog {
  background-color: #ffffff;
  position: relative;
  width: 600px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  z-index: 2;
}
.modal__close {
  width: 30px;
  height: 30px;
}
.modal__header {
  padding: 20px 20px 0px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.modal__body {
  padding: 10px 20px 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal__footer {
  padding: 10px 20px 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .modal__dialog {
    width: 90%;
  }
}
</style>