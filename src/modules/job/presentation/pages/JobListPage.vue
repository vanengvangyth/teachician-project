<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Job, PaginatedJobs } from "../../domain/entities/job.entity";
import { JobRepositoryImpl } from "../../infrastructure/repositories/job.repository.impl";
import { GetAllJobsUseCase } from "../../application/use-cases/get-all-jobs.usecase";
import { SoftDeleteJobUseCase } from "../../application/use-cases/soft-delete-jobs.usecase";
import Paginator from "../../../../shared/components/paginator.vue";
import jobDeletePage from "./jobDeletePage.vue";
import { useToastStore } from "../../../../stores/toast";
import { getImageUrl } from "../../../../shared/utils/image.util.ts";

const items = ref<Job[]>([]);
const search = ref("");
const perPage = 10;

const isLoading = ref(false);
const toastStore = useToastStore();

const route = useRoute();
const router = useRouter();

const showDeleted = ref(false);

const showDeleteModal = ref(false);
const selectedId = ref<number | null>(null);

const totalItems = ref(0);

const repo = new JobRepositoryImpl();
const getUseCase = new GetAllJobsUseCase(repo);
const deleteUseCase = new SoftDeleteJobUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

const numberOfPage = computed(() =>
  Math.ceil(totalItems.value / perPage)
);

