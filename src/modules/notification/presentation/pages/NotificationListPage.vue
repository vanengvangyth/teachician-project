<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Notification, PaginatedNotifications } from "../../domain/entities/notification.entity";
import { NotificationRepositoryImpl } from "../../infrastructure/repositories/notification.repository.impl";
import { GetAllNotificationsUseCase } from "../../application/use-cases/get-all-notifications.usecase";
import { SoftDeleteNotificationUseCase } from "../../application/use-cases/soft-delete-notifications.usecase";
import notificationForm from "./notificationForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import notificationDeletePage from "./notificationDeletePage.vue";
import { useToastStore } from "../../../../stores/toast";

const items = ref<Notification[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const toastStore = useToastStore();

const showDeleteModal = ref(false);
const selectedId = ref<number | null>(null);

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new NotificationRepositoryImpl();
const getUseCase = new GetAllNotificationsUseCase(repo);
const deleteUseCase = new SoftDeleteNotificationUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

function openEdit(id: number) {
  router.push(`/notification/${id}/detail`);
}

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

    const result: PaginatedNotifications = await getUseCase.execute(params);
    items.value = result.data;
    totalItems.value = result.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function askDelete(id: number) {
  selectedId.value = id;
  showDeleteModal.value = true;
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

const closeFunction = () => {
  showForm.value = false;
  router.replace({ path: route.path, query: { ...route.query, id: undefined } });
  loadItems();
};

const closeDeletedFunction = () => {
  showDeleted.value = false;
  loadItems();
}

async function confirmDelete() {
  if (!selectedId.value) return;

  try {
    isLoading.value = true;
    await deleteUseCase.execute(selectedId.value);

    items.value = items.value.filter(
      (i) => i.id !== selectedId.value
    );

    toastStore.toast("ລຶບສໍາເລັດ");
    totalItems.value--;
  } catch (error) {
    console.error("🔥 Delete failed:", error);
    toastStore.toast("ລຶບບໍ່ສໍາເລັດ");
  } finally {
    isLoading.value = false;
    showDeleteModal.value = false;
    selectedId.value = null;
  }
}

onMounted(loadItems);
</script>

<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການການແຈ້ງເຕືອນ</h1>
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

    <notificationDeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />
    <notificationForm v-if="showForm" @closeForm="closeFunction()" />

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
            <th class="px-6 py-3 text-left font-semibold">ຫົວຂໍ້</th>
            <th class="px-6 py-3 text-left font-semibold">ປະເພດ</th>
            <th class="px-6 py-3 text-left font-semibold">ຂໍ້ຄວາມ</th>
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
                {{ item.userId || ('#' + item.id) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.titleLao || ('#' + item.id) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.type || ('#' + item.id) }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.message || ('#' + item.id) }}
              </div>
            </td>

            <td>
              {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A' }}
            </td>

            <td>
              {{ item.updatedAt ? new Date(item.updatedAt).toLocaleString('en-GB') : 'N/A' }}
            </td>

            <!--isRead-->
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full font-semibold text-sm"
                :class="item.isRead ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ item.isRead ? 'ໄດ້ອ່ານແລ້ວ' : 'ຍັງບໍ່ໄດ້ອ່ານ' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="openEdit(item.id)">
                  👁️
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
