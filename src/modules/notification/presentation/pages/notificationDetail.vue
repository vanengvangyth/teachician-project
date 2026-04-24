<template>
  <div class="min-h-screen p-6 bg-slate-100 rounded-lg">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">ລາຍລະອຽດແຈ້ງການ</h1>
        <p class="text-sm text-slate-500">ID: #{{ item?.id }}</p>
      </div>

      <button @click="goBack" class="px-5 py-2 bg-slate-200 hover:bg-slate-300 transition rounded-lg font-medium">
        ກັບຄືນ
      </button>
    </div>

    <!-- BODY -->
    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- LEFT: USER -->
      <div class="md:col-span-1 space-y-4">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label class="block text-sm font-bold text-slate-700 mb-3 text-center uppercase">
            ຜູ້ຮັບແຈ້ງການ
          </label>

          <div class="text-center space-y-2">
            <p class="text-lg font-semibold text-slate-800">
              {{ item?.user?.fullName || item?.user?.email || '-' }}
            </p>
            <p class="text-sm text-slate-500">
              ID: {{ item?.userId }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
        <label class="block text-sm font-bold text-slate-700 mb-2 uppercase">
          ສະຖານະ
        </label>

        <span class="inline-block px-3 py-1 rounded-full text-sm font-bold"
          :class="item?.isRead ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          {{ item?.isRead ? "ໄດ້ອ່ານແລ້ວ" : "ຍັງບໍ່ໄດ້ອ່ານ" }}
        </span>
      </div>

      <!-- RIGHT: DETAILS -->
      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

          <!-- TITLE LAO -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ຫົວຂໍ້ (Lao)</span>
            <p class="text-lg font-semibold text-slate-800">
              {{ item?.titleLao || "-" }}
            </p>
          </div>

          <!-- TITLE ENG -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ຫົວຂໍ້ (Eng)</span>
            <p class="text-lg font-semibold text-slate-800">
              {{ item?.titleEng || "-" }}
            </p>
          </div>

          <!-- MESSAGE -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ຂໍ້ຄວາມ</span>
            <p class="text-lg font-semibold text-slate-800">
              {{ item?.message || "-" }}
            </p>
          </div>

          <!-- TYPE -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ປະເພດ</span>
            <p class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              {{ item?.type || "-" }}
            </p>
          </div>

          <!-- REFERENCE -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">Reference ID</span>
            <p class="text-slate-700">
              {{ item?.referenceId ?? "-" }}
            </p>
          </div>

          <!-- CREATED -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ວັນທີສ້າງ</span>
            <p class="text-slate-700">
              {{ formatDate(item?.createdAt) }}
            </p>
          </div>

          <!-- UPDATED -->
          <div>
            <span class="text-sm font-bold text-slate-500 uppercase">ອັບເດດຫຼ້າສຸດ</span>
            <p class="text-slate-700">
              {{ formatDate(item?.updatedAt) }}
            </p>
          </div>

        </div>
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
  return new Date(value).toLocaleString("en-GB");
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