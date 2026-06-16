<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">

    <!-- HEADER BAR -->
    <div class="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl shadow-inner">
          🗂️
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 leading-tight">ລາຍລະອຽດປະເພດວຽກ</h1>
          <p class="text-xs text-slate-400 font-mono mt-0.5">ID: #{{ item?.id ?? '...' }}</p>
        </div>
      </div>
      <button @click="goBack"
        class="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm">
        ← ກັບຄືນ
      </button>
    </div>

    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- LEFT: Icon Card -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          <!-- Card header gradient -->
          <div class="bg-sky-100 px-4 py-3">
            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">ໄອຄອນປະເພດ</p>
          </div>
          <!-- Image area -->
          <div
            class="relative group cursor-zoom-in m-4 overflow-hidden rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-all duration-300 bg-slate-50"
            @click="openLightbox">
            <img
              :src="getImageUrl(item?.iconUrl)"
              class="w-full h-auto object-contain min-h-[220px] transform group-hover:scale-110 transition-all duration-500 ease-in-out"
              alt="Category Icon"
              @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
            <div class="absolute inset-0 bg-emerald-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span class="bg-white/95 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg text-emerald-700 border border-emerald-100">
                🔍 ກົດເພື່ອຂະຫຍາຍ
              </span>
            </div>
          </div>

          <!-- ID badge at bottom -->
          <div class="px-4 pb-4 text-center">
            <span class="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
              ລະຫັດ: #{{ item?.id ?? '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Info Card -->
      <div class="md:col-span-2 flex flex-col gap-5">

        <!-- Names -->
        <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-emerald-400 rounded-full inline-block"></span>
            ຊື່ປະເພດ
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ພາສາລາວ</p>
              <p class="text-slate-800 font-bold text-base">{{ item?.nameLao || '-' }}</p>
            </div>
            <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">English</p>
              <p class="text-slate-800 font-bold text-base">{{ item?.nameEng || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Descriptions -->
        <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-teal-400 rounded-full inline-block"></span>
            ລາຍລະອຽດ
          </h2>
          <div class="space-y-3">
            <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ພາສາລາວ</p>
              <p class="text-slate-700 leading-relaxed text-sm">{{ item?.descriptionLao || '-' }}</p>
            </div>
            <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">English</p>
              <p class="text-slate-700 leading-relaxed text-sm">{{ item?.descriptionEng || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-sky-400 rounded-full inline-block"></span>
            ວັນທີ
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3 bg-sky-50 rounded-xl px-4 py-3 border border-sky-100">
              <span class="text-lg mt-0.5">📅</span>
              <div>
                <p class="text-[10px] font-bold text-sky-500 uppercase tracking-widest">ວັນທີສ້າງ</p>
                <p class="text-slate-700 font-semibold text-sm mt-0.5">
                  {{ item?.createdAt ? new Date(item.createdAt).toLocaleString('lo-LA') : '-' }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
              <span class="text-lg mt-0.5">🔄</span>
              <div>
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">ອັບເດດຫຼ້າສຸດ</p>
                <p class="text-slate-700 font-semibold text-sm mt-0.5">
                  {{ item?.updatedAt ? new Date(item.updatedAt).toLocaleString('lo-LA') : '-' }}
                </p>
              </div>
            </div>
            <div v-if="item?.deletedAt" class="flex items-start gap-3 bg-red-50 rounded-xl px-4 py-3 border border-red-100 sm:col-span-2">
              <span class="text-lg mt-0.5">🗑️</span>
              <div>
                <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest">ວັນທີລຶບ</p>
                <p class="text-red-700 font-semibold text-sm mt-0.5">
                  {{ new Date(item.deletedAt).toLocaleString('lo-LA') }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- LIGHTBOX -->
    <Transition name="fade">
      <div v-if="isLightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        @click="closeLightbox">
        <button class="absolute top-6 right-6 text-white text-4xl hover:text-emerald-300 focus:outline-none transition">&times;</button>
        <img
          :src="getImageUrl(item?.iconUrl)"
          class="max-w-full max-h-full object-contain shadow-2xl animate-zoom rounded-2xl"
          @click.stop />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CategoryRepositoryImpl } from "../../infrastructure/repositories/category.repository.impl";
import { GetOneCategoryUseCase } from "../../application/use-cases/get-one-categories.usecase";
import { getImageUrl } from "../../../../shared/utils/image.util";
import type { Category } from "../../domain/entities/category.entity";

const route = useRoute();
const router = useRouter();

const repo = new CategoryRepositoryImpl();
const getOne = new GetOneCategoryUseCase(repo);

const item = ref<Category | null>(null);
const isLightboxOpen = ref(false);

const goBack = () => router.push("/category");

const openLightbox = () => {
  if (item.value?.iconUrl) isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const loadDetail = async () => {
  try {
    const id = Number(route.params.id);
    const res: any = await getOne.execute(id);
    // Handle both { data: { data: ... } } and { data: ... } response shapes
    const raw = res?.data?.data ?? res?.data ?? res;
    item.value = raw;
    console.log("[categoryDetail] loaded:", raw);
  } catch (err) {
    console.error("Load Category Detail Error:", err);
  }
};

onMounted(loadDetail);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes zoom {
  from {
    transform: scale(0.9);
  }

  to {
    transform: scale(1);
  }
}

.animate-zoom {
  animation: zoom 0.3s ease-out;
}
</style>