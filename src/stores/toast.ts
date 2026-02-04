import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", () => {
  const isToastActive = ref(false)

  const isProgress = ref(false)
  const message = ref<any>('')
  const timer1 = ref()
  const timer2 = ref()

  const toast = (msg?: string) => {
    if (isToastActive.value) {
      isToastActive.value = false;

      setTimeout(() => {
        isToastActive.value = true;
      }, 300);

    } else {

      if (msg) message.value = msg

      isToastActive.value = true;
    }
  }

  const showToast = () => {
    if (isToastActive.value) {
      setTimeout(() => {
        isProgress.value = true;
      }, 300)
    } else {
      isProgress.value = true;
      isToastActive.value = true;
    }

    timer1.value = setTimeout(() => {
      isToastActive.value = false;
    }, 3000); //1s = 1000 milliseconds

    timer2.value = setTimeout(() => {
      isProgress.value = false;
    }, 3300);
  }

  const closeToast = () => {
    isToastActive.value = false;

    setTimeout(() => {
      isProgress.value = false;
    }, 300);

    clearTimeout(timer1.value);
    clearTimeout(timer2.value);
  }

  watch(() => isToastActive.value, () => {
    if (isToastActive.value) showToast();
    else { closeToast() }
  })

  return {
    isToastActive,
    isProgress,
    timer1,
    timer2,
    showToast,
    closeToast,
    toast,
    message
  }
})
