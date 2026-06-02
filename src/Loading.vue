<template>
  <Transition name="fade">
    <div v-if="isloading" class="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center z-[9999]">
      <div class="bg-white/80 dark:bg-slate-900/80 p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl flex flex-col items-center max-w-xs w-full mx-4 animate-scaleUp">
        <!-- Spinner Ring -->
        <div class="relative flex items-center justify-center w-20 h-20 mb-4">
          <!-- Outer glowing circle -->
          <div class="absolute inset-0 rounded-full border-4 border-sky-500/10 border-t-sky-500 border-r-indigo-500 animate-spin"></div>
          <!-- Inner opposite spinning circle -->
          <div class="absolute w-12 h-12 rounded-full border-4 border-indigo-500/10 border-b-indigo-400 border-l-sky-400 animate-spin-reverse"></div>
          <!-- Centered icon/dot with pulse effect -->
          <div class="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-lg shadow-sky-400/50 animate-pulse"></div>
        </div>
        
        <!-- Loading Texts -->
        <h3 class="text-base font-bold text-slate-800 tracking-wide animate-pulse">
          ກຳລັງໂຫລດຂໍ້ມູນ...
        </h3>
        <p class="text-xs text-slate-400 mt-1.5 font-medium">
          ກະລຸນາລໍຖ້າຈັກໜ້ອຍ
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  isloading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
@keyframes spin-reverse {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
  }
}

.animate-scaleUp {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Vue Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>