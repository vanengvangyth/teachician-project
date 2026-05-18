<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມບັນທຶກລະບົບ</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">user_id</label>
        <select v-model="user_idValue"
          class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກຜູ້ໃຊ້ --</option>
          <option v-for="u in users" :key="u.id" :value="u.id">
            {{ u.fullName || u.email }}
          </option>
        </select>
        <p v-if="errors.user_id" class="text-red-500 text-xs mt-1">{{ errors.user_id }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">action</label>
        <input v-model="actionValue" type="text" placeholder="Enter action"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
        <p v-if="errors.action" class="text-red-500 text-xs mt-1">{{ errors.action }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ip_address</label>
        <input v-model="ip_addressValue" type="text" placeholder="Enter ip_address"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
        <p v-if="errors.ip_address" class="text-red-500 text-xs mt-1">{{ errors.ip_address }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">user_agent</label>
        <input v-model="user_agentValue" type="text" placeholder="Enter user_agent"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
        <p v-if="errors.user_agent" class="text-red-500 text-xs mt-1">{{ errors.user_agent }}</p>

      </div>

      <!-- Buttons -->
      <div class="flex justify-around gap-3">
        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
          ຍົກເລີກ
        </button>

        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition">
          ອັບເດດ
        </button>

        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition">
          ບັນທຶກ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { SystemlogRepositoryImpl } from "../../infrastructure/repositories/systemlog.repository.impl";
import { CreateSystemlogUseCase } from "../../application/use-cases/create-systemlogs.usecase";
import { UpdateSystemlogUseCase } from "../../application/use-cases/update-systemlogs.usecase";
import { GetOneSystemlogUseCase } from "../../application/use-cases/get-one-systemlogs.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { UserRepositoryImpl } from "../../../user/infrastructure/repositories/user.repository.impl";
import { GetUsersUseCase } from "../../../user/application/use-cases/get-users.usecase";
import { useToastStore } from "../../../../stores/toast";

const route = useRoute();
const emits = defineEmits(["closeForm"]);
const toastStore = useToastStore();

const users = ref<any[]>([]);
const userRepo = new UserRepositoryImpl();
const getUsersUseCase = new GetUsersUseCase(userRepo);


const repo = new SystemlogRepositoryImpl();
const createUseCase = new CreateSystemlogUseCase(repo);
const updateUseCase = new UpdateSystemlogUseCase(repo);
const getOneUseCase = new GetOneSystemlogUseCase(repo);

const Schema = yup.object({
  user_id: yup.mixed().test("required", "ກະລຸນາເລືອກຜູ້ໃຊ້", (val) => !!val),
  action: yup.string().required("ກະລຸນາປ້ອນ action"),
  ip_address: yup.string().required("ກະລຸນາປ້ອນ ip_address"),
  user_agent: yup.string().required("ກະລຸນາປ້ອນ user_agent"),
});

const loadUsers = async () => {
  try {
    const res = await getUsersUseCase.execute({ page: 1, perPage: 100 });
    users.value = res.data ?? res;
  } catch (e) {
    console.error("Load users error:", e);
  }
};

onMounted(loadUsers);

const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: Schema,
  initialValues: {
    user_id: "",
    action: "",
    ip_address: "",
    user_agent: "",
  },
});

const [user_idValue] = defineField("user_id");
const [actionValue] = defineField("action");
const [ip_addressValue] = defineField("ip_address");
const [user_agentValue] = defineField("user_agent");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    await createUseCase.execute({
      user_id: values.user_id,
      action: values.action,
      ip_address: values.ip_address,
      user_agent: values.user_agent,
    });

    toastStore.toast("ບັນທຶກສຳເລັດ");
    emits("closeForm", false); 
  } catch (e) {
    console.error("Create error:", e);
    toastStore.toast("ບັນທຶກບໍ່ສຳເລັດ");
  }
});

// Update
const onUpdate = handleSubmit(async (values: any) => {
  try {
    const id = Number(route.query.id); 
    await updateUseCase.execute(id, {
      user_id: values.user_id,
      action: values.action,
      ip_address: values.ip_address,
      user_agent: values.user_agent,
    });

    toastStore.toast("ແກ້ໄຂສຳເລັດ");
    emits("closeForm", false); 
  } catch (e) {
    console.error("Update error:", e);
    toastStore.toast("ແກ້ໄຂບໍ່ສຳເລັດ");
  }
});

// Load data for edit
const editItem = async () => {
  const id = route.query.id;
  if (!id) return;

  try {
    const res: any = await getOneUseCase.execute(id);
    setFieldValue("user_id", res.data.user_id);
    setFieldValue("action", res.data.action);
    setFieldValue("ip_address", res.data.ip_address);
    setFieldValue("user_agent", res.data.user_agent);
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
