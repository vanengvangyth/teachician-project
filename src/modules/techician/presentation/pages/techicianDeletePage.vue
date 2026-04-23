<template>
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <!-- Modal Card -->
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fade">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">ຈັດການຊ່າງທີ່ຖືກລຶບ</h2>
          <p class="text-sm text-slate-500">ກູ້ຄືນວຽກທີ່ຖືກລຶບ ແລະ ລຶບຖາວອນ</p>
        </div>

        <button @click="$emit('closeForm', false)" class="text-slate-400 hover:text-slate-600 transition">
          ✕
        </button>
      </div>

      <!-- Table -->
      <div class="p-6 overflow-x-auto">
        <!-- isLoading  -->
        <div v-if="isLoading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div class="bg-white px-6 py-4 rounded-lg shadow text-slate-700">
            Loading...
          </div>
        </div>
        <table class="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr class="text-slate-500">
              <th class="px-4 py-2 text-left font-medium">ຊື່</th>
              <th class="px-4 py-2 text-left font-medium">ຄຳອະທິບາຍ</th>
              <th class="px-4 py-2 text-left font-medium">ວັນທີ່ລຶບ</th>
              <th class="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items" class="bg-slate-50 hover:bg-slate-100 transition rounded-xl">
              <!-- Test Info -->
              <td>
                <div class="font-semibold text-slate-800">{{ item.userId }}</div>
              </td>

              <td>
                <div class="font-semibold text-slate-800">{{ item.descriptionLao }}</div>
              </td>

              <td>
                <div class="font-semibold text-slate-800">{{ item.deletedAt }}</div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right rounded-r-xl">
                <div class="flex justify-end gap-2">
                  <button @click="askAction(item.id, 'restore')"
                    class="rounded-lg bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200">
                    ກູ້ຄືນຂໍ້ມູນ
                  </button>

                  <!-- Delete -->
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
  <!-- ✅ CONFIRM MODAL (FIXED: OUTSIDE TABLE) -->
  <div v-if="showConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">

      <h2 class="text-lg font-semibold text-slate-800 mb-2">
        ຢືນຢັນການດຳເນີນການ
      </h2>

      <p class="text-sm text-slate-600 mb-6">
        <span v-if="actionType === 'delete'">
          ທ່ານຕ້ອງການລຶບຖາວອນລາຍການນີ້ບໍ?
        </span>
        <span v-else>
          ທ່ານຕ້ອງການກູ້ຄືນລາຍການນີ້ບໍ?
        </span>
      </p>

      <div class="flex justify-end gap-3">

        <button @click="showConfirm = false" class="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">
          ຍົກເລີກ
        </button>

        <button @click="confirmAction" :class="actionType === 'delete'
          ? 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'
          : 'bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md'">
          ຢືນຢັນ
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { Pencil, Trash2 } from "lucide-vue-next";
import { GetDeletedTechiciansUseCase } from "../../application/use-cases/get-delete-usecase";
import { computed, onMounted, ref, watch } from "vue";
import type { PaginatedTechicians, Techician } from "../../domain/entities/techician.entity";
import { HardDeleteTechicianUseCase } from "../../application/use-cases/hard-delete-techicians.usecase";
import { RestoreTechicianUseCase } from "../../application/use-cases/restore-techicians.usecase";
import { useToastStore } from "../../../../stores/toast";

const items = ref<Techician[]>([]);
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["closeForm"]);
const totalItems = ref(0);
const perPage = 10;
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const toastStore = useToastStore();
const isLoading = ref(false);

const showConfirm = ref(false);
const actionType = ref<"delete" | "restore" | null>(null);
const selectedId = ref<number | null>(null);

const repo = new TechicianRepositoryImpl();
const getDeleted = new GetDeletedTechiciansUseCase(repo);
const hardDelete = new HardDeleteTechicianUseCase(repo);
const restore = new RestoreTechicianUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

async function loadItems() {
  try {
    isLoading.value = true;

    const params: any = {
      page: currentPage.value,
      perPage,
    };

    const result: PaginatedTechicians = await getDeleted.execute(params);
    items.value = result.data;
    totalItems.value = result.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => route.query.page,
  () => loadItems(),
  { immediate: true }
);

onMounted(loadItems);

function askAction(id: number, type: "delete" | "restore") {
  selectedId.value = id;
  actionType.value = type;
  showConfirm.value = true;
}

async function confirmAction() {
  if (!selectedId.value || !actionType.value) return;

  toastStore.toast("ກໍາລັງຢືນຢັນ...");
  try {
    if (actionType.value === "delete") {
      await hardDelete.execute(selectedId.value);
    } else {
      await restore.execute(selectedId.value);
    }

    // ✅ FIX: reload instead of manual filter
    await loadItems();

  } catch (error) {
    console.error("🔥 Action failed:", error);
    toastStore.toast("ຢືນຢັນບໍ່ສໍາເລັດ");
  } finally {
    showConfirm.value = false;
    selectedId.value = null;
    actionType.value = null;
  }
}
</script>
