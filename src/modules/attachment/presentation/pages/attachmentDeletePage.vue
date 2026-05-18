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
          <h2 class="text-lg font-semibold text-slate-800">ຈັດການຂໍ້ມູນທີ່ຖືກລຶບ</h2>
          <p class="text-sm text-slate-500">ກູ້ລາຍການທີ່ຖືກລືບ ແລະ ລືບຖາວອນ</p>
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
        <!-- isloading -->
         <div v-if="isLoading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div class="bg-white px-6 py-4 rounded-lg shadow text-slate-700">
            Loading...
          </div>
        </div>
        <table class="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr class="text-slate-500">
              <th class="px-4 py-2 text-left font-medium">ຮູບພາບ</th>
              <th class="px-4 py-2 text-left font-medium">ລະຫັດວຽກ</th>
              <th class="px-4 py-2 text-left font-medium">ປະເພດໄຟລ໌</th>
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
              <td class="px-6 py-4">
              <img v-if="item.fileUrl" :src="getImageUrl(item.fileUrl)" alt="document"
                class="w-10 h-10 object-cover rounded border"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
            </td>

              <td class="px-4 py-3">
                <div class="font-semibold text-slate-800">{{ item.job_id }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="font-semibold text-slate-800">{{ item.fileType }}</div>
              </td>

              <td class="px-4 py-3 text-slate-600">
                <div class="text-sm font-medium">{{ item.deletedAt }}</div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right rounded-r-xl">
                <div class="flex justify-end gap-2">
                  <!-- Restore -->
                  <button @click="askAction(item.attachmentId, 'restore')"
                    class="rounded-lg bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200">
                    ກູ້ຄືນຂໍ້ມູນ
                  </button>

                  <!-- Delete -->
                  <button @click="askAction(item.attachmentId, 'delete')"
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
import { useRoute } from "vue-router";
import { AttachmentRepositoryImpl } from "../../infrastructure/repositories/attachment.repository.impl";
import { GetDeletedAttachmentsUseCase } from "../../application/use-cases/get-delete-usecase";
import { computed, onMounted, ref, watch } from "vue";
import type { PaginatedAttachments, Attachment } from "../../domain/entities/attachment.entity";
import { HardDeleteAttachmentUseCase } from "../../application/use-cases/hard-delete-attachments.usecase";
import { RestoreAttachmentUseCase } from "../../application/use-cases/restore-attachments.usecase";
import { useToastStore } from "../../../../stores/toast";
import { getImageUrl } from "../../../../shared/utils/image.util";

const items = ref<Attachment[]>([]);
const route = useRoute();
const emits = defineEmits(["closeForm"]);
const totalItems = ref(0);
const perPage = 10;

const isLoading = ref(false);
const toastStore = useToastStore();

const repo = new AttachmentRepositoryImpl();
const getDeleted = new GetDeletedAttachmentsUseCase(repo);
const hardDelete = new HardDeleteAttachmentUseCase(repo);
const restore = new RestoreAttachmentUseCase(repo);

const showConfirm = ref(false);
const actionType = ref<"delete" | "restore" | null>(null);
const selectedId = ref<number | null>(null);

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

  const result: PaginatedAttachments = await getDeleted.execute(params);
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

/* open modal */
function askAction(id: number, type: "delete" | "restore") {
  selectedId.value = id;
  actionType.value = type;
  showConfirm.value = true;
}

/* confirm action (FIXED: reload instead of filter bug) */
async function confirmAction() {
  if (!selectedId.value || !actionType.value) return;

  toastStore.toast("ສຳເລັດ...");
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
    toastStore.toast("ບໍ່ສຳເລັດ...");
  } finally {
    showConfirm.value = false;
    selectedId.value = null;
    actionType.value = null;
  }
}
</script>
