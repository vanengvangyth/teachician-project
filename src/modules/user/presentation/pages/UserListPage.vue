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

const route = useRoute();
const router = useRouter();

const totalUsers = ref(0);
const numberOfPage = computed(() => Math.ceil(totalUsers.value / perPage));

const repo = new UserRepositoryImpl();
const getUsersUseCase = new GetUsersUseCase(repo);
const deleteUseCase = new softDeleteUserUseCase(repo);

const currentPage = computed(() => {
  const pageQuery = route.query.page;
  if (typeof pageQuery === "string") {
    const num = parseInt(pageQuery, 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
});

async function loadUsers() {
  const params: any = {
    page: currentPage.value,
    perPage,
  };
  if (search.value && search.value.trim() !== "") {
    params.search = search.value.trim();
  }

 const result: PaginatedUsers = await getUsersUseCase.execute(params);

items.value = result.data;
totalUsers.value = result.total;
}

watch(search, () => {
  router.push({ query: { ...route.query, page: "1", search: search.value } });
  loadUsers();
});

function goToPage(page: number) {
  router.push({ query: { ...route.query, page: page.toString(), search: search.value } });
}

watch(
  () => route.query.page,
  () => loadUsers(),
  { immediate: true }
);

async function onDelete(id: number) {
  if (!confirm("Delete this user?")) return;

  try {
    await deleteUseCase.execute(id);
    items.value = items.value.filter((u) => u.id !== id);
    totalUsers.value--; // decrease total for pagination
  } catch (error) {
    console.error("🔥 Delete failed:", error);
  }
}

const closeFunction = () => {
  showForm.value = false;
  router.replace({ path: route.path, query: { ...route.query, id: undefined } });
  loadUsers();
};

onMounted(loadUsers);
</script>

<template>
  <div
    class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto"
  >
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
      <button
        class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
        @click="showForm = true"
      >
        + Add New User
      </button>
    </div>

    <userForm v-if="showForm" @closeForm="closeFunction()" />

    <!-- SEARCH & FILTER -->
    <div class="flex flex-col gap-3 p-6 sm:flex-row">
      <input
        v-model="search"
        placeholder="Search users..."
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
      />
      <select
        class="w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
      >
        <option>All Roles</option>
        <option>Admin</option>
        <option>Staff</option>
      </select>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm rounded-lg">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">User</th>
            <th class="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="user in items" :key="user.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-bold"
                >
                  {{ user.fullName.charAt(0) || "U" }}
                </div>
                <div>
                  <div class="font-semibold text-slate-800">{{ user.fullName }}</div>
                  <div class="text-xs text-slate-500">{{ user.email }}</div>
                </div>
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
                      query: { ...route.query, id: user.id },
                    });
                    showForm = true;
                  }
                "
                >
                  ✏️
                </button>
                <button
                  @click="onDelete(user.id)"
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
