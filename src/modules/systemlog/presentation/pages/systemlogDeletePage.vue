<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    <!-- Modal Card -->
    <div
      class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fade"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">ຈັດການລາຍການທີ່ຖືກລຶບ</h2>
          <p class="text-sm text-slate-500">ກູ້ຄືນວຽກ ແລະ ລຶບຖາວອນ</p>
        </div>

        <button
          @click="$emit('closeForm', false)"
          class="text-slate-400 hover:text-slate-600 transition"
        >
          ✕
        </button>
      </div>

      <!-- Table -->
      <div class="p-6 overflow-x-auto">
        <table class="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr class="text-slate-500">
              <th class="px-4 py-2 text-left font-medium">ລະຫັດ</th>
              <th class="px-4 py-2 text-left font-medium">action</th>
              <th class="px-4 py-2 text-left font-medium">ip_address</th>
              <th class="px-4 py-2 text-left font-medium">user_agent</th>
              <th class="px-4 py-2 text-left font-medium">ວັນທີ່ລຶບ</th>
              <th class="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in items"
              class="bg-slate-50 hover:bg-slate-100 transition rounded-xl"
            >
              <!-- Test Info -->
              <td class="px-4 py-3 rounded-l-xl">
                <div class="font-semibold text-slate-800">{{ item.user_id }}</div>
              </td>
              <td class="px-4 py-3 rounded-l-xl">
                <div class="font-semibold text-slate-800">{{ item.action }}</div>
              </td>
              <td class="px-4 py-3 rounded-l-xl">
                <div class="font-semibold text-slate-800">{{ item.ip_address }}</div>
              </td>
              <td class="px-4 py-3 rounded-l-xl">
                <div class="font-semibold text-slate-800">{{ item.user_agent }}</div>
              </td>
              <td class="px-4 py-3 rounded-l-xl">
                <div class="font-semibold text-slate-800">
                  {{ new Date(item.deleteAt).toLocaleDateString() }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right rounded-r-xl">
                <div class="flex justify-end gap-2">
                  <button @click="askAction(item.log_id, 'restore')"
                    class="rounded-lg bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200">
                    ກູ້ຄືນຂໍ້ມູນ
                  </button>

                  <button @click="askAction(item.log_id, 'delete')"
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
import { SystemlogRepositoryImpl } from "../../infrastructure/repositories/systemlog.repository.impl";
import { GetDeletedSystemlogsUseCase } from "../../application/use-cases/get-delete-usecase";
import { computed, onMounted, ref, watch } from "vue";
import type { PaginatedSystemlogs, Systemlog } from "../../domain/entities/systemlog.entity";
import { HardDeleteSystemlogUseCase } from "../../application/use-cases/hard-delete-systemlogs.usecase";
import { RestoreSystemlogUseCase } from "../../application/use-cases/restore-systemlogs.usecase";
import { useToastStore } from "../../../../stores/toast";

const items = ref<Systemlog[]>([]);
const route = useRoute();
const emits = defineEmits(["closeForm"]);
const totalItems = ref(0);
const perPage = 10;

const showConfirm = ref(false);
const actionType = ref<"delete" | "restore" | null>(null);
const selectedId = ref<number | null>(null);

const isLoading = ref(false);
const toastStore = useToastStore();

const repo = new SystemlogRepositoryImpl();
const getDeleted = new GetDeletedSystemlogsUseCase(repo);
const hardDelete = new HardDeleteSystemlogUseCase(repo);
const restore = new RestoreSystemlogUseCase(repo);

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

  const result: PaginatedSystemlogs = await getDeleted.execute(params);
  items.value = result.data;
  totalItems.value = result.total;
  } catch (e) {
    console.error(e);
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
</script>
