import fs from 'fs';
import path from 'path';

/**
 * Usage:
 *   npx tsx scripts/make.module.ts user
 */

const name = process.argv[2];

if (!name) {
  console.error('❌ Please provide module name');
  process.exit(1);
}

const Name = capitalize(name);
const plural = pluralize(name);
const basePath = path.join(process.cwd(), 'src', 'modules', name);

/* ================= CREATE FOLDERS ================= */
const folders = [
  'domain/entities',
  'domain/interfaces',
  'application/use-cases',
  'application/dto',
  'infrastructure/api',
  'infrastructure/repositories',
  'presentation/pages',
];

folders.forEach(folder =>
  fs.mkdirSync(path.join(basePath, folder), { recursive: true })
);

/* ================= FILE WRITER ================= */
function write(filePath: string, content: string) {
  fs.writeFileSync(path.join(basePath, filePath), content.trim() + '\n', 'utf8');
}

/* ================= DOMAIN ================= */
write(
  `domain/entities/${name}.entity.ts`,
  `
export interface ${Name} {
  id: number;
  email: string;
  createdAt: string;
}

export interface Paginated${Name}s {
data: ${Name}[];
total: number;
}

export interface Single${Name}Response {
data: ${Name};
}
`
);

write(
  `domain/interfaces/${name}.repository.ts`,
  `
import type{ ${Name}, Paginated${Name}s, Single${Name}Response } from '../entities/${name}.entity';

export interface ${Name}Repository {
  create(data: Partial<${Name}>): Promise<Paginated${Name}s>;
  getOne(id: any): Promise<Single${Name}Response | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<${Name}[]>;
  update(id: any, data: Partial<${Name}>): Promise<Paginated${Name}s>;
  softDelete(id: any): Promise<Paginated${Name}s>;
  restore(id: any): Promise<Paginated${Name}s>;
  hardDelete(id: any): Promise<Paginated${Name}s>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<${Name}[]>;
}
`
);


/* ================= API ================= */
write(
  `infrastructure/api/${name}.api.ts`,
  `
import axios from '../../../../service/axios';

export const ${name}Api = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/${plural}', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('${plural}/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/${plural}', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/${plural}/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/${plural}/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/${plural}/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/${plural}/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/${plural}/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
`
);


/* ================= REPOSITORY ================= */
write(
  `infrastructure/repositories/${name}.repository.impl.ts`,
  `
import type { ${Name}Repository } from '../../domain/interfaces/${name}.repository';
import { ${name}Api } from '../api/${name}.api';

export class ${Name}RepositoryImpl implements ${Name}Repository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return ${name}Api.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return ${name}Api.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return ${name}Api.getOne(id);
  }

  async create(data: any) {
    return ${name}Api.create(data);
  }

  async update(id: any, data: any) {
    return ${name}Api.update(id, data);
  }

  async softDelete(id: any) {
    return ${name}Api.softDelete(id);
  }

  async restore(id: any) {
    return ${name}Api.restore(id);
  }

  async hardDelete(id: any) {
    return ${name}Api.hardDelete(id);
  }
}
`
);



/* ================= USE CASE ================= */
write(
  `application/use-cases/get-all-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';
import type { GetAll${Name}sDto} from '../dto/get-all-${plural}-dto';

export class GetAll${Name}sUseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAll${Name}sDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
`
);

write(
  `application/use-cases/create-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';
import type { ${Name} } from '../../domain/entities/${plural}.entity';

export class Create${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<${Name}>) {
        return this.repo.create(data);
    }
}
`
);

write(
  `application/use-cases/get-one-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';

export class GetOne${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
`
);

write(
  `application/use-cases/hard-delete-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';

export class HardDelete${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
`
);

write(
  `application/use-cases/soft-delete-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';

export class SoftDelete${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
`
);

write(
  `application/use-cases/restore-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';

export class Restore${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
`
);

write(
  `application/use-cases/update-${plural}.usecase.ts`,
  `
import { ${Name}RepositoryImpl } from '../../infrastructure/repositories/${name}.repository.impl';
import type { ${Name} } from '../../domain/entities/${name}.entity';

export class Update${Name}UseCase {
private repo: ${Name}RepositoryImpl;

  constructor(repo: ${Name}RepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<${Name}>) {
        return this.repo.update(id, data);
    }
}
`
);

write(
  `application/use-cases/get-delete-usecase.ts`,
  `
import { ${Name}RepositoryImpl } from "../../infrastructure/repositories/${name}.repository.impl";
import type { GetAll${Name}sDto } from "../dto/get-all-${plural}-dto";
export class GetDeleted${Name}sUseCase {
    private repo: ${Name}RepositoryImpl;
    constructor(repo: ${Name}RepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAll${Name}sDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
`
);


/* ================= DTO ================= */
write(
  `application/dto/get-all-${plural}-dto.ts`,
  `
export interface GetAll${Name}sDto {
  page?: any;
  perPage?: any;
  search?: string;
}
`
);

