<template>
  <div class="toast" :class="{ active: isToastActive }">
    <div class="toast-content">
      <i class="fas fa-solid fa-check check"></i>

      <div class="message">
        <p>Success</p>
        <span v-if="message">{{ message }}</span>
        <span v-else>Your changes has been saved</span>
      </div>
    </div>
    <i @click="closeToast" class="fa-solid fa-xmark close"></i>

    <div class="progress" :class="{ active: isProgress }"></div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "../../stores/toast";
import { storeToRefs } from "pinia";

const store = useToastStore();

const { closeToast } = store;
const { isToastActive, isProgress, message } = storeToRefs(store);
</script>

<style scoped lang="scss">
.toast {
  z-index: 99999;
  position: absolute;
  top: 25px;
  right: 30px;
  border-radius: 12px;
  background: #fff;
  padding: 20px 35px 20px 25px;
  overflow: hidden;
  transform: translateX(calc(100% + 300px));
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35);
  box-shadow: inset 0 0 0 1px var(--primary-900), 0 6px 12px rgba(#000, 0.15);
}

.toast.active {
  transform: translateX(0%);
}

.toast .toast-content {
  display: flex;
  align-items: center;
}

.toast-content .check {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  min-width: 35px;
  background-color: var(--primary-900);
  color: #fff;
  font-size: 20px;
  border-radius: 50%;
}

.toast-content .message {
  display: flex;
  flex-direction: column;
  margin: 0 20px;

  p {
    color: var(--black-900);
    font-weight: 600;
    font-size: var(--md-font);
  }

  span {
    font-size: var(--sm-font);
    color: var(--black-800);
  }
}

.toast .close {
  position: absolute;
  top: 10px;
  right: 15px;
  padding: 5px;
  cursor: pointer;
  opacity: 0.7;
}

.toast .close:hover {
  opacity: 1;
}

.toast .progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.35rem;
  width: 100%;
}

.toast .progress:before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background-color: var(--primary-900);
}

.progress.active:before {
  animation: progress 3s linear forwards;
}

@keyframes progress {
  100% {
    right: 100%;
  }
}

button {
  padding: 12px 20px;
  font-size: 20px;
  outline: none;
  border: none;
  background-color: var(--primary-900);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: var(--primary-900);
}

.toast.active~button {
  pointer-events: none;
}
</style>
