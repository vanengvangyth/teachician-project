<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <!-- CARD -->
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

      <!-- HEADER -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-slate-800">
          Login
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Sign in to your account
        </p>
      </div>

      <!-- FORM -->
      <div class="space-y-4">
        <!-- EMAIL -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
          />
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
          />
        </div>

        <!-- BUTTON -->
        <button
          @click="submit"
          type="button"
          class="w-full rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
        >
          Login
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

import { useAuthStore } from "../stores/auth";
const store = useAuthStore();
const { login } = store;

const form = reactive({
  email: "",
  password: "",
});
// console.log("login", form)

const submit = () => {
  login(form);
};
</script>


