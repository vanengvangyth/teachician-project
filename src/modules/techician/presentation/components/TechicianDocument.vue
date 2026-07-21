<template>
  <div class="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">ເອກະສານຢືນຢັນຕົວຕົນ</h3>
        </div>
      </div>
      <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
        {{ documents?.length || 0 }} ລາຍການ
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="!documents || documents.length === 0"
      class="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <p class="text-xl font-medium text-slate-500">ບໍ່ມີເອກະສານแนບ</p>
      <p class="text-xs text-slate-400 mt-0.5">ນາຍຊ່າງຍັງບໍ່ໄດ້ລະບຸເອກະສານຢືນຢັນຕົວຕົນ</p>
    </div>

    <!-- Documents Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="doc in documents" :key="doc.docId || doc.fileUrl"
        class="group relative bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 transition-all duration-200 flex flex-col justify-between">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
              📄
            </div>
            <div>
              <span class="block text-sm font-bold text-slate-800 line-clamp-1">
                {{ formatDocType(doc.documentType) }}
              </span>
              <span class="block text-[11px] text-slate-400">
                {{ doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('lo-LA') : '-' }}
              </span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-200/70 text-slate-600 shrink-0">
            {{ doc.documentType || 'DOCUMENT' }}
          </span>
        </div>

        <!-- Preview Thumbnail / Image link -->
        <div
          class="relative w-full h-32 rounded-xl overflow-hidden bg-slate-200/70 border border-slate-200 group-hover:shadow-sm transition">
          <img :src="getImageUrl(doc.fileUrl)" :alt="doc.documentType"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
          <div
            class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button @click="openPreview(doc.fileUrl)"
              class="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg shadow-md flex items-center gap-1 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602zM10.5 7.5v6m3-3h-6" />
              </svg>
              ເບິ່ງຮູບ
            </button>
            <a :href="getImageUrl(doc.fileUrl)" target="_blank"
              class="p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-lg shadow-md transition"
              title="เปิดในแท็บใหม่">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="selectedPreviewUrl" @click="selectedPreviewUrl = null"
      class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div class="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2" @click.stop>
        <button @click="selectedPreviewUrl = null"
          class="absolute top-4 right-4 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="getImageUrl(selectedPreviewUrl)" alt="Document Preview"
          class="max-w-full max-h-[75vh] object-contain rounded-xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TechicianDocument } from "../../domain/entities/techician.entity";
import { getImageUrl } from "../../../../shared/utils/image.util";

defineProps<{
  documents?: TechicianDocument[];
}>();

const selectedPreviewUrl = ref<string | null>(null);

const openPreview = (url: string) => {
  selectedPreviewUrl.value = url;
};

const formatDocType = (type: string) => {
  if (!type) return "ເອກະສານທົ່ວໄປ";
  const upper = type.toUpperCase();
  if (upper.includes("ID") || upper.includes("CARD") || upper.includes("CITIZEN")) return "ບັດປະຈຳຕົວ (ID Card)";
  if (upper.includes("LICENSE") || upper.includes("DRIVE")) return "ໃບຂັບຂີ່ (Driver License)";
  if (upper.includes("CERT")) return "ໃບຢັ້ງຢືນ / ໃບປະກາດ";
  if (upper.includes("CRIMINAL")) return "ໃບແຈ້ງໂທດ (Criminal Record)";
  return type;
};
</script>
