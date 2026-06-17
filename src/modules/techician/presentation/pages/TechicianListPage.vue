<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Techician, PaginatedTechicians } from "../../domain/entities/techician.entity";
import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { GetAllTechiciansUseCase } from "../../application/use-cases/get-all-techicians.usecase";
import { SoftDeleteTechicianUseCase } from "../../application/use-cases/soft-delete-techicians.usecase";
import { ApproveTechicianUseCase } from "../../application/use-cases/approve-techician.usecase";
import { RejectTechicianUseCase } from "../../application/use-cases/reject-techician.usecase";
import techicianForm from "./techicianForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import techicianDeletePage from "./techicianDeletePage.vue";
import { useToastStore } from "../../../../stores/toast";
import { getImageUrl } from "../../../../shared/utils/image.util";

const items = ref<Techician[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

// Delete modal
const showDeleteModal = ref(false);
const selectedDeleteId = ref<number | null>(null);

// Approve/Reject modal
const showConfirmModal = ref(false);
const confirmAction = ref<"approve" | "reject">("approve");
const selectedActionId = ref<number | null>(null);
const selectedName = ref("");

const skipNextLoad = ref(false);
const isLoading = ref(false);
const toastStore = useToastStore();

const route = useRoute();
const router = useRouter();

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new TechicianRepositoryImpl();
const getUseCase = new GetAllTechiciansUseCase(repo);
const deleteUseCase = new SoftDeleteTechicianUseCase(repo);
const approveUseCase = new ApproveTechicianUseCase(repo);
const rejectUseCase = new RejectTechicianUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

async function loadItems() {
  if (skipNextLoad.value) {
    skipNextLoad.value = false;
    return;
  }

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
      isApproved: i.is_approved ?? i.isApproved ?? false,
      createdAt: i.created_at ?? i.createdAt ?? null,
      updatedAt: i.updated_at ?? i.updatedAt ?? null,
      user: (i.user || i.fullName || i.email || i.phone || i.phone_number || i.phoneNumber)
        ? {
          ...(i.user ?? {}),
          isVerified: i.user?.is_verified ?? i.user?.isVerified ?? i.isVerified ?? false,
          fullName: i.user?.fullName ?? i.user?.fullNam ?? i.fullName ?? "-",
          profileImageUrl: i.user?.profileImageUrl ?? i.user?.profile_image_url ?? i.profileImageUrl ?? i.profile_image_url ?? null,
        }
        : undefined,
    }));

    console.log("Loaded techicians:", items.value);

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

function openEdit(id: number) {
  router.push(`/techician/${id}/detail`);
}

// ─── DELETE ───────────────────────────────────────────────
function askDelete(id: number) {
  selectedDeleteId.value = id;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!selectedDeleteId.value) return;
  const removedId = selectedDeleteId.value;

  try {
    isLoading.value = true;
    await deleteUseCase.execute(removedId);
    items.value = items.value.filter((i) => i.id !== removedId);
    totalItems.value = Math.max(0, totalItems.value - 1);
    skipNextLoad.value = true;
    toastStore.toast("ລົບສໍາເລັດ");
  } catch (error) {
    console.error("Delete failed:", error);
    toastStore.toast("ລົບບໍ່ສໍາເລັດ");
  } finally {
    isLoading.value = false;
    showDeleteModal.value = false;
    selectedDeleteId.value = null;
  }
}