/* ================= PAGE ================= */
write(
  `presentation/pages/${Name}ListPage.vue`,
  `
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ${Name}, Paginated${Name}s } from "../../domain/entities/${name}.entity";
import { ${Name}RepositoryImpl } from "../../infrastructure/repositories/${name}.repository.impl";
import { GetAll${Name}sUseCase } from "../../application/use-cases/get-all-${plural}.usecase";
import { SoftDelete${Name}UseCase } from "../../application/use-cases/soft-delete-${plural}.usecase";
import ${name}Form from "./${name}Form.vue";
import Paginator from "../../../../shared/components/paginator.vue";
import ${name}DeletePage from "./${name}DeletePage.vue";

const items = ref<${Name}[]>([]);
const search = ref("");
const showForm = ref(false);
const perPage = 10;
const showDeleted = ref(false);

const route = useRoute();
const router = useRouter();

const totalItems = ref(0);
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new ${Name}RepositoryImpl();
const getUseCase = new GetAll${Name}sUseCase(repo);
const deleteUseCase = new SoftDelete${Name}UseCase(repo);

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

  const result: Paginated${Name}s = await getUseCase.execute(params);
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
      <h1 class="text-2xl font-bold text-slate-800">${Name} Management</h1>
      <div class="flex px-10">
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition mx-10"
          @click="showDeleted = !showDeleted"
        >
          Restore Deleted ${Name}
        </button>
        <button
          class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 transition"
          @click="showForm = true"
        >
          + Add New ${Name}
        </button>
      </div>
    </div>
    
    <${name}DeletePage v-if="showDeleted" @closeForm="closeDeletedFunction()" />
    <${name}Form v-if="showForm" @closeForm="closeFunction()" />

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
            <th class="px-6 py-3 text-left font-semibold">${Name}</th>
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
`
);

//  Form

write(
  `presentation/pages/${name}Form.vue`,
  `
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade"
  >
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">${Name} Form</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input
          v-model="emailValue"
          type="text"
          placeholder="Enter email"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-around gap-3">
        <button
          v-if="route.query.id"
          type="button"
          @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
        >
          Update
        </button>

        <button
          v-else
          type="button"
          @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
        >
          Save
        </button>

        <button
          type="button"
          @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ${Name}RepositoryImpl } from "../../infrastructure/repositories/${name}.repository.impl";
import { Create${Name}UseCase } from "../../application/use-cases/create-${name}s.usecase";
import { Update${Name}UseCase } from "../../application/use-cases/update-${name}s.usecase";
import { GetOne${Name}UseCase } from "../../application/use-cases/get-one-${name}s.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const repo = new ${Name}RepositoryImpl();
const createUseCase = new Create${Name}UseCase(repo);
const updateUseCase = new Update${Name}UseCase(repo);
const getOneUseCase = new GetOne${Name}UseCase(repo);

const emailSchema = yup.object({
  email: yup.string().required("Email is required"),
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: emailSchema,
  initialValues: {
    email: "",
  },
});

const [emailValue] = defineField("email");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    const res: any = await createUseCase.execute({
      email: values.email,
    });

    if (res?.id) {
      emits("closeForm", false);
    }
  } catch (e) {
    console.error("Create error:", e);
  }
});

// Update
const onUpdate = handleSubmit(async (values: any) => {
  try {
    const id = route.query.id;
    const res: any = await updateUseCase.execute(id, {
      email: values.email,
    });

    if (res?.id) {
      emits("closeForm", false);
    }
  } catch (e) {
    console.error("Update error:", e);
  }
});

// Load data for edit
const editItem = async () => {
  const id = route.query.id;
  if (!id) return;

  try {
    const res: any = await getOneUseCase.execute(id);
    setFieldValue("email", res.data.email);
  } catch (e) {
    console.error("Error loading item:", e);
  }
};

// Watch for edit mode
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      editItem();
    } else {
      handleReset();
    }
  },
  { immediate: true }
);
</script>
`
);

write(
  `presentation/pages/${name}DeletePage.vue`,
  `
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
import { ${Name}RepositoryImpl } from "../../infrastructure/repositories/${name}.repository.impl";
import { Pencil, Trash2 } from "lucide-vue-next";
import { GetDeleted${Name}sUseCase } from "../../application/use-cases/get-delete-usecase";
import { computed, onMounted, ref, watch } from "vue";
import type { Paginated${Name}s, ${Name} } from "../../domain/entities/${name}.entity";
import { HardDelete${Name}UseCase } from "../../application/use-cases/hard-delete-${name}s.usecase";
import { Restore${Name}UseCase } from "../../application/use-cases/restore-${name}s.usecase";

const items = ref<${Name}[]>([]);
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["closeForm"]);
const totalItems = ref(0);
const perPage = 10;
const numberOfPage = computed(() => Math.ceil(totalItems.value / perPage));

const repo = new ${Name}RepositoryImpl();
const getDeleted = new GetDeleted${Name}sUseCase(repo);
const hardDelete = new HardDelete${Name}UseCase(repo);
const restore = new Restore${Name}UseCase(repo);

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

  const result: Paginated${Name}s = await getDeleted.execute(params);
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

`);




console.log(`✅ Module "${name}" generated successfully`);

/* ================= HELPERS ================= */
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pluralize(value: string) {
  if (/[bcdfghjklmnpqrstvwxyz]y$/i.test(value)) {
    return value.slice(0, -1) + 'ies';
  }
  return value + 's';
}

