<template>
  <div class="min-h-screen relative flex items-center justify-center bg-slate-50/60 overflow-hidden px-4 select-none">
    
    <!-- Animated background blobs (Light mode style) -->
    <div class="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-sky-100/70 blur-[80px] pointer-events-none animate-float-1"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-indigo-100/60 blur-[80px] pointer-events-none animate-float-2"></div>
    <div class="absolute top-[30%] right-[15%] w-[250px] h-[250px] rounded-full bg-violet-100/50 blur-[60px] pointer-events-none animate-float-3"></div>

    <!-- Login card container with entry animation -->
    <div class="w-full max-w-[440px] z-10 animate-fade-in">
      
      <!-- Premium Light Card -->
      <div class="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)] transition-all duration-500">
        
        <!-- Logo / Icon -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 mb-4 transform hover:rotate-6 transition-transform duration-300">
            <LogIn class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-800">
            ເຂົ້າສູ່ລະບົບ
          </h1>
          <p class="text-sm text-slate-400 mt-2 font-medium">
            ລະບົບຈັດການຂໍ້ມູນຫຼັງບ້ານ (Admin Panel)
          </p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          
          <!-- EMAIL -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 pl-1">
              ອີເມວແອັດ
            </label>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors duration-200">
                <Mail class="w-4 h-4" />
              </span>
              <input
                v-model="email"
                v-bind="emailProps"
                type="email"
                placeholder="example@domain.com"
                class="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300"
                :class="emailError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''"
              />
            </div>
            <transition name="slide-fade">
              <p v-if="emailError" class="text-xs text-rose-500 flex items-center gap-1.5 mt-1 pl-1">
                <ShieldAlert class="w-3.5 h-3.5 shrink-0" />
                {{ emailError }}
              </p>
            </transition>
          </div>

          <!-- PASSWORD -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 pl-1">
              ລະຫັດຜ່ານ
            </label>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors duration-200">
                <Lock class="w-4 h-4" />
              </span>
              <input
                v-model="password"
                v-bind="passwordProps"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300"
                :class="passwordError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-sky-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                title="ສະແດງ/ຊ່ອນລະຫັດຜ່ານ"
              >
                <Eye v-if="showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <transition name="slide-fade">
              <p v-if="passwordError" class="text-xs text-rose-500 flex items-center gap-1.5 mt-1 pl-1">
                <ShieldAlert class="w-3.5 h-3.5 shrink-0" />
                {{ passwordError }}
              </p>
            </transition>
          </div>

          <!-- SUBMIT BUTTON -->
          <button
            type="submit"
            class="w-full mt-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-sm font-semibold text-white py-3.5 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
          >
            ເຂົ້າສູ່ລະບົບ
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-slate-400 font-medium">
            © 2026 Graduation Portal.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Eye, EyeOff, Mail, Lock, LogIn, ShieldAlert } from "lucide-vue-next";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

import { useAuthStore } from "../stores/auth";
const store = useAuthStore();
const { login } = store;

const showPassword = ref(false);

const loginSchema = yup.object({
  email: yup.string().email("ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ").required("ກະລຸນາໃສ່ອີເມວ"),
  password: yup.string().min(6, "ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 6 ຕົວ").required("ກະລຸນາໃສ່ລະຫັດຜ່ານ"),
});

const { handleSubmit, defineField } = useForm({
  validationSchema: loginSchema,
  initialValues: { email: "", password: "" },
});

const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");

const { errorMessage: emailError } = useField("email");
const { errorMessage: passwordError } = useField("password");

const onSubmit = handleSubmit(async (values) => {
  login(values);
});
</script>

<style scoped>
@keyframes float-1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translate(0, 0) scale(1.1);
  }
  50% {
    transform: translate(-40px, 20px) scale(0.9);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-20px, -40px) scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float-1 {
  animation: float-1 12s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 15s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 10s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-4px);
  opacity: 0;
}
</style>