async function loadItems() {
  try {
    isLoading.value = true;
    const result: PaginatedJobs = await getUseCase.execute({
      page: currentPage.value,
      perPage,
      search: search.value?.trim() || undefined,
    });

    items.value = result.data;
    totalItems.value = result.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

/* SEARCH (OLD STYLE + keep UI behavior) */
watch(search, () => {
  router.push({
    query: { ...route.query, page: "1", search: search.value },
  });
  loadItems();
});

/* PAGINATION */
function goToPage(page: number) {
  router.push({
    query: { ...route.query, page: page.toString() },
  });
}

/* WATCH PAGE */
watch(
  () => route.query.page,
  () => {
    loadItems();
  },
  { immediate: true }
);

/* CREATE → FULL PAGE */
function openCreate() {
  router.push("/job/create");
}

/* DETAIL → FULL PAGE */
function openDetail(id: number) {
  router.push(`/job/${id}/detail`);
}

/* EDIT → FULL PAGE */
function openEdit(id: number) {
  router.push(`/job/${id}/edit`);
}

/* DELETE */
function askDelete(id: number) {
  selectedId.value = id;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!selectedId.value) return;

  try {
    isLoading.value = true;
    await deleteUseCase.execute(selectedId.value);

    items.value = items.value.filter(
      (i) => i.jobId !== selectedId.value
    );

    toastStore.toast("ລົບສໍາເລັດ");
    totalItems.value--;
  } catch (error) {
    console.error("🔥 Delete failed:", error);
    toastStore.toast("ລົບບໍ່ສໍາເລັດ");
  } finally {
    isLoading.value = false;
    showDeleteModal.value = false;
    selectedId.value = null;
  }
}

const getAttachmentUrl = (attachments: any): string | undefined => {
  if (!attachments) return undefined;
  if (Array.isArray(attachments)) {
    return attachments[0]?.fileUrl;
  }
  return attachments.fileUrl;
};

const translateStatus = (status: string) => {
  const translations: Record<string, string> = {
    open: 'ຍັງວ່າງ',
    accepted: 'ຮັບແລ້ວ',
    in_progress: 'ກຳລັງດຳເນີນການ',
    completed: 'ສຳເລັດແລ້ວ',
    cancelled: 'ຖືກຍົກເລີກ',
  };
  return translations[status?.toLowerCase()] ?? status ?? 'ບໍ່ລະບຸ';
};

const statusClass = (status: string) => {
  const mapClasses: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800 border border-blue-200',
    accepted: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    in_progress: 'bg-amber-100 text-amber-800 border border-amber-200',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border border-rose-200',
  };
  return mapClasses[status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
};

onMounted(loadItems);
</script>

<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- HEADER (OLD UI) -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການຂໍ້ມູນວຽກ</h1>

      <div class="flex px-10 gap-4">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition mx-10"
          @click="showDeleted = !showDeleted">
          ກູ້ຄືນວຽກທີ່ຖືກລຶບ
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="openCreate">
          + ເພີ່ມວຽກໃຫມ່
        </button>
      </div>
    </div>

    <jobDeletePage v-if="showDeleted" @closeForm="showDeleted = false" />
    <!-- SEARCH (OLD UI STYLE) -->
    <div class="flex justify-center p-6">
      <input v-model="search" placeholder="Search..." class="w-full max-w-sm rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm
        focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none" />
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto relative min-h-[200px]">
      <!-- LOADING INLINE -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
        <div
          class="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center min-w-[140px]">
          <div class="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-3"></div>
          <span class="text-xs font-bold text-slate-700 animate-pulse">ກຳລັງໂຫລດ...</span>
        </div>
      </div>
      <!-- EMPTY -->
      <div v-if="!isLoading && items.length === 0"
        class="flex flex-col items-center justify-center py-16 text-slate-400">
        <p class="text-lg font-semibold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
      <table v-if="items.length > 0" class="w-full text-sm rounded-lg">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">ຮູບພາບ</th>
            <th class="px-6 py-3 text-left font-semibold">ຊື່ວຽກ</th>
            <th class="px-6 py-3 text-left font-semibold">ປະເພດວຽກ</th>
            <th class="px-6 py-3 text-left font-semibold">ປະເພດ</th>
            <th class="px-6 py-3 text-left font-semibold">ວັນທີ່ສ້າງ</th>
            <th class="px-6 py-3 text-left font-semibold">ວັນທີ່ແກ້ໄຂ</th>
            <th class="px-6 py-3 text-left font-semibold">ສະຖານະ</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.jobId" class="hover:bg-slate-50 transition">
            <!-- fileUrl -->
            <td class="px-6 py-4">
              <img v-if="getAttachmentUrl(item.attachments)" :src="getImageUrl(getAttachmentUrl(item.attachments))" alt="document"
                class="w-10 h-10 object-cover rounded border"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
            </td>
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.title || ("#" + item.jobId) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.description || ("#" + item.jobId) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.category?.nameLao || ("#" + item.jobId) }}
              </div>
            </td>

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </td>

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.updatedAt).toLocaleString("en-GB") }}
            </td>

            <td class="px-6 py-4 text-sm">
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold inline-block" :class="statusClass(item.status)">
                {{ translateStatus(item.status || 'open') }}
              </span>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <!-- DETAIL -->
                <button class="rounded-md px-3 py-1 text-sky-700 hover:bg-sky-200 transition cursor-pointer"
                  @click="openDetail(item.jobId)">
                  👁️
                </button>

                <!-- EDIT -->
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition cursor-pointer"
                  @click="openEdit(item.jobId)">
                  ✏️
                </button>

                <!-- DELETE -->
                <button class="rounded-md px-3 py-1 text-red-600 hover:bg-red-200 transition cursor-pointer"
                  @click="askDelete(item.jobId)">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- DELETE MODAL (KEEP OLD UI) -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <h2 class="text-lg font-semibold text-slate-800 mb-2">
            ຢືນຢັນການລຶບ
          </h2>

          <p class="text-sm text-slate-600 mb-6">
            ທ່ານຕ້ອງການລຶບລາຍການນີ້ແທ້ບໍ?
          </p>

          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">
              ຍົກເລີກ
            </button>

            <button @click="confirmDelete" class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
              ລຶບ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATOR (UNCHANGED) -->
    <Paginator :numberOfPage="numberOfPage" :currentPage="currentPage" @page-changed="goToPage" />
  </div>
</template>