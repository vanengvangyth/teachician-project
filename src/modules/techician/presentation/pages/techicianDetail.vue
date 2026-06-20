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
        <h1 class="text-xl font-bold text-slate-800">ລາຍລະອຽດຊ່າງ</h1>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2">
        <template v-if="item">
          <!-- When not approved yet: show Approve and Reject buttons -->
          <template v-if="!item.isApproved">
            <button @click="handleApprove" :disabled="isActionLoading"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-200 transition flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              ອະນຸມັດ
            </button>
            <button @click="handleReject" :disabled="isActionLoading"
              class="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-200 transition flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              ປະຕິເສດ
            </button>
          </template>
          <!-- When already approved: show Cancel Approval button -->
          <template v-else>
            <button @click="handleReject" :disabled="isActionLoading"
              class="px-4 py-2 bg-slate-500 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-slate-200 transition flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              ຍົກເລີກການອະນຸມັດ
            </button>
          </template>
        </template>
      </div>
    </div>

    <!-- MAIN PROFILE CARD -->
    <div v-if="item" class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden transition-all duration-300">
      
      <!-- HERO BANNER BACKGROUND -->
      <div class="h-36 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 relative">
        <div class="absolute -bottom-16 left-8 flex items-end gap-6">
          <!-- Profile Image container -->
          <div class="relative group">
            <div @click="openImagePreview"
              class="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white bg-slate-100 shadow-md flex items-center justify-center cursor-pointer transition hover:shadow-lg hover:scale-105 active:scale-95 duration-200 relative group/img">
              <img :src="getImageUrl(item.user?.profileImageUrl)" alt="Profile Image" class="w-full h-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
              <!-- Hover overlay with preview icon -->
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>
            <!-- Verification icon badge overlay -->
            <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md"
              :class="item.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'">
              <svg v-if="item.isApproved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M16.403 4.579a.75.75 0 01.075 1.057l-1.5 1.875a.75.75 0 01-1.132.073l-3.75-3.75a.75.75 0 011.06-1.06l3.11 3.11 1.09-1.363a.75.75 0 011.057-.075z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 animate-pulse">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Name and Badges -->
          <div class="mb-2">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-bold text-slate-800">{{ item.user?.fullName || "-" }}</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                :class="item.isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'">
                {{ item.isApproved ? "ອະນຸມັດແລ້ວ" : "ລໍຖ້າອະນຸມັດ" }}
              </span>
            </div>
            <p class="text-sm text-sky-500 font-medium mt-1">
              {{ ['technician', 'technicians'].includes(item.user?.role?.toLowerCase() || '') ? 'ນາຍຊ່າງມືອາຊີບ' : 'ນາຍຊ່າງ' }}
            </p>
          </div>
        </div>
      </div>

      <!-- SPACER FOR HEADER -->
      <div class="h-20"></div>

      <!-- BIO AND INFO -->
      <div class="p-8 pt-2">
        <!-- Quick stats grid -->
        <div class="grid grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div class="text-center border-r border-slate-200">
            <span class="block text-xl font-semibold uppercase tracking-wider mb-1">ປະສົບການ</span>
            <span class="text-lg font-bold text-slate-700">{{ item.yearsOfExperience ?? 0 }} ປີ</span>
          </div>
          <div class="text-center border-r border-slate-200">
            <span class="block text-xl font-semibold uppercase tracking-wider mb-1">ຄະແນນລວມ</span>
            <div class="flex items-center justify-center gap-1">
              <span class="text-lg font-bold text-slate-700">{{ item.totalRating ?? '0.0' }}</span>
              <div class="flex text-amber-400">
                <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"
                  :class="star <= Math.round(item.totalRating || 0) ? 'text-amber-400' : 'text-slate-200'">
                  <path d="M10.868 2.784c-.304-.793-1.432-.793-1.736 0l-1.92 5.012-5.404.433c-.856.068-1.2 1.127-.54 1.682l4.116 3.484-1.217 5.314c-.193.84.718 1.5 1.437 1.052L10 14.12l4.896 2.64c.72.388 1.63-.272 1.437-1.051l-1.217-5.314 4.116-3.484c.66-.556.316-1.614-.54-1.682l-5.404-.433-1.92-5.012z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="text-center">
            <span class="block text-xl font-semibold uppercase tracking-wider mb-1">ຄວາມໜ້າເຊື່ອຖື</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold inline-block"
              :class="item.user?.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'">
              {{ item.user?.isVerified ? 'ຢືນຢັນຕົວຕົນແລ້ວ' : 'ຍັງບໍ່ຢືນຢັນ' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- LEFT COLUMN: Profile Info & Contacts -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-l-4 border-sky-500 pl-3">ຂໍ້ມູນການຕິດຕໍ່</h3>
            
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <span class="block text-lg text-slate-500 font-medium">ອີເມວ</span>
                  <span class="text-sm font-semibold text-slate-700">{{ item.user?.email || "-" }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.5-4.5c-.387-.44-.22-1.21.186-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-lg text-slate-500 font-medium">ເບີໂທລະສັບ</span>
                  <span class="text-sm font-semibold text-slate-700">{{ item.user?.phone || "-" }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-lg text-slate-500 font-medium">ວັນທີລົງທະບຽນ</span>
                  <span class="text-sm font-semibold text-slate-700">
                    {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString("lo-LA", { year: 'numeric', month: 'long', day: 'numeric' }) : "-" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Professional Bio / Descs -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-l-4 border-sky-500 pl-3">ຄຳອະທິບາຍ & ຄວາມສາມາດ</h3>
            
            <div class="space-y-4">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="block text-xs text-sky-600 font-bold mb-2 uppercase tracking-wide">ຄຳອະທິບາຍ (ພາສາລາວ)</span>
                <p class="text-sm text-slate-700 leading-relaxed font-medium">
                  {{ item.descriptionLao || "ບໍ່ມີຂໍ້ມູນຄຳອະທິບາຍພາສາລາວ" }}
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="block text-xs text-indigo-600 font-bold mb-2 uppercase tracking-wide">Description (English)</span>
                <p class="text-sm text-slate-600 leading-relaxed italic">
                  {{ item.descriptionEng || "No English description provided" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- METADATA FOOTER SECTION -->
        <div class="mt-10 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 font-medium">
          <div>
            <span class="block uppercase text-lg tracking-wider text-slate-600 mb-0.5">ອັບເດດລ່າສຸດ</span>
            <span>{{ item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-" }}</span>
          </div>
          <div>
            <span class="block uppercase text-lg tracking-wider text-slate-600 mb-0.5">ອະນຸມັດໂດຍ Admin</span>
            <span>{{ approvedByAdminName }}</span>
          </div>
          <div>
            <span class="block uppercase text-lg tracking-wider text-slate-600 mb-0.5">ວັນທີອະນຸມັດ</span>
            <span>{{ item.approvedAt ? new Date(item.approvedAt).toLocaleString() : "-" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING / EMPTY STATE -->
    <div v-else class="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-16 shadow-xl text-center border border-slate-100">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>

    <!-- IMAGE PREVIEW MODAL -->
    <div v-if="isPreviewOpen && item" @click="closeImagePreview"
      class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div class="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200" @click.stop>
        <!-- Close button -->
        <button @click="closeImagePreview" 
          class="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950/80 text-white rounded-full transition shadow-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Image display -->
        <img :src="getImageUrl(item.user?.profileImageUrl)" alt="Profile Image Preview" 
          class="max-w-full max-h-[70vh] object-contain rounded-t-2xl" 
          @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
        <!-- Footer / Name -->
        <div class="w-full py-4 px-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span class="font-bold text-slate-800 text-base">{{ item.user?.fullName || "-" }}</span>
          <a :href="getImageUrl(item.user?.profileImageUrl)" target="_blank"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            ເປີດໃນແທັບໃໝ່
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { GetOneTechicianUseCase } from "../../application/use-cases/get-one-techicians.usecase";
import { ApproveTechicianUseCase } from "../../application/use-cases/approve-techician.usecase";
import { RejectTechicianUseCase } from "../../application/use-cases/reject-techician.usecase";
import { useToastStore } from "../../../../stores/toast";

import type { Techician } from "../../domain/entities/techician.entity";
import { getImageUrl } from "../../../../shared/utils/image.util";
import { getOneUserUseCase } from "../../../user/application/use-cases/get-user.usecase";
import { UserRepositoryImpl } from "../../../user/infrastructure/repositories/user.repository.impl";
import { UpdateUserUseCase } from "../../../user/application/use-cases/update-users.usecase";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const repo = new TechicianRepositoryImpl();
const getOne = new GetOneTechicianUseCase(repo);
const approveUseCase = new ApproveTechicianUseCase(repo);
const rejectUseCase = new RejectTechicianUseCase(repo);

const item = ref<Techician | null>(null);
const isActionLoading = ref(false);
const isPreviewOpen = ref(false);

const openImagePreview = () => {
  isPreviewOpen.value = true;
};

const closeImagePreview = () => {
  isPreviewOpen.value = false;
};

const userRepo = new UserRepositoryImpl();
const getUserUseCase = new getOneUserUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);
const approvedByAdminName = ref("");

const goBack = () => {
  router.push("/techician");
};

const loadDetail = async () => {
  const id = Number(route.params.id);
  try {
    const res: any = await getOne.execute(id);
    const data = res?.data ?? res;

    if (!data) return;

    item.value = {
      ...data,

      // ✅ normalize fields (snake_case → camelCase safe)
      isApproved: data?.is_approved ?? data?.isApproved ?? false,
      createdAt: data?.createdAt ?? data?.created_at ?? null,
      updatedAt: data?.updatedAt ?? data?.updated_at ?? null,
      approvedAt: data?.approvedAt ?? data?.approved_at ?? null,
      deletedAt: data?.deletedAt ?? data?.deleted_at ?? null,

      // ✅ fix user typo safety
      user: (data?.user || data?.fullName || data?.email || data?.phone || data?.phone_number || data?.phoneNumber)
        ? {
          ...(data.user ?? {}),
          isVerified: data.user?.is_verified ?? data.user?.isVerified ?? data?.isVerified ?? false,
          fullName: data.user?.fullName ?? data.user?.fullNam ?? data?.fullName ?? "-",
          phone: data.user?.phone ?? data.user?.phone_number ?? data.user?.phoneNumber ?? data.user?.tel ?? data?.phone ?? data?.phone_number ?? data?.phoneNumber ?? "-",
          profileImageUrl: data.user?.profileImageUrl ?? data.user?.profile_image_url ?? data?.profileImageUrl ?? data?.profile_image_url ?? null,
        }
        : undefined,
    };
    console.log("Loaded technician detail:", item.value);

    // Fetch Admin name if approvedByAdminId is present
    const adminId = data.approvedByAdminId ?? data.approved_by_admin_id;
    if (adminId) {
      try {
        const adminRes = await getUserUseCase.execute(adminId);
        const adminData = adminRes?.data ?? adminRes;
        if (adminData && adminData.fullName) {
          approvedByAdminName.value = adminData.fullName;
        } else {
          approvedByAdminName.value = `Admin ID: #${adminId}`;
        }
      } catch (err) {
        console.error("Error loading admin detail:", err);
        approvedByAdminName.value = `Admin ID: #${adminId}`;
      }
    } else {
      approvedByAdminName.value = "ຍັງບໍ່ໄດ້ລະບຸ";
    }
  } catch (e) {
    console.error("Error loading details:", e);
    toastStore.toast("ໂຫຼດຂໍ້ມູນບໍ່ສໍາເລັດ");
  }
};

const handleApprove = async () => {
  if (!item.value) return;
  try {
    isActionLoading.value = true;
    console.log("Approving technician with ID:", item.value.id);
    await approveUseCase.execute(item.value.id);

    // Update user's role to TECHNICIANS and set verified status in the DB
    const userId = item.value.userId ?? (item.value as any).user_id ?? item.value.user?.id;
    console.log("Resolved user ID for role update:", userId);
    if (userId) {
      const updateRes = await updateUserUseCase.execute(userId, { 
        role: "TECHNICIANS",
        isVerified: true,
        is_verified: true
      } as any);
      console.log("Role update API response:", updateRes);
    } else {
      console.warn("Could not find userId to update role.");
    }

    toastStore.toast("ອະນຸມັດສຳເລັດ");
    await loadDetail(); // Reload updated information
  } catch (error: any) {
    console.error("Approval failed:", error);
    const errorMsg = error.response?.data?.message ?? error.message ?? error;
    toastStore.toast("ອະນຸມັດບໍ່ສຳເລັດ: " + errorMsg);
  } finally {
    isActionLoading.value = false;
  }
};

const handleReject = async () => {
  if (!item.value) return;
  try {
    isActionLoading.value = true;
    console.log("Rejecting technician with ID:", item.value.id);
    await rejectUseCase.execute(item.value.id);

    // Update user's role back to USER and revoke verified status in the DB
    const userId = item.value.userId ?? (item.value as any).user_id ?? item.value.user?.id;
    console.log("Resolved user ID for role reset:", userId);
    if (userId) {
      const updateRes = await updateUserUseCase.execute(userId, { 
        role: "USER",
        isVerified: false,
        is_verified: false
      } as any);
      console.log("Role reset API response:", updateRes);
    } else {
      console.warn("Could not find userId to reset role.");
    }

    toastStore.toast("ປະຕິເສດສຳເລັດ");
    await loadDetail(); // Reload updated information
  } catch (error: any) {
    console.error("Rejection failed:", error);
    const errorMsg = error.response?.data?.message ?? error.message ?? error;
    toastStore.toast("ປະຕິເສດບໍ່ສຳເລັດ: " + errorMsg);
  } finally {
    isActionLoading.value = false;
  }
};

onMounted(loadDetail);
</script>