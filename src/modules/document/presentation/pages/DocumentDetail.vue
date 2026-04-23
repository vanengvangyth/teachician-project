<template>
  <div class="min-h-screen p-6 bg-slate-100 rounded-lg">
    <div class="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">ລາຍລະອຽດເອກະສານ</h1>
        <p class="text-sm text-slate-500">ID: #{{ item?.docId }}</p>
      </div>
      <button @click="goBack" class="px-5 py-2 bg-slate-200 hover:bg-slate-300 transition rounded-lg font-medium">
        ກັບຄືນ
      </button>
    </div>

    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      <div class="md:col-span-1 space-y-4">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label
            class="block text-sm font-bold text-slate-700 mb-3 text-center uppercase tracking-wider">ຮູບພາບເອກະສານ</label>
          <div
            class="relative group cursor-zoom-in overflow-hidden rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all"
            @click="openLightbox">
            <img :src="getImageUrl(item?.fileUrl)"
              class="w-full h-auto object-contain min-h-[250px] transform group-hover:scale-105 transition-duration-500"
              alt="Document Preview" @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
            <div
              class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span class="bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-lg">ກົດເພື່ອເບິ່ງເຕັມຈໍ</span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 class="text-lg font-bold text-slate-800 border-b pb-3 mb-4">ຂໍ້ມູນທົ່ວໄປ</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1">
              <span class="text-xl font-bold text-slate-600 uppercase">ຊື່</span>
              <p class="text-slate-800 font-semibold text-lg">{{ item?.technician?.user?.fullName || "-" }}</p>
            </div>

            <div class="space-y-1">
              <span class="text-xl font-bold text-slate-500 uppercase">ອີເມວຊ່າງ</span>
              <p class="text-slate-800 font-semibold text-lg">{{ item?.technician?.user?.email || "-" }}</p>
            </div>

            <div class="space-y-1">
              <span class="text-xl font-bold text-slate-500 uppercase">ປະເພດເອກະສານ</span>
              <p class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                {{ item?.documentType || "-" }}
              </p>
            </div>

            <div class="space-y-1">
              <span class="text-xl font-bold text-slate-500 uppercase">ວັນທີເພີ່ມເອກະສານ</span>
              <p class="text-slate-700">{{ item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-" }}</p>
            </div>

            <div class="space-y-1">
              <span class="text-xl font-bold text-slate-500 uppercase">ອັບເດດຫຼ້າສຸດ</span>
              <p class="text-slate-700">{{ item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-" }}</p>
            </div>
          </div>

          <div class="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <p class="text-sm text-amber-700">
              <strong>ໝາຍເຫດ:</strong> ເອກະສານນີ້ຖືກອັບໂຫລດເພື່ອໃຊ້ໃນການກວດສອບຄຸນສົມບັດຂອງຊ່າງ.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isLightboxOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        @click="closeLightbox">
        <button
          class="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 focus:outline-none">&times;</button>
        <img :src="getImageUrl(item?.fileUrl)" class="max-w-full max-h-full object-contain shadow-2xl animate-zoom"
          @click.stop />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DocumentRepositoryImpl } from "../../infrastructure/repositories/document.repository.impl";
import { GetOneDocumentUseCase } from "../../application/use-cases/get-one-documents.usecase";
import { getImageUrl } from "../../../../shared/utils/image.util";
import type { Document } from "../../domain/entities/document.entity";
import { GetAllDocumentsUseCase } from "../../application/use-cases/get-all-documents.usecase";

const route = useRoute();
const router = useRouter();

const repo = new DocumentRepositoryImpl();
const getOne = new GetOneDocumentUseCase(repo);
const getAllUseCase = new GetAllDocumentsUseCase(repo);

const item = ref<Document | null>(null);
const isLightboxOpen = ref(false);

const goBack = () => router.push("/document"); // ປ່ຽນໃຫ້ກົງກັບ path ຂອງທ່ານ

const openLightbox = () => {
  if (item.value?.fileUrl) isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const loadDetail = async () => {
  try {
    const id = Number(route.params.id);
    
    // 1. ດຶງຂໍ້ມູນ Document ຈາກ GetOne (ທີ່ຊື່ບໍ່ມາ)
    const res: any = await getOne.execute(id);
    const detailData = res?.data ?? res;

    // 2. ຖ້າຂໍ້ມູນຊື່ (fullName) ບໍ່ມີ, ໃຫ້ໄປດຶງຈາກ GetAll ມາຊອກຫາ (Trick)
    if (!detailData?.technician?.user?.fullName) {
      console.log("ຊື່ບໍ່ມີໃນ Detail, ກຳລັງໄປຫາຈາກ GetAll...");
      
      const allRes: any = await getAllUseCase.execute({ perPage: 100 }); // ດຶງມາສັກ 100 ລາຍການ
      const allItems = allRes.data || allRes;
      
      // ຊອກຫາລາຍການທີ່ docId ຕົງກັນ
      const match = allItems.find((i: any) => i.docId === id);
      
      if (match) {
        // ເອົາຂໍ້ມູນທີ່ມີ User ມາປະກອບໃສ່
        item.value = match; 
        return;
      }
    }

    item.value = detailData;
  } catch (err) {
    console.error("Load Detail Error:", err);
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