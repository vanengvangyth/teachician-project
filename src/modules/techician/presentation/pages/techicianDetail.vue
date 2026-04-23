<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">

    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ລາຍລະອຽດຊ່າງ</h1>

      <button @click="goBack" class="px-4 py-2 bg-slate-200 rounded-lg">
        ກັບຄືນ
      </button>
    </div>

    <!-- CONTENT -->
    <div class="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-6">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- LEFT COLUMN -->
        <div class="space-y-4">

          <div>
            <label class="block text-sm font-semibold mb-1">User</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.user?.fullNam || item?.user?.fullName || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Email</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.user?.email || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Description (Lao)</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.descriptionLao || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Description (Eng)</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.descriptionEng || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Years of Experience</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.yearsOfExperience ?? "-" }}
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-4">

          <div>
            <label class="block text-sm font-semibold mb-1">Total Rating</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.totalRating ?? "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Approved At</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.approvedAt ? new Date(item.approvedAt).toLocaleString() : "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Created At</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Approved</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              <span :class="item?.isApproved ? 'text-green-600' : 'text-red-500'">
                {{ item?.isApproved ? "Approved" : "Not Approved" }}
              </span>
            </div>
          </div>

        </div>

      </div>
      <!-- ACTION BUTTONS -->
      <div class="flex justify-center gap-4 mt-10 mb-10">

        <!-- Reject -->
        <button v-if="!item?.isApproved" @click="onReject"
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          ປະຕິເສດ
        </button>

        <!-- Approve -->
        <button v-if="!item?.isApproved" @click="onApprove"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          ອະນຸມັດ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { GetOneTechicianUseCase } from "../../application/use-cases/get-one-techicians.usecase";

import type { Techician } from "../../domain/entities/techician.entity";

const route = useRoute();
const router = useRouter();

const repo = new TechicianRepositoryImpl();
const getOne = new GetOneTechicianUseCase(repo);

const item = ref<Techician | null>(null);

const goBack = () => {
  router.push("/techician");
};

const loadDetail = async () => {
  const id = Number(route.params.id);
  const res: any = await getOne.execute(id);

  const data = res?.data ?? res;

  item.value = {
    ...data,

    // ✅ normalize fields (snake_case → camelCase safe)
    createdAt: data?.createdAt ?? data?.created_at ?? null,
    approvedAt: data?.approvedAt ?? data?.approved_at ?? null,
    deletedAt: data?.deletedAt ?? data?.deleted_at ?? null,

    // ✅ fix user typo safety
    user: data?.user
      ? {
        ...data.user,
        fullName: data.user.fullName ?? data.user.fullNam ?? "-",
      }
      : undefined,
  };
};

const onApprove = async () => {
  if (!item.value) return;

  await repo.approve(item.value.id); // 👈 call API
  item.value.isApproved = true; // UI sync
};

const onReject = async () => {
  if (!item.value) return;

  await repo.reject(item.value.id); // 👈 call API
  item.value.isApproved = false;
};

onMounted(loadDetail);
</script>