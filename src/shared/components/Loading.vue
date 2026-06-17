<template>
  <Transition name="fade">
    <div v-if="isloading" :class="[
      fullscreen ? 'fixed inset-0 bg-slate-950/50 backdrop-blur-xl z-[9999]' : 'absolute inset-0 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm z-[50]',
      'flex flex-col items-center justify-center'
    ]">
      <div :class="[
        fullscreen ? 'bg-white/80 dark:bg-slate-900/80 p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/30 max-w-[280px] w-full mx-4' : 'bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/40 max-w-[180px] w-full mx-4',
        'relative overflow-hidden backdrop-blur-xl flex flex-col items-center animate-scaleUp'
      ]">
        <!-- Thin top glowing line for extra premium feel -->
        <div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600"></div>

        <!-- Spinner Ring -->
        <div :class="[
          fullscreen ? 'w-20 h-20 mb-5' : 'w-12 h-12 mb-3',
          'relative flex items-center justify-center'
        ]">
          <!-- Glowing background aura -->
          <div :class="[
            fullscreen ? 'blur-md opacity-35' : 'blur-sm opacity-20',
            'absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 animate-pulse'
          ]"></div>
          
          <!-- Outer static track ring -->
          <div :class="[
            fullscreen ? 'border-4' : 'border-2',
            'absolute inset-0 rounded-full border-slate-100 dark:border-slate-800'
          ]"></div>
          
          <!-- Outer spinning gradient ring -->
          <div :class="[
            fullscreen ? 'border-4' : 'border-2',
            'absolute inset-0 rounded-full border-transparent border-t-sky-500 border-r-indigo-500 animate-spin'
          ]"></div>
          
          <!-- Inner counter-spinning gradient ring -->
          <div :class="[
            fullscreen ? 'w-12 h-12 border-4' : 'w-7 h-7 border-2',
            'absolute rounded-full border-transparent border-b-purple-500 border-l-pink-500 animate-spin-reverse opacity-80'
          ]"></div>
          
          <!-- Center glowing core -->
          <div :class="[
            fullscreen ? 'w-4 h-4 shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'w-2.5 h-2.5 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
            'rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center animate-pulse'
          ]">
            <div class="w-1 h-1 rounded-full bg-white opacity-85"></div>
          </div>
        </div>
        
        <!-- Loading Texts -->
        <h3 :class="[
          fullscreen ? 'text-sm font-bold text-slate-800 dark:text-slate-100' : 'text-xs font-semibold text-slate-700 dark:text-slate-200',
          'tracking-wide flex items-center gap-1.5'
        ]">
          ກຳລັງໂຫລດຂໍ້ມູນ
          <span class="inline-flex gap-0.5 items-center">
            <span class="w-1 h-1 rounded-full bg-sky-500 animate-dot-pulse-1"></span>
            <span class="w-1 h-1 rounded-full bg-indigo-500 animate-dot-pulse-2"></span>
            <span class="w-1 h-1 rounded-full bg-purple-500 animate-dot-pulse-3"></span>
          </span>
        </h3>
        <p v-if="fullscreen" class="text-2xs text-slate-400 dark:text-slate-500 mt-2 font-medium tracking-wide">
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
  fullscreen: {
    type: Boolean,
    default: true,
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
  animation: spin-reverse 1.2s linear infinite;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scaleUp {
  animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Custom bouncing pulse for the three dots */
@keyframes dot-pulse {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.animate-dot-pulse-1 {
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.animate-dot-pulse-2 {
  animation: dot-pulse 1.4s ease-in-out infinite;
  animation-delay: 0.2s;
}

.animate-dot-pulse-3 {
  animation: dot-pulse 1.4s ease-in-out infinite;
  animation-delay: 0.4s;
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

/* Custom extra-small font helper */
.text-2xs {
  font-size: 0.65rem;
}
</style>