<template>
  <div class="min-h-screen p-6 bg-gradient-to-tr from-slate-50 via-slate-50 to-indigo-50/20">
    <!-- TOP BAR -->
    <div class="max-w-6xl mx-auto flex items-center justify-between mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="group p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200/60 rounded-2xl transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">ລາຍລະອຽດລະບົບ</span>
          <h1 class="text-lg font-black text-slate-800 tracking-tight mt-0.5">ລາຍລະອຽດພື້ນທີ່ບໍລິການ</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/50">ID: #{{ item?.id }}</span>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div v-if="item" class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- LEFT COLUMN: Location Details & Metadata -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Location Card -->
        <div class="bg-white rounded-3xl border border-slate-100 p-6 shadow-md shadow-slate-100/30 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/10 via-transparent to-transparent opacity-60"></div>
          
          <span class="relative z-10 block text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">ພື້ນທີ່ບໍລິການ</span>

          <!-- Stylized Map Marker Icon -->
          <div class="relative z-10 flex justify-center my-6">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
          </div>

          <div class="relative z-10 space-y-4">
            <div class="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-200/50">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">ແຂວງ (Province)</span>
              <span class="text-base font-bold text-slate-800 mt-0.5">{{ item.province }}</span>
            </div>

            <div class="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-200/50">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">ເມືອງ (District)</span>
              <span class="text-base font-bold text-slate-800 mt-0.5">{{ item.district }}</span>
            </div>

            <div class="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-200/50">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">ບ້ານ (Village)</span>
              <span class="text-base font-bold text-slate-800 mt-0.5">{{ item.village || "-" }}</span>
            </div>
          </div>
        </div>

        <!-- Metadata Info Card -->
        <div class="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">ຂໍ້ມູນລະບົບ</span>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ວັນທີສ້າງ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.createdAt) }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ອັບເດດຫຼ້າສຸດ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.updatedAt) }}</span>
          </div>

          <div v-if="item.deletedAt" class="flex items-center justify-between text-xs py-1">
            <span class="text-rose-400 font-medium">ລຶບເມື່ອ</span>
            <span class="text-rose-600 font-semibold">{{ formatDate(item.deletedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Technician Info Details (col-span-2) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Technician Card container -->
        <div v-if="item.technician" class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          
          <!-- Hero Banner Background -->
          <div class="h-32 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 relative">
            <div class="absolute -bottom-12 left-6 flex items-end gap-4">
              <!-- Profile Image Container -->
              <div class="relative z-10 w-24 h-24 rounded-2xl overflow-hidden border-4 border-white bg-slate-100 shadow-md flex items-center justify-center">
                <img 
                  v-if="item.technician.user?.profileImageUrl" 
                  :src="getImageUrl(item.technician.user.profileImageUrl)" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                  {{ item.technician.user?.fullName?.charAt(0).toUpperCase() || "T" }}
                </div>
              </div>

              <!-- Name & Role -->
              <div class="mb-2">
                <h2 class="text-lg font-black text-slate-800 leading-tight">{{ item.technician.user?.fullName || "-" }}</h2>
                <p class="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">ຊ່າງປະຈຳພື້ນທີ່</p>
              </div>
            </div>
          </div>

          <!-- Spacer for floating profile -->
          <div class="h-14"></div>

          <div class="p-6 space-y-6">
            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div class="text-center border-r border-slate-200">
                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ປະສົບການ</span>
                <span class="text-base font-bold text-slate-700">{{ item.technician.yearsOfExperience ?? 0 }} ປີ</span>
              </div>
              <div class="text-center">
                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ລະຫັດຊ່າງ</span>
                <span class="text-base font-bold text-slate-700">#{{ item.technician.id }}</span>
              </div>
            </div>

            <!-- Bio Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-slate-800 border-l-4 border-sky-500 pl-2">ຂໍ້ມູນການຕິດຕໍ່</h3>
                
                <div class="space-y-3">
                  <div class="flex items-center gap-2.5 p-2.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition text-xs">
                    <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div class="overflow-hidden">
                      <span class="block text-[10px] text-slate-400 uppercase tracking-wide">ອີເມວ</span>
                      <span class="font-semibold text-slate-700 truncate block">{{ item.technician.user?.email || "-" }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5 p-2.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition text-xs">
                    <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.145-.44.02-.927.396-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] text-slate-400 uppercase tracking-wide">ເບີໂທລະສັບ</span>
                      <span class="font-semibold text-slate-700 block">{{ item.technician.user?.phone || "-" }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bio/Experience description -->
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-slate-800 border-l-4 border-sky-500 pl-2">ຄຳອະທິບາຍ & ຄວາມສາມາດ</h3>
                
                <div class="space-y-3">
                  <div class="p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
                    <span class="block text-[10px] text-sky-600 font-bold mb-1 uppercase tracking-wide">ຄຳອະທິບາຍ (ພາສາລາວ)</span>
                    <p class="text-slate-700 font-medium leading-relaxed leading-snug">
                      {{ item.technician.descriptionLao || "ບໍ່ມີຂໍ້ມູນຄຳອະທິບາຍພາສາລາວ" }}
                    </p>
                  </div>

                  <div class="p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
                    <span class="block text-[10px] text-indigo-600 font-bold mb-1 uppercase tracking-wide">Description (English)</span>
                    <p class="text-slate-600 leading-relaxed leading-snug italic">
                      {{ item.technician.descriptionEng || "No English description provided" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- If no technician is loaded/assigned -->
        <div v-else class="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-md shadow-slate-100/30 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-slate-300">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <p class="text-sm font-semibold">ຍັງບໍ່ມີຂໍ້ມູນຊ່າງປະຈຳພື້ນທີ່ນີ້</p>
        </div>
      </div>
    </div>

    <!-- LOADING / EMPTY STATE -->
    <div v-else class="max-w-6xl mx-auto mt-12 bg-white rounded-3xl p-16 shadow-lg shadow-slate-100/60 text-center border border-slate-100">
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
import { Service_areaRepositoryImpl } from "../../infrastructure/repositories/service_area.repository.impl";
import { GetOneService_areaUseCase } from "../../application/use-cases/get-one-service_areas.usecase";
import { TechicianRepositoryImpl } from "../../../techician/infrastructure/repositories/techician.repository.impl";
import { GetOneTechicianUseCase } from "../../../techician/application/use-cases/get-one-techicians.usecase";
import { getImageUrl } from "../../../../shared/utils/image.util";
import type { Service_area } from "../../domain/entities/service_area.entity";

const route = useRoute();
const router = useRouter();

const repo = new Service_areaRepositoryImpl();
const getOneUseCase = new GetOneService_areaUseCase(repo);

const techRepo = new TechicianRepositoryImpl();
const getOneTechUseCase = new GetOneTechicianUseCase(techRepo);

const item = ref<Service_area | null>(null);

// back
const goBack = () => router.push("/service_area");

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
    const data = res?.data?.data ?? res?.data ?? res;

    if (!data) return;

    item.value = {
      ...data,
      technicianId: data.technicianId ?? data.technician_id ?? null,
      createdAt: data.createdAt ?? data.created_at ?? null,
      updatedAt: data.updatedAt ?? data.updated_at ?? null,
      deletedAt: data.deletedAt ?? data.deleted_at ?? null,
    };

    if (item.value && item.value.technician) {
      const rawTech: any = item.value.technician;
      item.value.technician = {
        ...rawTech,
        user: rawTech.user ? {
          ...rawTech.user,
          profileImageUrl: rawTech.user.profileImageUrl ?? rawTech.user.profile_image_url ?? null,
          fullName: rawTech.user.fullName ?? rawTech.user.fullNam ?? "-",
          phone: rawTech.user.phone ?? rawTech.user.phone_number ?? "-",
        } : undefined
      };
    } else {
      const targetTechId = item.value?.technicianId;
      if (item.value && targetTechId) {
        try {
          const techRes: any = await getOneTechUseCase.execute(targetTechId);
          const rawTech = techRes?.data?.data ?? techRes?.data ?? techRes;
          if (rawTech) {
            item.value.technician = {
              ...rawTech,
              user: rawTech.user ? {
                ...rawTech.user,
                profileImageUrl: rawTech.user.profileImageUrl ?? rawTech.user.profile_image_url ?? null,
                fullName: rawTech.user.fullName ?? rawTech.user.fullNam ?? "-",
                phone: rawTech.user.phone ?? rawTech.user.phone_number ?? "-",
              } : undefined
            };
          }
        } catch (techErr) {
          console.error("Load Technician Detail Error in Service Area:", techErr);
        }
      }
    }
  } catch (err) {
    console.error("Load Service Area Error:", err);
  }
};

onMounted(loadDetail);
</script>
