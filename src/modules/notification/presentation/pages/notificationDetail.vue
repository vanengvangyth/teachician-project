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
          <h1 class="text-lg font-black text-slate-800 tracking-tight mt-0.5">ລາຍລະອຽດແຈ້ງການ</h1>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Status Indicator in Top Bar -->
        <span v-if="item?.isRead" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          ອ່ານແລ້ວ
        </span>
        <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50 shadow-sm animate-pulse">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          ຍັງບໍ່ໄດ້ອ່ານ
        </span>
        <span class="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/50">ID: #{{ item?.id }}</span>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div v-if="item" class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- LEFT COLUMN: Recipient details & Status -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Recipient Card -->
        <div class="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-md shadow-slate-100/30 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/20 via-transparent to-transparent opacity-60"></div>
          
          <div class="relative z-10 w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100 mb-4 transition-transform duration-300 hover:scale-105">
            <img 
              v-if="item.user?.profileImageUrl" 
              :src="getImageUrl(item.user.profileImageUrl)" 
              alt="Profile" 
              class="w-full h-full object-cover animate-fade-in"
              @error="(e) => (e.target as HTMLImageElement).src = ''"
            />
            <span v-else>
              {{ item.user?.fullName?.charAt(0).toUpperCase() || "U" }}
            </span>
          </div>

          <span class="relative z-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ຜູ້ຮັບແຈ້ງການ</span>
          
          <div class="relative z-10 flex items-center justify-center gap-1">
            <h2 class="text-lg font-black text-slate-800 leading-tight">
              {{ item.user?.fullName || '-' }}
            </h2>
            <!-- Verified Check Badge -->
            <svg v-if="item.user?.isVerified" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-blue-500" title="Verified Account">
              <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.454 1.355 4.49 4.49 0 011.355 3.454 4.49 4.49 0 011.548 3.397c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.355 3.454 4.49 4.49 0 01-3.454 1.355 4.49 4.49 0 01-3.397 1.549c-1.357 0-2.573-.6-3.397-1.549a4.49 4.49 0 01-3.454-1.355 4.49 4.49 0 01-1.355-3.454 4.49 4.49 0 01-1.549-3.397c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.355-3.454 4.49 4.49 0 013.454-1.355zM15.75 10.5a.75.75 0 11-1.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 1.97-1.97z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <p class="relative z-10 text-xs text-slate-400 font-medium mt-0.5">{{ item.user?.email || '-' }}</p>

          <div class="relative z-10 flex flex-wrap justify-center gap-1.5 mt-3">
            <span class="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100/50">
              {{ item.user?.role || "USER" }}
            </span>
            <span class="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-200/60">
              UID: #{{ item.userId }}
            </span>
          </div>

          <!-- Contact details -->
          <div v-if="item.user?.phone" class="relative z-10 w-full mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.145-.44.02-.927.396-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span class="font-semibold">{{ item.user.phone }}</span>
          </div>
        </div>

        <!-- Permissions Card -->
        <div v-if="item.user?.permissions && item.user.permissions.length" class="bg-white rounded-3xl border border-slate-100 p-6 shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">ສິດທິໃນລະບົບ</span>
          <div class="flex flex-wrap gap-1.5 mt-4">
            <span v-for="permission in item.user.permissions" :key="permission" class="text-[9px] font-bold px-2 py-0.5 bg-slate-50 hover:bg-indigo-50/50 hover:text-indigo-700 text-slate-600 rounded border border-slate-200/50 transition-colors duration-150">
              {{ permission }}
            </span>
          </div>
        </div>

        <!-- User Details Card -->
        <div v-if="item.user" class="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">ຂໍ້ມູນບັນຊີຜູ້ໃຊ້</span>
          
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ສະຖານະບັນຊີ</span>
            <span class="text-slate-700 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="item.user.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
              {{ item.user.isActive ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ" }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ຢືນຢັນຕົວຕົນ</span>
            <span class="font-bold" :class="item.user.isVerified ? 'text-blue-600' : 'text-slate-400'">
              {{ item.user.isVerified ? "ຢືນຢັນແລ້ວ" : "ຍັງບໍ່ໄດ້ຢືນຢັນ" }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ວັນທີເຂົ້າຮ່ວມ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.user.createdAt) }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ອັບເດດບັນຊີຫຼ້າສຸດ</span>
            <span class="text-slate-600 font-semibold">{{ formatDate(item.user.updatedAt) }}</span>
          </div>

          <div v-if="item.user.deletedAt" class="flex items-center justify-between text-xs py-1">
            <span class="text-rose-400 font-medium">ລຶບບັນຊີເມື່ອ</span>
            <span class="text-rose-600 font-semibold">{{ formatDate(item.user.deletedAt) }}</span>
          </div>
        </div>

        <!-- Metadata Info Card -->
        <div class="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">ຂໍ້ມູນລະບົບ</span>
          
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">ປະເພດແຈ້ງການ</span>
            <span class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-[11px] border border-indigo-100/30 uppercase tracking-wider">
              {{ item.type || "-" }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-slate-400 font-medium">Reference ID</span>
            <span class="font-mono text-slate-700 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-150">
              #{{ item.referenceId ?? "-" }}
            </span>
          </div>

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

      <!-- RIGHT COLUMN: Message Contents (col-span-2) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 space-y-6 shadow-md shadow-slate-100/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30">
          
          <!-- Content Header -->
          <div class="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div class="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-2xl shadow-md shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notification Content</span>
              <h3 class="text-lg font-black text-slate-800 tracking-tight leading-none mt-1">ເນື້ອຫາແຈ້ງການ</h3>
            </div>
          </div>

          <!-- LAO TITLE -->
          <div class="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-150 transition-all hover:bg-slate-100/30">
            <div class="flex items-center gap-2.5 mb-2.5">
              <span class="text-[10px] text-sky-600 font-bold uppercase tracking-widest">ຫົວຂໍ້ (ພາສາລາວ)</span>
            </div>
            <p class="text-lg font-black text-slate-800 font-sans tracking-tight">
              {{ item.titleLao || "-" }}
            </p>
          </div>

          <!-- ENGLISH TITLE -->
          <div class="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-150 transition-all hover:bg-slate-100/30">
            <div class="flex items-center gap-2.5 mb-2.5">
              <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Title (English)</span>
            </div>
            <p class="text-lg font-bold text-slate-700 italic tracking-tight">
              {{ item.titleEng || "-" }}
            </p>
          </div>

          <!-- MESSAGE BODY -->
          <div class="p-6 bg-gradient-to-br from-indigo-50/10 via-purple-50/10 to-transparent rounded-2xl border border-indigo-50/60 space-y-3 relative overflow-hidden">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-xl"></div>
            
            <span class="block text-[10px] text-indigo-600 font-bold uppercase tracking-widest relative z-10">ຂໍ້ຄວາມ / ລາຍລະອຽດ</span>
            <p class="text-slate-700 leading-relaxed font-medium text-base whitespace-pre-line relative z-10">
              {{ item.message || "-" }}
            </p>
          </div>
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
import type { Notification } from "../../domain/entities/notification.entity";
import { NotificationRepositoryImpl } from "../../infrastructure/repositories/notification.repository.impl";
import { GetOneNotificationUseCase } from "../../application/use-cases/get-one-notifications.usecase";
import { getImageUrl } from "../../../../shared/utils/image.util";
import { UserRepositoryImpl } from "../../../user/infrastructure/repositories/user.repository.impl";
import { getOneUserUseCase } from "../../../user/application/use-cases/get-user.usecase";

const route = useRoute();
const router = useRouter();

const repo = new NotificationRepositoryImpl();
const getOneUseCase = new GetOneNotificationUseCase(repo);

const userRepo = new UserRepositoryImpl();
const getOneUser = new getOneUserUseCase(userRepo);

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
    item.value = res?.data?.data ?? res?.data ?? res;

    // Fetch user details dynamically if backend does not return nested user details
    if (item.value && item.value.userId && !item.value.user) {
      try {
        const userRes: any = await getOneUser.execute(item.value.userId);
        item.value.user = userRes?.data?.data ?? userRes?.data ?? userRes;
      } catch (userErr) {
        console.error("Load User Detail Error in Notification:", userErr);
      }
    }
  } catch (err) {
    console.error("Load Notification Error:", err);
  }
};

onMounted(loadDetail);
</script>