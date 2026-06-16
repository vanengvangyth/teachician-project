<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { User, PaginatedUsers } from "../../domain/entities/user.entity";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { GetUsersUseCase } from "../../application/use-cases/get-users.usecase";
import { softDeleteUserUseCase } from "../../application/use-cases/soft-delete.usecase";
import userForm from "./userForm.vue";
import userDeletePage from "./userDeletePage.vue";
import Paginator from "../../../../shared/components/paginator.vue";

const items = ref<User[]>([]);
const search = ref("");
const showForm = ref(false);
const showDeleted = ref(false);
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

const selectedRole = computed(() => {
  const roleQuery = route.query.role;
  return typeof roleQuery === "string" ? roleQuery : "All";
});

function onRoleChange(event: Event) {
  const val = (event.target as HTMLSelectElement).value;
  router.push({ query: { ...route.query, page: "1", role: val } });
}

const roleClass = (role: string) => {
  const map: any = {
    admin: "bg-purple-100 text-purple-700 border border-purple-200",
    user: "bg-blue-100 text-blue-700 border border-blue-200",
    technician: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return map[role.toLowerCase()] ?? "bg-slate-100 text-slate-700 border border-slate-200";
};

async function loadUsers() {
  const params: any = {
    page: currentPage.value,
    perPage,
  };
  if (search.value && search.value.trim() !== "") {
    params.search = search.value.trim();
  }
  if (selectedRole.value !== "All") {
    params.role = selectedRole.value.toLowerCase();
  }

  const result: PaginatedUsers = await getUsersUseCase.execute(params);
  
  let data = result.data || [];
  if (selectedRole.value !== "All") {
    const hasUnsupportedRole = data.some(u => u.role.toLowerCase() !== selectedRole.value.toLowerCase());
    if (hasUnsupportedRole) {
      data = data.filter(u => u.role.toLowerCase() === selectedRole.value.toLowerCase());
    }
  }

  items.value = data;
  totalUsers.value = result.total;
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
  () => [route.query.page, route.query.role],
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

const closeDeletedFunction = () => {
  showDeleted.value = false;
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
      <div class="flex gap-4">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showDeleted = !showDeleted"
        >
          Restore Deleted Users
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showForm = true"
        >
          + Add New User
        </button>
      </div>
    </div>

    <userForm v-if="showForm" @closeForm="closeFunction()" />
    <userDeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />

    <!-- SEARCH & FILTER -->
    <div class="flex flex-col gap-3 p-6 sm:flex-row">
      <input
        v-model="search"
        placeholder="Search users..."
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
      />
      <select
        :value="selectedRole"
        @change="onRoleChange"
        class="w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none font-semibold text-slate-700"
      >
        <option value="All">All</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="Technician">Technician</option>
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
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-bold shadow-sm"
                >
                  {{ user.fullName ? user.fullName.charAt(0).toUpperCase() : "U" }}
                </div>
                <div>
                  <div class="font-semibold text-slate-800 flex items-center gap-2">
                    {{ user.fullName }}
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" :class="roleClass(user.role)">
                      {{ user.role }}
                    </span>
                  </div>
                  <div class="text-xs text-slate-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <!--Detail -->
                <button class="rounded-md px-3 py-1 text-amber-700 hover:bg-amber-200 transition"
                  @click="openDetail(user)">
                  👁️
                </button>
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
