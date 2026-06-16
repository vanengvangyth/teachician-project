<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
      @submit.prevent="route.query.id ? onUpdate() : onSubmit()">

      <h3 class="text-center text-xl font-bold mb-6">ຟອມ</h3>

      <!-- Technician -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່</label>

        <select v-model="technicianIdValue" class="w-full rounded-lg border px-3 py-2 text-sm">
          <option :value="''">-- ເລືອກຜູ້ໃຊ້ --</option>

          <option v-for="u in technicians" :key="u.id" :value="u.id">
            {{ u.user?.fullName ? u.user.fullName : u.user?.email }}
          </option>
        </select>
        <p v-if="errors.technicianId" class="text-red-500 text-xs mt-1">{{ errors.technicianId }}</p>

      </div>

      <!-- Province -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ແຂວງ</label>
        <input v-model="provinceValue" class="w-full rounded-lg border px-3 py-2 text-sm" type="text"
          placeholder="ແຂວງ" />
          <p v-if="errors.province" class="text-red-500 text-xs mt-1">{{ errors.province }}</p>
      </div>

      <!-- District -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ເມືອງ</label>
        <input v-model="districtValue" class="w-full rounded-lg border px-3 py-2 text-sm" type="text"
          placeholder="ເມືອງ" />
          <p v-if="errors.district" class="text-red-500 text-xs mt-1">{{ errors.district }}</p>
      </div>

      <!-- Village -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ບ້ານ</label>
        <input v-model="villageValue" class="w-full rounded-lg border px-3 py-2 text-sm" type="text"
          placeholder="ບ້ານ" />
          <p v-if="errors.village" class="text-red-500 text-xs mt-1">{{ errors.village }}</p>
      </div>

      <!-- Buttons -->
      <div class="flex justify-between gap-3">

        <button type="button" @click="emits('closeForm', false)" class="px-4 py-2 bg-slate-200 rounded-lg">
          ຍົກເລີກ
        </button>

        <button type="submit" class="px-4 py-2 bg-sky-500 text-white rounded-lg">
          {{ route.query.id ? 'ອັບເດດ' : 'ບັນທຶກ' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { Service_areaRepositoryImpl } from "../../infrastructure/repositories/service_area.repository.impl";
import { CreateService_areaUseCase } from "../../application/use-cases/create-service_areas.usecase";
import { UpdateService_areaUseCase } from "../../application/use-cases/update-service_areas.usecase";
import { GetOneService_areaUseCase } from "../../application/use-cases/get-one-service_areas.usecase";
import { TechicianRepositoryImpl } from "../../../techician/infrastructure/repositories/techician.repository.impl";
import { GetAllTechiciansUseCase } from "../../../techician/application/use-cases/get-all-techicians.usecase";
import { useToastStore } from "../../../../stores/toast";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const technicians = ref<any[]>([]);
const toastStore = useToastStore();

const repo = new Service_areaRepositoryImpl();
const techRepo = new TechicianRepositoryImpl();
const getAllTechUseCase = new GetAllTechiciansUseCase(techRepo);

const createUseCase = new CreateService_areaUseCase(repo);
const updateUseCase = new UpdateService_areaUseCase(repo);
const getOneUseCase = new GetOneService_areaUseCase(repo);

const schema = yup.object({
  technicianId: yup.mixed()
    .test("required", "ກະລຸນາເລືອກຊ່າງ", (val) => !!val),

  province: yup.string().required("ກະລຸນາປ້ອນແຂວງ"),
  district: yup.string().required("ກະລຸນາປ້ອນເມືອງ"),
  village: yup.string().required("ກະລຸນາປ້ອນບ້ານ"),
});

const { handleSubmit, defineField, setFieldValue, resetForm, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    technicianId: "",
    province: "",
    district: "",
    village: "",
  },
});

const [technicianIdValue] = defineField("technicianId");
const [provinceValue] = defineField("province");
const [districtValue] = defineField("district");
const [villageValue] = defineField("village");

// CREATE
const onSubmit = handleSubmit(async (values) => {
  try {
    await createUseCase.execute({
      ...values,
      technicianId: values.technicianId ? Number(values.technicianId) : null,
    });

    toastStore.toast("ສ້າງສຳເລັດ");
    emits("closeForm", false);
  } catch (error) {
    console.error(error);
    toastStore.toast("ສ້າງບໍ່ສຳເລັດ");
  }
});

// UPDATE
const onUpdate = handleSubmit(async (values) => {
  try {
    const id = Number(route.query.id);
    await updateUseCase.execute(id, {
      ...values,
      technicianId: values.technicianId ? Number(values.technicianId) : null,
    });

    toastStore.toast("ອັບເດດສຳເລັດ");
    emits("closeForm", false);
  }
  catch (error) {
    console.error(error);
    toastStore.toast("ອັບເດດບໍ່ສຳເລັດ");
  }
});

// LOAD EDIT
async function loadEdit(id: number) {
  const res = await getOneUseCase.execute(id);

  setFieldValue("technicianId", res.data.technicianId);
  setFieldValue("province", res.data.province);
  setFieldValue("district", res.data.district);
  setFieldValue("village", res.data.village);
}

// WATCH EDIT MODE
watch(
  () => route.query.id,
  (id) => {
    if (id) loadEdit(Number(id));
    else resetForm();
  },
  { immediate: true }
);
async function fetchTechnicians() {
  try {
    const res = await getAllTechUseCase.execute();
    // ສົມມຸດວ່າ API return { data: [...] }
    technicians.value = res.data;
  } catch (error) {
    console.error("Failed to fetch technicians", error);
  }
}
onMounted(() => {
  fetchTechnicians();
});
</script>