async function confirmActionHandler() {
  if (!selectedActionId.value) return;
  const targetId = selectedActionId.value;

  try {
    isLoading.value = true;

    if (confirmAction.value === "approve") {
      await approveUseCase.execute(targetId);
      // ✅ อัปเดต isApproved ใน list ทันที ไม่ต้อง reload
      items.value = items.value.map((i) =>
        i.id === targetId ? { ...i, isApproved: true } : i
      );
      toastStore.toast("ອະນຸມັດສຳເລັດ");
    } else {
      await rejectUseCase.execute(targetId);
      // ✅ อัปเดต isApproved เป็น false ทันที
      items.value = items.value.map((i) =>
        i.id === targetId ? { ...i, isApproved: false } : i
      );
      toastStore.toast("ປະຕິເສດສຳເລັດ");
    }

    skipNextLoad.value = true;
  } catch (error) {
    console.error("Action failed:", error);
    toastStore.toast(
      confirmAction.value === "approve" ? "ອະນຸມັດບໍ່ສຳເລັດ" : "ປະຕິເສດບໍ່ສຳເລັດ"
    );
  } finally {
    isLoading.value = false;
    showConfirmModal.value = false;
    selectedActionId.value = null;
    selectedName.value = "";
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
};

onMounted(loadItems);
</script>

<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການນາຍຊ່າງ</h1>
      <div class="flex px-10 gap-3">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
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
          <tr v-for="(item) in items" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <img :src="getImageUrl(item.user?.profileImageUrl)" alt="Profile"
                class="w-10 h-10 object-cover rounded-full border border-slate-200"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'" />
            </td>

            <td class="px-6 py-4">
              <div class="font-semibold text-slate-800">
                {{ item.user?.fullName || ('#' + item.id) }}
              </div>
              <div class="text-xs text-slate-400">{{ item.user?.email || '-' }}</div>
            </td>

            <td class="px-6 py-4">
              <div class="text-slate-800 max-w-[200px] truncate">
                {{ item.descriptionLao || item.descriptionEng || '-' }}
              </div>
            </td>

            <td class="px-6 py-4 text-sm text-slate-800">
              {{ item.yearsOfExperience }} ປີ
            </td>

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </td>

            <td class="px-6 py-4 text-sm text-slate-500">
              {{ new Date(item.updatedAt).toLocaleDateString() }}
            </td>

            <!-- ✅ STATUS COLUMN — แสดงสถานะ + ปุ่ม approve/reject ถ้า pending -->
            <td class="px-6 py-4 text-sm">
              <div class="flex flex-col gap-1">
                <span class="px-3 py-1 rounded-full font-semibold text-xs w-fit"
                  :class="item.isApproved === true ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                  {{ item.isApproved === true ? 'ອະນຸມັດແລ້ວ' : 'ລໍຖ້າອະນຸມັດ' }}
                </span>

                <!-- ✅ ถ้า pending แสดงปุ่ม approve/reject ใต้ badge -->

              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="openEdit(item.id)">
                  👁️
                </button>
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="() => { router.push({ path: route.path, query: { ...route.query, id: item.id } }); showForm = true; }">
                  ✏️
                </button>
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
          <h2 class="text-lg font-semibold text-slate-800 mb-2">ຢືນຢັນການລຶບ</h2>
          <p class="text-sm text-slate-600 mb-6">ທ່ານຕ້ອງການລຶບລາຍການນີ້ແທ້ບໍ?</p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">ຍົກເລີກ</button>
            <button @click="confirmDelete"
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">ລຶບ</button>
          </div>
        </div>
      </div>

      <!-- APPROVE / REJECT MODAL -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <h2 class="text-lg font-semibold text-slate-800 mb-2">
            {{ confirmAction === 'approve' ? 'ຢືນຢັນການອະນຸມັດ' : 'ຢືນຢັນການປະຕິເສດ' }}
          </h2>
          <p class="text-sm text-slate-600 mb-6">
            {{ confirmAction === 'approve'
              ? `ທ່ານຕ້ອງການອະນຸມັດ "${selectedName}" ແທ້ບໍ?`
              : `ທ່ານຕ້ອງການປະຕິເສດ "${selectedName}" ແທ້ບໍ?`
            }}
          </p>
          <div class="flex justify-end gap-3">
            <button @click="showConfirmModal = false"
              class="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 transition">ຍົກເລີກ</button>
            <button @click="confirmActionHandler"
              :class="confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="px-4 py-2 rounded-md text-white transition">
              {{ confirmAction === 'approve' ? 'ອະນຸມັດ' : 'ປະຕິເສດ' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Paginator :numberOfPage="numberOfPage" :currentPage="currentPage" @page-changed="goToPage" />
  </div>
</template>