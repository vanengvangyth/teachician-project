<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">

    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ລາຍລະອຽດບໍລິການຊ່າງ</h1>
      <button @click="goBack" class="px-4 py-2 bg-slate-200 rounded-lg">ກັບຄືນ</button>
    </div>

    <!-- CONTENT -->
    <div class="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- LEFT -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">ຊື່ຊ່າງ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.technician?.user?.fullName || "-" }}
            </div>
            
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ອີເມວ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.technician?.user?.email || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ (ລາວ)</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.technician?.descriptionLao || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ (ອັງກິດ)</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.technician?.descriptionEng || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ປະສົບການ (ປີ)</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.technician?.yearsOfExperience ?? "-" }}
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">ໝວດໝູ່</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.category?.nameLao || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍບໍລິການ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.description || "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ລາຄາຕໍ່າສຸດ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.minPrice ?? "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ລາຄາສູງສຸດ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.maxPrice ?? "-" }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">ວັນທີ່ສ້າງ</label>
            <div class="w-full rounded-lg border bg-gray-50 px-3 py-2">
              {{ item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-" }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Technician_serviceRepositoryImpl } from "../../infrastructure/repositories/technician_service.repository.impl";
import { GetOneTechnician_serviceUseCase } from "../../application/use-cases/get-one-technician_services.usecase";
import type { Technician_service } from "../../domain/entities/technician_service.entity";

const route = useRoute();
const router = useRouter();

const repo = new Technician_serviceRepositoryImpl();
const getOne = new GetOneTechnician_serviceUseCase(repo);

const item = ref<Technician_service | null>(null);

const goBack = () => router.push("/technician_service");

const loadDetail = async () => {
  const id = Number(route.params.id);
  const res: any = await getOne.execute(id);
  item.value = res?.data ?? res;
};

onMounted(loadDetail);
</script>