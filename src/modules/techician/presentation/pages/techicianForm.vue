<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມນາຍຊ່າງ</h3>

      <!-- userId -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່</label>
        <select v-model="userIdValue"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກຊ່າງ --</option>
          <option v-for="u in technicians" :key="u.id" :value="u.id">
            {{ u.user?.fullName }}
          </option>
        </select>
        <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.userId }}</p>
      </div>

      <!-- descriptionLao -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ (Lao)</label>
        <input v-model="descriptionLaoValue" type="text" placeholder="ຄຳອະທິບາຍລາວ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <p v-if="errors.descriptionLao" class="text-red-500 text-xs mt-1">{{ errors.descriptionLao }}</p>
      </div>

      <!-- descriptionEng -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ (Eng)</label>
        <input v-model="descriptionEngValue" type="text" placeholder="ຄຳອະທິບາຍອອັງກິດ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <p v-if="errors.descriptionEng" class="text-red-500 text-xs mt-1">{{ errors.descriptionEng }}</p>
      </div>

      <!-- years -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ປະສົບການ</label>
        <input v-model="yearsValue" type="number" placeholder="ປີ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <p v-if="errors.yearsOfExperience" class="text-red-500 text-xs mt-1">{{ errors.yearsOfExperience }}</p>
      </div>

      <!-- Buttons -->
      <div class="flex justify-around gap-3">
        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg">
          Update
        </button>

        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg">
          Save
        </button>

        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg">
          Cancel
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

import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import { CreateTechicianUseCase } from "../../application/use-cases/create-techicians.usecase";
import { UpdateTechicianUseCase } from "../../application/use-cases/update-techicians.usecase";
import { GetOneTechicianUseCase } from "../../application/use-cases/get-one-techicians.usecase";
import { GetUsersUseCase } from "../../../user/application/use-cases/get-users.usecase";
import { useToastStore } from "../../../../stores/toast";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const toatStore = useToastStore();

const technicians = ref<any[]>([]);
const userRepo = new TechicianRepositoryImpl();
const getUsersUseCase = new GetUsersUseCase(userRepo); 

const repo = new TechicianRepositoryImpl();
const createUseCase = new CreateTechicianUseCase(repo);
const updateUseCase = new UpdateTechicianUseCase(repo);
const getOneUseCase = new GetOneTechicianUseCase(repo);

/* ✅ FIX: proper number schema */
const schema = yup.object({
  userId: yup
    .mixed()
    .required("ກະລຸນາເລືອກຊ່າງ")
    .test("not-null", "ກະລຸນາເລືອກຊ່າງ", (val) => val !== null && val !== undefined),

  descriptionLao: yup
    .string()
    .required("ກະລຸນາປ້ອນຄໍາອະທິບາຍພາສາລາວ")
    .min(3, "ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ")
    .max(300, "ຕ້ອງບໍ່ເກີນ 300 ຕົວອັກສອນ"),

  descriptionEng: yup
    .string()
    .required("ກະລຸນາປ້ອນຄໍາອະທິບາຍພາສາອັງກິດ")
    .min(3, "ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ")
    .max(300, "ຕ້ອງບໍ່ເກີນ 300 ຕົວອັກສອນ"),

  yearsOfExperience: yup
    .number()
    .typeError("ກະລຸນາປ້ອນຕົວເລກ")
    .required("ກະລຸນາປ້ອນປີປະສົບການ")
    .min(0, "ປີປະສົບການຕ້ອງບໍ່ຕິດລົບ")
    .max(50, "ປີປະສົບການຕ້ອງບໍ່ເກີນ 50 ປີ"),
});

/* ✅ FIX: null instead of "" for numbers */
const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    userId: null,
    descriptionLao: "",
    descriptionEng: "",
    yearsOfExperience: null,
  },
});

const [userIdValue] = defineField("userId");
const [descriptionLaoValue] = defineField("descriptionLao");
const [descriptionEngValue] = defineField("descriptionEng");
const [yearsValue] = defineField("yearsOfExperience");

const loadUsers = async () => {
  try {
    const res = await getUsersUseCase.execute();
    technicians.value = res.data.map((t: any) => ({
      id: t.id,
      user: {
        fullName: t.user?.fullName ?? "",
      },
    }));
  } catch (e) {
    console.error("Error loading technicians:", e);
  }
};

/* CREATE */
const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await createUseCase.execute({
      userId: Number(values.userId),
      descriptionLao: values.descriptionLao,
      descriptionEng: values.descriptionEng,
      yearsOfExperience: Number(values.yearsOfExperience),
    });

    toatStore.toast("ບັນທຶກສໍາເລັດແລ້ວ");
    if (res?.id) emits("closeForm", false);
  } catch (e) {
    console.error("Create error:", e);
    toatStore.toast("ບັນທຶກບໍ່ສໍາເລັດ");
  }
});

/* UPDATE */
const onUpdate = handleSubmit(async (values) => {
  try {
    const id = Number(route.query.id);

    const res = await updateUseCase.execute(id, {
      userId: Number(values.userId),
      descriptionLao: values.descriptionLao,
      descriptionEng: values.descriptionEng,
      yearsOfExperience: Number(values.yearsOfExperience),
    });

    toatStore.toast("ແກ້ໄຂສໍາເລັດແລ້ວ");
    if (res?.id) emits("closeForm", false);
  } catch (e) {
    console.error("Update error:", e);
    toatStore.toast("ແກ້ໄຂບໍ່ສໍາເລັດ");
  }
});

/* LOAD EDIT DATA */
const editItem = async (id: number) => {
  try {
    const res: any = await getOneUseCase.execute(id);

    if (!res?.data) return;

    setFieldValue("userId", res.data.userId);
    setFieldValue("descriptionLao", res.data.descriptionLao);
    setFieldValue("descriptionEng", res.data.descriptionEng);
    setFieldValue("yearsOfExperience", res.data.yearsOfExperience);
  } catch (e) {
    console.error("Error loading item:", e);
  }
};

/* WATCH ROUTE */
watch(
  () => route.query.id,
  (newId) => {
    const id = Number(newId);

    if (id) {
      editItem(id);
    } else {
      handleReset();
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadUsers();
});
</script>