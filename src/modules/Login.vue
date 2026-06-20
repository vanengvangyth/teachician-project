<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <!-- CARD -->
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

      <!-- HEADER -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-slate-800">
          ເຂົ້າສູ່ລະບົບ
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          ເຂົ້າສູ່ລະບົບແອັດມິນ
        </p>
      </div>

      <!-- FORM -->
      <div class="space-y-4">
        <!-- EMAIL -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            ອີເມວ
          </label>
          <input
            v-model="email"
            v-bind="emailProps"
            type="email"
            placeholder="your@gmail.com"
            class="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200 transition"
            :class="emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-sky-500'"
          />
          <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            ລະຫັດຜ່ານ
          </label>
          <div class="relative">
            <input
              v-model="password"
              v-bind="passwordProps"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-lg border pl-4 pr-10 py-2 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-sky-200"
              :class="passwordError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-sky-500'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              title="ສະແດງ/ຊ່ອນລະຫັດຜ່ານ"
            >
              <Eye v-if="showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
        </div>

        <!-- BUTTON -->
        <button
          @click="onSubmit"
          type="button"
          class="w-full rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition cursor-pointer"
        >
          ເຂົ້າສູ່ລະບົບ
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
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


