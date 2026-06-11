<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
    <!-- TOP BAR -->
    <div class="max-w-5xl mx-auto flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-slate-800">ລາຍລະອຽດແຈ້ງການ</h1>
          <p class="text-xs text-slate-400 mt-0.5">ID: #{{ item?.id }}</p>
        </div>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div v-if="item" class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT COLUMN: Recipient & Status (col-span-1) -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Recipient Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-sky-100 mb-4">
            {{ item.user?.fullName?.charAt(0).toUpperCase() || "U" }}
          </div>
          <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ຜູ້ຮັບແຈ້ງການ</span>
          <h2 class="text-lg font-bold text-slate-800 leading-tight">
            {{ item.user?.fullName || item.user?.email || '-' }}
          </h2>
          <p class="text-xs text-slate-500 mt-1">User ID: #{{ item.userId }}</p>
        </div>

        <!-- Status Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 text-center">
          <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ສະຖານະການອ່ານ</span>
          <div class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
            :class="item.isRead ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'">
            <span class="w-2.5 h-2.5 rounded-full" :class="item.isRead ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'"></span>
            {{ item.isRead ? "ໄດ້ອ່ານແລ້ວ" : "ຍັງບໍ່ໄດ້ອ່ານ" }}
          </div>
        </div>

        <!-- Metadata Info Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 space-y-4">
          <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">ຂໍ້ມູນລະບົບ</span>
          
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">ປະເພດແຈ້ງການ</span>
            <span class="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold">{{ item.type || "-" }}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">Reference ID</span>
            <span class="font-mono text-slate-700 font-bold">#{{ item.referenceId ?? "-" }}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">ວັນທີສ້າງ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.createdAt) }}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">ອັບເດດຫຼ້າສຸດ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Message Contents (col-span-2) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-8 space-y-6">
          
          <!-- Content Header -->
          <div class="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-800">ເນື້ອຫາແຈ້ງການ</h3>
          </div>

          <!-- LAO TITLE -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-3.5 bg-gradient-to-r from-blue-700 via-red-600 to-blue-700 rounded-sm"></span> <!-- Lao Flag Mockup -->
              <span class="text-xs text-sky-600 font-bold uppercase tracking-wider">ຫົວຂໍ້ (ພາສາລາວ)</span>
            </div>
            <p class="text-lg font-bold text-slate-800 font-sans">
              {{ item.titleLao || "-" }}
            </p>
          </div>

          <!-- ENGLISH TITLE -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-3.5 bg-gradient-to-r from-red-600 via-white to-blue-800 rounded-sm"></span> <!-- UK Flag Mockup -->
              <span class="text-xs text-indigo-600 font-bold uppercase tracking-wider">Title (English)</span>
            </div>
            <p class="text-lg font-bold text-slate-700 italic">
              {{ item.titleEng || "-" }}
            </p>
          </div>

          <!-- MESSAGE BODY -->
          <div class="p-6 bg-indigo-50/30 rounded-2xl border border-indigo-50/50 space-y-3">
            <span class="block text-xs text-indigo-600 font-bold uppercase tracking-wider">ຂໍ້ຄວາມ / ລາຍລະອຽດ</span>
            <p class="text-slate-700 leading-relaxed font-medium text-base whitespace-pre-line">
              {{ item.message || "-" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING / EMPTY STATE -->
    <div v-else class="max-w-5xl mx-auto mt-12 bg-white rounded-2xl p-16 shadow-xl text-center border border-slate-100">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-slate-200 h-16 w-16 mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Notification } from "../../domain/entities/notification.entity";
import { NotificationRepositoryImpl } from "../../infrastructure/repositories/notification.repository.impl";
import { GetOneNotificationUseCase } from "../../application/use-cases/get-one-notifications.usecase";

const route = useRoute();
const router = useRouter();

const repo = new NotificationRepositoryImpl();
const getOneUseCase = new GetOneNotificationUseCase(repo);

const item = ref<Notification | null>(null);

// back
const goBack = () => router.push("/notification");

// format date safe
const formatDate = (value?: string | Date) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("lo-LA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// load detail
const loadDetail = async () => {
  try {
    const id = Number(route.params.id);

    const res: any = await getOneUseCase.execute(id);
    item.value = res?.data ?? res;
  } catch (err) {
    console.error("Load Notification Error:", err);
  }
};

onMounted(loadDetail);
</script>