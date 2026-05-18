<template>
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

    <!-- Modal Card -->
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fade">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">ຈັດການລາຍການທີ່ຖືກລຶບ</h2>
          <p class="text-sm text-slate-500">ກູ້ຄືນວຽກ ແລະ ລຶບຖາວອນ</p>
        </div>

        <button @click="$emit('closeForm', false)" class="text-slate-400 hover:text-slate-600 transition">
          ✕
        </button>
      </div>

      <!-- Table -->
      <div class="p-6 overflow-x-auto relative">

        <!-- Loading -->
        <div v-if="isLoading" class="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
          <div class="bg-white px-6 py-3 rounded-lg shadow">
            Loading...
          </div>
        </div>

        <table class="w-full text-sm border-separate border-spacing-y-2">

          <thead>
            <tr class="text-slate-500">
              <th class="px-4 py-2 text-left font-medium">ຊື່</th>
              <th class="px-4 py-2 text-left font-medium">ຄຳອະທິບາຍ</th>
              <th class="px-4 py-2 text-left font-medium">ປະສົບການ</th>
              <th class="px-4 py-2 text-left font-medium">ວັນທີ່ລຶບ</th>
              <th class="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items" :key="item.id" class="bg-slate-50 hover:bg-slate-100 transition">

              <!-- Name -->
              <td class="px-4 py-3">
                <div class="font-semibold text-slate-800">
                  {{ item.technician?.user?.fullName ?? '-' }}
                </div>
              </td>

              <!-- Description -->
              <td class="px-4 py-3">
                <div class="text-slate-700">
                  {{ item.technician?.descriptionLao ?? '-' }}
                </div>
              </td>

              <!-- Experience -->
              <td class="px-4 py-3">
                <div class="text-slate-700">
                  {{ item.technician?.yearsOfExperience ?? '-' }}
                </div>
              </td>

              <!-- Deleted At -->
              <td class="px-4 py-3">
                <div class="font-semibold text-slate-800">
                  {{ new Date(item.deletedAt).toLocaleDateString() }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">

                  <button @click="askAction(item.id, 'restore')"
                    class="rounded-lg bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200">
                    ກູ້ຄືນຂໍ້ມູນ
                  </button>

                  <button @click="askAction(item.id, 'delete')"
                    class="rounded-lg bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200">
                    ລຶບຖາວອນ
                  </button>

                </div>
              </td>

            </tr>
          </tbody>

        </table>
      </div>
    </div>
  </div>

  <!-- Confirm Modal -->
  <div v-if="showConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">

      <h2 class="text-lg font-semibold mb-2">
        ຢືນຢັນການດຳເນີນການ
      </h2>

      <p class="text-sm text-slate-600 mb-6">
        {{ actionType === 'delete'
          ? 'ທ່ານຕ້ອງການລຶບຖາວອນບໍ?'
          : 'ທ່ານຕ້ອງການກູ້ຄືນບໍ?'
        }}
      </p>

      <div class="flex justify-end gap-3">

        <button @click="resetAction" class="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">
          ຍົກເລີກ
        </button>

        <button @click="confirmAction" :class="actionType === 'delete'
          ? 'bg-red-600 text-white px-4 py-2 rounded-md'
          : 'bg-amber-500 text-white px-4 py-2 rounded-md'">
          ຢືນຢັນ
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useToastStore } from "../../../../stores/toast";

import { Service_areaRepositoryImpl } from "../../infrastructure/repositories/service_area.repository.impl";
import { GetDeletedService_areasUseCase } from "../../application/use-cases/get-delete-usecase";
import { HardDeleteService_areaUseCase } from "../../application/use-cases/hard-delete-service_areas.usecase";
import { RestoreService_areaUseCase } from "../../application/use-cases/restore-service_areas.usecase";

import type { Service_area } from "../../domain/entities/service_area.entity";

const items = ref<Service_area[]>([]);
const isLoading = ref(false);

const showConfirm = ref(false);
const actionType = ref<"delete" | "restore" | null>(null);
const selectedId = ref<number | null>(null);

const route = useRoute();
const toastStore = useToastStore();
const emits = defineEmits(["closeForm"]);

const repo = new Service_areaRepositoryImpl();
const getDeleted = new GetDeletedService_areasUseCase(repo);
const hardDelete = new HardDeleteService_areaUseCase(repo);
const restore = new RestoreService_areaUseCase(repo);

const perPage = 10;

const currentPage = computed(() => {
  const p = route.query.page;
  return typeof p === "string" ? Number(p) || 1 : 1;
});

async function loadItems() {
  try {
    isLoading.value = true;

    const result = await getDeleted.execute({
      page: currentPage.value,
      perPage
    });

    items.value = result.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

watch(() => route.query.page, loadItems, { immediate: true });

function askAction(id: number, type: "delete" | "restore") {
  selectedId.value = id;
  actionType.value = type;
  showConfirm.value = true;
}

function resetAction() {
  showConfirm.value = false;
  selectedId.value = null;
  actionType.value = null;
}

async function confirmAction() {
  if (!selectedId.value || !actionType.value) return;

  try {
    if (actionType.value === "delete") {
      await hardDelete.execute(selectedId.value);
    } else {
      await restore.execute(selectedId.value);
    }

    toastStore.toast("ສຳເລັດ...");
    await loadItems();

  } catch (e) {
    console.error(e);
    toastStore.toast("ບໍ່ສຳເລັດ...");
  } finally {
    resetAction();
  }
}

onMounted(loadItems);
</script>