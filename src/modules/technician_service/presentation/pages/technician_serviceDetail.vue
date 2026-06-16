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
          <h1 class="text-xl font-bold text-slate-800">ລາຍລະອຽດບໍລິການຊ່າງ</h1>
          <p class="text-xs text-slate-400 mt-0.5">Service ID: #{{ item?.id }}</p>
        </div>
      </div>

      <button @click="goBack" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition">
        ກັບຄືນ
      </button>
    </div>

    <!-- MAIN BODY -->
    <div v-if="item" class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT COLUMN: TECHNICIAN PROFILE (col-span-1) -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Technician Info Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-md flex items-center justify-center mb-4">
            <img v-if="item.technician?.user?.profileImageUrl" :src="getImageUrl(item.technician.user.profileImageUrl)" alt="Profile" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-black">
              {{ item.technician?.user?.fullName?.charAt(0).toUpperCase() || "T" }}
            </div>
          </div>
          <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ຂໍ້ມູນຜູ້ໃຫ້ບໍລິການ</span>
          <h2 class="text-lg font-bold text-slate-800 leading-tight">
            {{ item.technician?.user?.fullName || "-" }}
          </h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">{{ item.technician?.user?.email || "-" }}</p>
          
          <div class="w-full mt-6 pt-6 border-t border-slate-50 flex items-center justify-around text-center">
            <div>
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ປະສົບການ</span>
              <span class="text-sm font-bold text-slate-700">{{ item.technician?.yearsOfExperience ?? 0 }} ປີ</span>
            </div>
            <div class="h-6 w-px bg-slate-100"></div>
            <div>
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ຄະແນນຊ່າງ</span>
              <span class="text-sm font-bold text-slate-700">{{ item.technician?.totalRating ?? '0.0' }} ⭐</span>
            </div>
          </div>
        </div>

        <!-- Description Lao/Eng Card -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 space-y-4">
          <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">ປະຫວັດໂດຍຫຍໍ້</span>
          
          <div class="space-y-1">
            <span class="block text-[10px] font-bold text-sky-600 uppercase">ຄຳອະທິບາຍ (ລາວ)</span>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              {{ item.technician?.descriptionLao || "ບໍ່ມີຂໍ້ມູນ" }}
            </p>
          </div>

          <div class="space-y-1 pt-2">
            <span class="block text-[10px] font-bold text-indigo-600 uppercase">Description (Eng)</span>
            <p class="text-xs text-slate-500 italic leading-relaxed">
              {{ item.technician?.descriptionEng || "No description provided" }}
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: SERVICE DETAIL (col-span-2) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-8 space-y-6">
          
          <!-- Content Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1021 17.25l-5.83-5.83m-4.75 4.75l-9-9-1.5 1.5 9 9m-1.5-1.5L2.42 2.42M11.42 15.17l-1.5-1.5H3v-3h3v3h3.17l1.5 1.5z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-800">ລາຍລະອຽດການບໍລິການ</h3>
            </div>
            
            <span class="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full">
              {{ item.category?.nameLao || "-" }}
            </span>
          </div>

          <!-- Price Range Section -->
          <div class="grid grid-cols-2 gap-4 p-5 bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-2xl border border-slate-100">
            <div>
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ລາຄາເລີ່ມຕົ້ນ</span>
              <span class="text-lg font-extrabold text-slate-700">
                {{ formatPrice(item.minPrice) }}
              </span>
            </div>
            <div class="border-l border-slate-200/60 pl-4">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ລາຄາສູງສຸດ</span>
              <span class="text-lg font-extrabold text-slate-700">
                {{ formatPrice(item.maxPrice) }}
              </span>
            </div>
          </div>

          <!-- Service Description -->
          <div class="space-y-2">
            <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider">ລາຍລະອຽດຂອບເຂດວຽກ</span>
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-slate-700 leading-relaxed font-medium text-sm whitespace-pre-line">
                {{ item.description || "ບໍ່ມີຂໍ້ມູນຄຳອະທິບາຍຂອບເຂດວຽກ" }}
              </p>
            </div>
          </div>

          <!-- Metadata Info Footer -->
          <div class="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-400 font-semibold">
            <div>
              <span class="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">ວັນທີສ້າງບໍລິການ</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
            <div>
              <span class="block text-[10px] uppercase text-slate-400 mb-0.5 font-bold">ອັບເດດລ່າສຸດ</span>
              <span>{{ formatDate(item.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING / EMPTY STATE -->
    <div v-else class="max-w-5xl mx-auto mt-12 bg-white rounded-2xl p-16 shadow-xl text-center border border-slate-100">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-slate-200 h-20 w-20 mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-slate-200 rounded w-1/4"></div>
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
import { getImageUrl } from "../../../../shared/utils/image.util";

const route = useRoute();
const router = useRouter();

const repo = new Technician_serviceRepositoryImpl();
const getOne = new GetOneTechnician_serviceUseCase(repo);

const item = ref<Technician_service | null>(null);

const goBack = () => router.push("/technician_service");

// format currency in LAK (₭)
const formatPrice = (price?: number | string) => {
  if (price === undefined || price === null || price === "-") return "-";
  const num = Number(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat("lo-LA").format(num) + " ₭";
};

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

const loadDetail = async () => {
  try {
    const id = Number(route.params.id);
    const res: any = await getOne.execute(id);
    const data = res?.data ?? res;
    if (data && data.technician && data.technician.user) {
      data.technician.user.profileImageUrl = data.technician.user.profileImageUrl ?? data.technician.user.profile_image_url ?? null;
    }
    item.value = data;
  } catch (error) {
    console.error("Load Technician Service Detail Failed:", error);
  }
};

onMounted(loadDetail);
</script>