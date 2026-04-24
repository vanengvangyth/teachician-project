<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Attachment, PaginatedAttachments } from "../../domain/entities/attachment.entity";
import { AttachmentRepositoryImpl } from "../../infrastructure/repositories/attachment.repository.impl";
import { GetAllAttachmentsUseCase } from "../../application/use-cases/get-all-attachments.usecase";
import { SoftDeleteAttachmentUseCase } from "../../application/use-cases/soft-delete-attachments.usecase";
import attachmentForm from "./attachmentForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import attachmentDeletePage from "./attachmentDeletePage.vue";

const items = ref<Attachment[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

const route = useRoute();
const router = useRouter();

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new AttachmentRepositoryImpl();
const getUseCase = new GetAllAttachmentsUseCase(repo);
const deleteUseCase = new SoftDeleteAttachmentUseCase(repo);

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

  if (search.value && search.value.trim() !== "") {
    params.search = search.value.trim();
  }

  const result: PaginatedAttachments = await getUseCase.execute(params);
  items.value = result.data;
  totalItems.value = result.total;
}

watch(search, () => {
  router.push({ query: { ...route.query, page: "1", search: search.value } });
  loadItems();
});

function goToPage(page: number) {
  router.push({ query: { ...route.query, page: page.toString(), search: search.value } });
}

watch(
  () => route.query.page,
  () => loadItems(),
  { immediate: true }
);

async function onDelete(id: number) {
  if (!confirm("Delete this item?")) return;

  try {
    await deleteUseCase.execute(id);
    items.value = items.value.filter((i) => i.id !== id);
    totalItems.value--;
  } catch (error) {
    console.error("🔥 Delete failed:", error);
  }
}

const closeFunction = () => {
  showForm.value = false;
  router.replace({ path: route.path, query: { ...route.query, id: undefined } });
  loadItems();
};

const closeDeletedFunction = () => {
  showDeleted.value = false;
  loadItems();
}

onMounted(loadItems);
</script>

<template>
  <div
    class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto"
  >
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">Attachment Management</h1>
      <div class="flex px-10">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition mx-10"
          @click="showDeleted = !showDeleted"
        >
          Restore Deleted Attachment
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showForm = true"
        >
          + Add New Attachment
        </button>
      </div>
    </div>
    
    <attachmentDeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />
    <attachmentForm v-if="showForm" @closeForm="closeFunction()" />

    <!-- SEARCH -->
    <div class="flex flex-col gap-3 p-6 sm:flex-row">
      <input
        v-model="search"
        placeholder="Search..."
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
      />
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm rounded-lg">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Attachment</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.email || item.email || ('#' + item.id) }}
              </div>
              <div v-if="item.email" class="text-xs text-slate-500">
                {{ item.email }}
              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  class="rounded-md bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="
                    () => {
                      router.push({
                        path: route.path,
                        query: { ...route.query, id: item.id },
                      });
                      showForm = true;
                    }
                  "
                >
                  ✏️
                </button>

                <button
                  @click="onDelete(item.id)"
                  class="rounded-md bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200 transition"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Paginator
      :numberOfPage="numberOfPage"
      :currentPage="currentPage"
      @page-changed="goToPage"
    />
  </div>
</template>
