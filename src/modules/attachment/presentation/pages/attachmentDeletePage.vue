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
          <h2 class="text-lg font-semibold text-slate-800">Test Management</h2>
          <p class="text-sm text-slate-500">Manage test records and actions</p>
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
              <th class="px-4 py-2 text-left font-medium">Test</th>
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
                <div class="font-semibold text-slate-800">{{ item.email }}</div>
                <div class="text-xs text-slate-500">{{ item.email }}</div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right rounded-r-xl">
                <div class="flex justify-end gap-2">
                  <button
                    @click="onRestore(item.id)"
                    class="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-amber-700 hover:bg-amber-200 transition"
                  >
                    <Pencil class="w-4 h-4" />
                    <span class="text-xs font-medium">Restore</span>
                  </button>

                  <button
                    @click="onDelete(item.id)"
                    class="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-red-600 hover:bg-red-200 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                    <span class="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { AttachmentRepositoryImpl } from "../../infrastructure/repositories/attachment.repository.impl";
import { Pencil, Trash2 } from "lucide-vue-next";
import { GetDeletedAttachmentsUseCase } from "../../application/use-cases/get-delete-usecase";
import { computed, onMounted, ref, watch } from "vue";
import type { PaginatedAttachments, Attachment } from "../../domain/entities/attachment.entity";
import { HardDeleteAttachmentUseCase } from "../../application/use-cases/hard-delete-attachments.usecase";
import { RestoreAttachmentUseCase } from "../../application/use-cases/restore-attachments.usecase";

const items = ref<Attachment[]>([]);
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["closeForm"]);
const totalItems = ref(0);
const perPage = 10;
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new AttachmentRepositoryImpl();
const getDeleted = new GetDeletedAttachmentsUseCase(repo);
const hardDelete = new HardDeleteAttachmentUseCase(repo);
const restore = new RestoreAttachmentUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

async function loadItems() {
  const params: any = {
    page: currentPage.value,
    perPage,
  };

  const result: PaginatedAttachments = await getDeleted.execute(params);
  items.value = result.data;
  totalItems.value = result.total;
}

watch(
  () => route.query.page,
  () => loadItems(),
  { immediate: true }
);

onMounted(loadItems);

async function onDelete(id: number) {
  if (!confirm("Delete this item?")) return;

  try {
    await hardDelete.execute(id);
    items.value = items.value.filter((i) => i.id !== id);
    totalItems.value--;
  } catch (error) {
    console.error("🔥 Delete failed:", error);
  }
}

async function onRestore(id: number) {
  if (!confirm("Restore this item?")) return;

  try {
    await restore.execute(id);
    items.value = items.value.filter((i) => i.id !== id);
    totalItems.value--;
  } catch (error) {
    console.error("🔥 Restore failed:", error);
  }
}
</script>
