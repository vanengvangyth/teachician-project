<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { User, PaginatedUsers } from "../../domain/entities/user.entity";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { GetUsersUseCase } from "../../application/use-cases/get-users.usecase";
import { softDeleteUserUseCase } from "../../application/use-cases/soft-delete.usecase";
import userForm from "./userForm.vue";
import Paginator from "../../../../shared/components/paginator.vue";

const items = ref<User[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;

const isLoading = ref(false);

const showDeleteModal = ref(false);
const selectedId = ref<number | null>(null);

const route = useRoute();
const router = useRouter();

const totalUsers = ref(0);
const numberOfPage = computed(() => Math.ceil(totalUsers.value / perPage));

const repo = new UserRepositoryImpl();
const getUsersUseCase = new GetUsersUseCase(repo);
const deleteUseCase = new softDeleteUserUseCase(repo);

const editId = ref<number | undefined>(undefined);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

const selectedRole = "User";

const roleClass = (role: string) => {
  return "bg-blue-100 text-blue-700 border border-blue-200";
};

async function loadUsers() {
  try {
    isLoading.value = true;
    const params: any = {
      page: currentPage.value,
      perPage,
      role: "user"
    };

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim();
    }

    const result: PaginatedUsers = await getUsersUseCase.execute(params);

    let data = result.data || [];

    data = data.filter(u => u.role.toLowerCase() === "user");

    items.value = data;
    totalUsers.value = result.total;
  } catch (error) {
    console.error("🔥 Load users failed:", error);
  } finally {
    isLoading.value = false;
  }
}
watch(search, () => {
  router.push({ query: { ...route.query, page: "1", search: search.value } });
  loadUsers();
});

function openDetail(user: User) {
  router.push({
    path: `/user/${user.id}/detail`,
    state: { user: JSON.parse(JSON.stringify(user)) },
  });
}

function goToPage(page: number) {
  router.push({ query: { ...route.query, page: page.toString(), search: search.value } });
}

watch(
  () => route.query.page,
  () => loadUsers(),
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
    items.value = items.value.filter((i) => i.id !== selectedId.value);
    totalUsers.value--;
  } catch (error) {
    console.error("🔥 Delete failed:", error);
  } finally {
    isLoading.value = false;
    showDeleteModal.value = false;
    selectedId.value = null;
  }
}

const closeFunction = () => {
  showForm.value = false;
  editId.value = undefined;
  router.replace({ path: route.path, query: { ...route.query, id: undefined } });
  loadUsers();
};
onMounted(loadUsers);
</script>

<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການຂໍ້ມູນລູກຄ້າ</h1>
      <button
        class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
        @click="() => { editId = undefined; showForm = true; }">
        + ເພີ່ມລູກຄ້າໃໝ່
      </button>
    </div>

    <userForm v-if="showForm" :edit-id="editId" @closeForm="closeFunction()" />

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
      <table class="w-full text-sm rounded-lg">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">ຊື່</th>
            <th class="px-6 py-3 text-left font-semibold">ອີເມວ</th>
            <th class="px-6 py-3 text-left font-semibold">ເບີໂທ</th>
            <th class="px-6 py-3 text-right font-semibold">ຈັດການ</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="user in items" :key="user.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-bold shadow-sm">
                  {{ user.fullName ? user.fullName.charAt(0).toUpperCase() : "U" }}
                </div>
                <div>
                  <div class="font-semibold text-slate-800 flex items-center gap-2">
                    {{ user.fullName }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="font-semibold text-slate-800">
                {{ user.email }}
              </div>
            </td>
            <td>
              <div class="font-semibold text-slate-800">
                {{ user.phone }}
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="openDetail(user)">
                  👁️
                </button>
                <button class="rounded-md bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-200 transition" @click="() => {
                  editId = user.id;
                  showForm = true;
                }">
                  ✏️
                </button>
                <button @click="askDelete(user.id)"
                  class="rounded-md bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200 transition">
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