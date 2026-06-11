<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <h3 class="text-center text-xl font-bold mb-6 text-slate-800">Technician Service Form</h3>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ຊ່າງ</label>
        <select v-model="technicianIdValue"
          class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກຊ່າງ --</option>
          <option v-for="t in technicians" :key="t.id" :value="t.id">
            {{ t.user?.fullName || 'Unknown Name' }}
          </option>
        </select>
        <p v-if="errors.technicianId" class="text-red-500 text-xs mt-1">{{ errors.technicianId }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ປະເພດ</label>
        <select v-model="categoryIdValue"
          class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກປະເພດ --</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.nameLao }}
          </option>
        </select>
        <p v-if="errors.categoryId" class="text-red-500 text-xs mt-1">{{ errors.categoryId }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ</label>
        <textarea v-model="descriptionValue" class="w-full rounded-lg border px-3 py-2 text-sm" rows="3"
          placeholder="ຄຳອະທິບາຍ"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">ລາຄາຕໍ່າສຸດ</label>
          <input v-model="minPriceValue" type="number" placeholder="00" class="w-full rounded-lg border px-3 py-2" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">ລາຄາສູງສຸດ</label>
          <input v-model="maxPriceValue" type="number" placeholder="00" class="w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition">
          ຍົກເລີກ
        </button>
        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition">
          ອັບເດດ
        </button>
        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition">
          ບັນທຶກ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { Technician_serviceRepositoryImpl } from "../../infrastructure/repositories/technician_service.repository.impl";
import { CreateTechnician_serviceUseCase } from "../../application/use-cases/create-technician_services.usecase";
import { UpdateTechnician_serviceUseCase } from "../../application/use-cases/update-technician_services.usecase";
import { GetOneTechnician_serviceUseCase } from "../../application/use-cases/get-one-technician_services.usecase";
import { TechicianRepositoryImpl } from "../../../techician/infrastructure/repositories/techician.repository.impl";
import { CategoryRepositoryImpl } from "../../../category/infrastructure/repositories/category.repository.impl";
import { GetAllTechiciansUseCase } from "../../../techician/application/use-cases/get-all-techicians.usecase";
import { GetAllCategorysUseCase } from "../../../category/application/use-cases/get-all-categories.usecase";
import { useToastStore } from "../../../../stores/toast";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const toatStore = useToastStore();

const repo = new Technician_serviceRepositoryImpl();
const createUseCase = new CreateTechnician_serviceUseCase(repo);
const updateUseCase = new UpdateTechnician_serviceUseCase(repo);
const getOneUseCase = new GetOneTechnician_serviceUseCase(repo);

const technicians = ref<any[]>([]);
const categories = ref<any[]>([]);

const techUseCase = new GetAllTechiciansUseCase(new TechicianRepositoryImpl());
const catUseCase = new GetAllCategorysUseCase(new CategoryRepositoryImpl());

// ປ່ຽນເປັນ .mixed() ເພື່ອຮອງຮັບ ID ທີ່ເປັນ String/UUID
const schema = yup.object({
  technicianId: yup
    .mixed()
    .required("ກະລຸນາເລືອກຊ່າງ")
    .test("not-null", "ກະລຸນາເລືອກຊ່າງ", (val) => val !== null && val !== undefined),

  categoryId: yup
    .mixed()
    .required("ກະລຸນາເລືອກປະເພດ")
    .test("not-null", "ກະລຸນາເລືອກປະເພດ", (val) => val !== null && val !== undefined),

  description: yup
    .string()
    .required("ກະລຸນາປ້ອນຄໍາອະທິບາຍ")
    .min(3, "ຄໍາອະທິບາຍຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ")
    .max(500, "ຄໍາອະທິບາຍຕ້ອງບໍ່ເກີນ 500 ຕົວອັກສອນ"),

  minPrice: yup
    .number()
    .typeError("ກະລຸນາປ້ອນຕົວເລກ")
    .required("ກະລຸນາປ້ອນລາຄາຕໍ່າສຸດ")
    .min(0, "ລາຄາຕໍ່າສຸດຕ້ອງບໍ່ຕິດລົບ"),

  maxPrice: yup
    .number()
    .typeError("ກະລຸນາປ້ອນຕົວເລກ")
    .required("ກະລຸນາປ້ອນລາຄາສູງສຸດ")
    .min(0, "ລາຄາສູງສຸດຕ້ອງບໍ່ຕິດລົບ")
    .test(
      "max-greater-than-min",
      "ລາຄາສູງສຸດຕ້ອງຫຼາຍກວ່າລາຄາຕໍ່າສຸດ",
      function (val) {
        return val >= this.parent.minPrice;
      }
    ),
});

const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    technicianId: null,
    categoryId: null,
    description: "",
    minPrice: 0,
    maxPrice: 0,
  },
});

