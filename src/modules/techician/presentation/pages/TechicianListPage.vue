<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Techician, PaginatedTechicians } from "../../domain/entities/techician.entity";
import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { GetAllTechiciansUseCase } from "../../application/use-cases/get-all-techicians.usecase";
import { SoftDeleteTechicianUseCase } from "../../application/use-cases/soft-delete-techicians.usecase";
import techicianForm from "./techicianForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import techicianDeletePage from "./techicianDeletePage.vue";
import { useToastStore } from "../../../../stores/toast";

const items = ref<Techician[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

const showDeleteModal = ref(false);
const selectedId = ref<number | null>(null);

const isLoading = ref(false);
const toastStore = useToastStore();

const route = useRoute();
const router = useRouter();

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new TechicianRepositoryImpl();
const getUseCase = new GetAllTechiciansUseCase(repo);
const deleteUseCase = new SoftDeleteTechicianUseCase(repo);

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

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim();
    }

    const result: PaginatedTechicians = await getUseCase.execute(params);
    items.value = result.data.map((i: any) => ({
      ...i,
      createdAt: i.created_at ?? i.createdAt ?? null,
      updatedAt: i.updated_at ?? i.updatedAt ?? null,
    }));

    totalItems.value = result.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
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

/* Detail → FULL PAGE */
function openEdit(id: number) {
  router.push(`/techician/${id}/detail`);
}

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
      (i) => i.id !== selectedId.value
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
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການນາຍຊ່າງ</h1>
      <div class="flex px-10">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition mx-10"
          @click="showDeleted = !showDeleted">
          ກູ້ຄືນຊ່າງທີ່ຖືກລຶບ
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showForm = true">
          + ເພີ່ມຊ່າງໃຫມ່
        </button>
      </div>
    </div>

    <techicianDeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />
    <techicianForm v-if="showForm" @closeForm="closeFunction()" />

    <!-- SEARCH -->
    <div class="flex justify-center p-6">
      <input v-model="search" placeholder="Search..." class="w-full max-w-sm rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm
        focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none" />
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <!-- LOADING OVERLAY -->
      <div v-if="isLoading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div class="bg-white px-6 py-4 rounded-lg shadow text-slate-700">
          Loading...
        </div>
      </div>
      <table class="w-full text-sm rounded-lg">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">ຊື່</th>
            <th class="px-6 py-3 text-left font-semibold">ຄຳອະທິບາຍ</th>
            <th class="px-6 py-3 text-left font-semibold">ປະສົບການ</th>
            <th class="px-6 py-3 text-left font-semibold">ວັນທີ່ສ້າງ</th>
            <th class="px-6 py-3 text-left font-semibold">ວັນທີ່ແກ້ໄຂ</th>
            <th class="px-6 py-3 text-left font-semibold">ສະຖານະ</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.user?.fullName || item.user?.fullName || ('#' + item.id) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.descriptionLao || item.descriptionLao || ('#' + item.id) }}
              </div>
            </td>

            <!-- yearsOfExperience -->
            <td class="px-6 py-4 text-sm text-slate-800">
              {{ item.yearsOfExperience }}
            </td>

            <!-- Created At -->
            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </td>

            <!-- Updated At -->
            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.updatedAt).toLocaleDateString() }}
            </td>

            <!-- isapproved -->

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ item.isApproved ? "ອະນຸມັດ" : "ລໍຖ້າອະນຸມັດ" }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <!--Detail -->
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="openEdit(item.id)">
                  👁️
                </button>
                 <!-- EDIT -->
                <button class="rounded-md  px-3 py-1 text-amber-700 hover:bg-amber-200 transition" @click="
                    () => {
                      router.push({
                        path: route.path,
                        query: { ...route.query, id: item.id },
                      });
                      showForm = true;
                    }
                  ">
                    ✏️
                  </button>

                  <button @click="askDelete(item.id)"
                    class="rounded-md px-3 py-1 text-red-600 hover:bg-red-200 transition">
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

    <Paginator :numberOfPage="numberOfPage" :currentPage="currentPage" @page-changed="goToPage" />
  </div>
</template>
