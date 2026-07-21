<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base text-xl font-bold text-slate-800">ຂອບເຂດພື້ນທີ່ໃຫ້ບໍລິການ</h3>
          <p class="text-xs text-slate-400">ພື້ນທີ່ທີ່ນາຍຊາງຮັບໃຫ້ບໍລິການກັບລູກຄ້າ</p>
        </div>
      </div>
      <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
        {{ serviceAreas?.length || 0 }} ພື້ນທີ່
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="!serviceAreas || serviceAreas.length === 0" class="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>
      <p class="text-xl font-medium text-slate-500">ບໍ່ມີຂໍ້ມູນພື້ນທີ່ໃຫ້ບໍລິການ</p>
      <p class="text-xs text-slate-400 mt-0.5">ນາຍຊາງຍັງບໍ່ໄດ້ລະບຸເຂດພື້ນທີ່ໃຫ້ບໍລິການ</p>
    </div>

    <!-- Service Areas List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div 
        v-for="area in serviceAreas" 
        :key="area.areaId || `${area.province}-${area.district}-${area.village}`"
        class="bg-slate-50 hover:bg-sky-50/40 p-4 rounded-2xl border border-slate-200/60 hover:border-sky-200 transition-all duration-200 flex items-start gap-3"
      >
        <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.307-.066l.003-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 001.04.573l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
          </svg>
        </div>

        <div class="space-y-1 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold text-slate-800">
              {{ area.province || '-' }}
            </span>
            <span v-if="area.district" class="text-xl px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 font-medium">
              {{ area.district }}
            </span>
          </div>

          <p class="text-xs text-slate-500 font-medium">
            <span class="text-xl text-slate-800">ບ້ານ: {{ area.village || '-' }}</span> 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceArea } from "../../domain/entities/techician.entity";

defineProps<{
  serviceAreas?: ServiceArea[];
}>();
</script>
