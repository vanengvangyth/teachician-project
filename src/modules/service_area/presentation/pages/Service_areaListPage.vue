<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Service_area, PaginatedService_areas } from "../../domain/entities/service_area.entity";
import { Service_areaRepositoryImpl } from "../../infrastructure/repositories/service_area.repository.impl";
import { GetAllService_areasUseCase } from "../../application/use-cases/get-all-service_areas.usecase";
import { SoftDeleteService_areaUseCase } from "../../application/use-cases/soft-delete-service_areas.usecase";
import service_areaForm from "./service_areaForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import service_areaDeletePage from "./service_areaDeletePage.vue";
import { useToastStore } from "../../../../stores/toast";

const items = ref<Service_area[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

const isLoading = ref(false);
const toastStore = useToastStore();

const showDeleteModal = ref(false);
const selectedId = ref<number | null>(null);

const route = useRoute();
const router = useRouter();

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new Service_areaRepositoryImpl();
const getUseCase = new GetAllService_areasUseCase(repo);
const deleteUseCase = new SoftDeleteService_areaUseCase(repo);

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

    const result: PaginatedService_areas = await getUseCase.execute(params);
    items.value = result.data;
    totalItems.value = result.total;
  } catch (error) {
    console.error(error);
  }
  finally {
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
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການພື້ນທີ່ບໍລິການ</h1>
      <div class="flex px-10">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition mx-10"
          @click="showDeleted = !showDeleted">
          ກູ້ຄືນລາຍການທີ່ຖືກລຶບ
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showForm = true">
          + ເພີ່ມລາຍການໃຫມ່
        </button>
      </div>
    </div>

    <service_areaDeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />
    <service_areaForm v-if="showForm" @closeForm="closeFunction()" />

    <!-- SEARCH -->
    <div class="flex justify-center p-6">
      <input v-model="search" placeholder="Search..." class="w-full max-w-sm rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm
        focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none" />
    </div>


    <!-- TABLE -->
    <div class="overflow-x-auto">
      <!-- LOADING OVERLAY -->
      <div v-if="isLoading"
        class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          class="bg-white/80 p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center min-w-[140px]">
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
            <th class="px-6 py-3 text-left font-semibold">ຊື່</th>
            <th class="px-6 py-3 text-left font-semibold">ຄຳອະທິບາຍ</th>
            <th class="px-6 py-3 text-left font-semibold">ປະສົບການ</th>
            <th class="px-6 py-3 text-left font-semibold">ແຂວງ</th>
            <th class="px-6 py-3 text-left font-semibold">ເມືອງ</th>
            <th class="px-6 py-3 text-left font-semibold">ບ້ານ</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition">
            <!-- NAME -->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.technician?.user?.fullName || ('#' + item.id) }}
              </div>
            </td>

            <!-- Description-->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.technician?.descriptionLao || ('#' + item.id) }}
              </div>
            </td>

            <!-- year-->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.technician?.yearsOfExperience || ('#' + item.id) }}
              </div>
            </td>

            <!-- province -->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-600">
                {{ item.province || ('#' + item.id) }}
              </div>
            </td>

            <!-- district -->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-600">
                {{ item.district || ('#' + item.id) }}
              </div>
            </td>

            <!-- commune -->
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-600">
                {{ item.village || ('#' + item.id) }}
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="() => {
                  showForm = true;
                  router.push({
                    path: route.path,
                    query: { ...route.query, id: item.id },
                  });
                }">
                  ✏️
                </button>

                <!-- DELETE -->
                <button class="rounded-md px-3 py-1 text-red-600 hover:bg-red-200 transition"
                  @click="askDelete(item.id)">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- DELETE MODAL -->
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
