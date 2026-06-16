<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
    <!-- TOP BAR -->
    <div class="max-w-4xl mx-auto flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-slate-800">ລາຍລະອຽດຜູ້ໃຊ້</h1>
          <p class="text-xs text-slate-400 mt-0.5">User ID: #{{ item?.id }}</p>
        </div>
      </div>
    </div>

    <!-- MAIN PROFILE CARD -->
    <div v-if="item" class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden transition-all duration-300">
      
      <!-- HERO BANNER BACKGROUND -->
      <div class="h-32 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 relative">
        <div class="absolute -bottom-14 left-8 flex items-end gap-5">
          <!-- Profile Image / Initial container -->
          <div class="w-28 h-28 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-black overflow-hidden">
            <img :src="getImageUrl(item.profileImageUrl)" alt="Profile" class="w-full h-full object-cover" @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
          </div>

          <!-- Name and Badges -->
          <div class="mb-1">
            <h2 class="text-2xl font-bold text-slate-800">{{ item.fullName || "-" }}</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                :class="roleClass(item.role)">
                {{ item.role }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold"
                :class="item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
                {{ item.isActive ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SPACER FOR HEADER -->
      <div class="h-16"></div>

      <!-- INFO CONTENT -->
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- LEFT COLUMN: Profile Info -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-l-4 border-sky-500 pl-3">ຂໍ້ມູນຜູ້ໃຊ້</h3>
            
            <div class="space-y-4">
              <!-- Full Name -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-xs text-slate-400 font-medium">ຊື່ ແລະ ນາມສະກຸນ</span>
                  <span class="text-sm font-semibold text-slate-700">{{ item.fullName || "-" }}</span>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <span class="block text-xs text-slate-400 font-medium">ອີເມວ</span>
                  <span class="text-sm font-semibold text-slate-700">{{ item.email || "-" }}</span>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.5-4.5c-.387-.44-.22-1.21.186-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-xs text-slate-400 font-medium">ເບີໂທລະສັບ</span>
                  <span class="text-sm font-semibold text-slate-700">{{ item.phone || "-" }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Account Status & Timestamps -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-l-4 border-sky-500 pl-3">ສະຖານະບັນຊີ ແລະ ລະບົບ</h3>
            
            <div class="space-y-4">
              <!-- Verification status -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="item.isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-xs text-slate-400 font-medium">ການຢືນຢັນຕົວຕົນ</span>
                  <span class="text-sm font-semibold" :class="item.isVerified ? 'text-emerald-600' : 'text-amber-600'">
                    {{ item.isVerified ? "ຢືນຢັນຕົວຕົນແລ້ວ" : "ຍັງບໍ່ຢືນຢັນຕົວຕົນ" }}
                  </span>
                </div>
              </div>

              <!-- Created At -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <span class="block text-xs text-slate-400 font-medium">ວັນທີສ້າງບັນຊີ</span>
                  <span class="text-sm font-semibold text-slate-700">
                    {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString("lo-LA", { year: 'numeric', month: 'long', day: 'numeric' }) : "-" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div v-if="error" class="max-w-4xl mx-auto mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 flex-shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <span class="font-semibold">{{ error }}</span>
    </div>

    <!-- LOADING / EMPTY STATE -->
    <div v-else-if="!item" class="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-16 shadow-xl text-center border border-slate-100">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { User } from "../../domain/entities/user.entity";
import { getImageUrl } from "../../../../shared/utils/image.util";

const router = useRouter();

const item = ref<User | null>(null);
const error = ref<string | null>(null);

const goBack = () => {
  router.push("/users");
};


const roleClass = (role: string) => {
  const map: any = {
    admin: "bg-purple-100 text-purple-700 border border-purple-200",
    user: "bg-blue-100 text-blue-700 border border-blue-200",
    technician: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return map[role?.toLowerCase()] ?? "bg-slate-100 text-slate-700 border border-slate-200";
};

onMounted(() => {
  // อ่านข้อมูล user จาก router state ที่ส่งมาจาก List page
  const stateUser = (history.state as any)?.user;
  if (stateUser && stateUser.id) {
    const rawUrl = stateUser.profileImageUrl ?? stateUser.profile_image_url;
    const cleanUrl = (!rawUrl || rawUrl === "null" || rawUrl === "undefined" || String(rawUrl).trim() === "") ? null : rawUrl;
    
    item.value = {
      ...stateUser,
      profileImageUrl: cleanUrl
    };
  } else {
    error.value = "ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ — ກະລຸນາກັບໄປໜ້າລາຍການ";
  }
});
</script>
