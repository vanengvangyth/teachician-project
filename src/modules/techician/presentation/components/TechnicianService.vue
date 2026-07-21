<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-4.486c.01-.225-.015-.453-.07-.677a2.637 2.637 0 00-.776-.328M15.187 8.04l-2.096-2.096a2.637 2.637 0 00-.328-.776M15.187 8.04L13.125 10.1M8.04 15.187l-2.096-2.096" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-800">ປະເພດບໍລິການ</h3>
        </div>
      </div>
      <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
        {{ technicianServices?.length || 0 }} ບໍລິການ
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="!technicianServices || technicianServices.length === 0" class="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-4.486c.01-.225-.015-.453-.07-.677a2.637 2.637 0 00-.776-.328M15.187 8.04l-2.096-2.096a2.637 2.637 0 00-.328-.776M15.187 8.04L13.125 10.1M8.04 15.187l-2.096-2.096" />
        </svg>
      </div>
      <p class="text-xl font-medium text-slate-500">ບໍ່ມີຂໍ້ມູນບໍລິການ</p>
      <p class="text-xs text-slate-400 mt-0.5">ນາຍຊ່າງຍັງບໍ່ໄດ້ລະບຸລາຍການບໍລິການ</p>
    </div>

    <!-- Technician Services List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="service in technicianServices" 
        :key="service.id || service.categoryId"
        class="bg-slate-50 hover:bg-emerald-50/40 p-4 rounded-2xl border border-slate-200/60 hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <!-- Category Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  v-if="service.category?.iconUrl"
                  :src="getImageUrl(service.category.iconUrl)" 
                  :alt="service.category?.nameLao"
                  class="w-full h-full object-cover"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <span v-else class="font-bold text-sm">🛠️</span>
              </div>

              <div>
                <h4 class="text-xl font-bold text-slate-800">
                  {{ service.category?.nameLao || service.category?.nameEng || 'ບໍລິການທົ່ວໄປ' }}
                </h4>
                <p v-if="service.category?.nameEng" class="text-xl text-slate-400">
                  {{ service.category.nameEng }}
                </p>
              </div>
            </div>

            <!-- Price Badge -->
            <div class="px-2.5 py-1 bg-emerald-100/80 text-emerald-800 rounded-xl text-xs font-bold shrink-0">
              ₭ {{ formatPrice(service.minPrice) }}
            </div>
          </div>

          <!-- Description -->
          <p class="text-xl text-slate-600 leading-relaxed font-medium pt-1">
            {{ service.description || service.category?.descriptionLao || service.category?.descriptionEng || "ບໍ່ມີຂໍ້ມູນຄຳອະທິບາຍບໍລິການ" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TechnicianService } from "../../domain/entities/techician.entity";
import { getImageUrl } from "../../../../shared/utils/image.util";

defineProps<{
  technicianServices?: TechnicianService[];
}>();

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "0";
  return new Intl.NumberFormat("lo-LA").format(price);
};
</script>