const [technicianIdValue] = defineField("technicianId");
const [categoryIdValue] = defineField("categoryId");
const [descriptionValue] = defineField("description");
const [minPriceValue] = defineField("minPrice");
const [maxPriceValue] = defineField("maxPrice");

const loadDropdowns = async () => {
  try {
    const techRes = await techUseCase.execute();
    const catRes = await catUseCase.execute();
    // ກວດສອບວ່າຂໍ້ມູນຢູ່ໃນ .data ຫຼື ມາເປັນ Array ເລີຍ
    technicians.value = Array.isArray(techRes) ? techRes : techRes.data;
    categories.value = Array.isArray(catRes) ? catRes : catRes.data;
  } catch (e) {
    console.error("Dropdown loading failed", e);
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await createUseCase.execute(values);
    toatStore.toast("ບັນທຶກສໍາເລັດແລ້ວ");
    if (res?.data?.id) emits("closeForm", true);
  } catch (e: any) {
    console.error("Create error:", e);
    
    let errorMessage = "ບັນທຶກບໍ່ສໍາເລັດ";
    if (e.response?.data?.message) {
      const msg = e.response.data.message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join(", ");
      } else if (typeof msg === "string") {
        if (msg.includes("already exists")) {
          errorMessage = "ບໍລິການຊ່າງນີ້ມີຢູ່ແລ້ວໃນລະບົບ (Technician service already exists)";
        } else {
          errorMessage = msg;
        }
      }
    } else if (e.message) {
      errorMessage = e.message;
    }
    toatStore.toast(errorMessage);
  }
});

const onUpdate = handleSubmit(async (values) => {
  try {
    const id = Number(route.query.id);
    const res = await updateUseCase.execute(id, values);
    
    toatStore.toast("ບັນທຶກສໍາເລັດແລ້ວ");
    if (res) emits("closeForm", true);
  } catch (e: any) {
    console.error("Update error:", e);
    
    let errorMessage = "ບັນທຶກບໍ່ສໍາເລັດ";
    if (e.response?.data?.message) {
      const msg = e.response.data.message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join(", ");
      } else if (typeof msg === "string") {
        if (msg.includes("already exists")) {
          errorMessage = "ບໍລິການຊ່າງນີ້ມີຢູ່ແລ້ວໃນລະບົບ (Technician service already exists)";
        } else {
          errorMessage = msg;
        }
      }
    } else if (e.message) {
      errorMessage = e.message;
    }
    toatStore.toast(errorMessage);
  }
});

const loadEdit = async (id: number) => {
  const res = await getOneUseCase.execute(id);
  const data = res.data || res;
  setFieldValue("technicianId", data.technician?.id);
  setFieldValue("categoryId", data.category?.id);
  setFieldValue("description", data.description);
  setFieldValue("minPrice", data.minPrice);
  setFieldValue("maxPrice", data.maxPrice);
};

onMounted(async () => {
  await loadDropdowns();
  if (route.query.id) await loadEdit(Number(route.query.id));
});

watch(() => route.query.id, (newId) => {
  if (!newId) handleReset();
});
</script>