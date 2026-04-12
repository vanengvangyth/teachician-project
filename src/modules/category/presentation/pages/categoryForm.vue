<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມໝວດໝູ່</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ພາສາອັງກິດ</label>
        <input v-model="nameEngValue" type="text" placeholder="ຊື່ພາສາອັງກິດ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
      </div>
      <!-- nameLao -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ພາສາລາວ</label>
        <input v-model="nameLaoValue" type="text" placeholder="ຊື່ພາສາລາວ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <!-- descriptionLao -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ-ລາວ</label>
        <input v-model="descriptionLaoValue" type="text" placeholder="ຄຳອະທິບາຍ-ລາວ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <!-- descriptionEng -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄຳອະທິບາຍ-ອັງກິດ</label>
        <input v-model="descriptionEngValue" type="text" placeholder="ຄຳອະທິບາຍ-ອັງກິດ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <!-- iconUrl -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຮູບພາບ</label>
        <input v-model="iconUrlValue" type="text" placeholder="ຮູບພາບ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <!-- Buttons -->
      <div class="flex justify-around gap-3">
        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition">
          Update
        </button>

        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition">
          ບັນທຶກ
        </button>

        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
          ຍົກເລີກ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { CategoryRepositoryImpl } from "../../infrastructure/repositories/category.repository.impl";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { CreateCategoryUseCase } from "../../application/use-cases/create-categories.usecase";
import { UpdateCategoryUseCase } from "../../application/use-cases/update-categories.usecase";
import { GetOneCategoryUseCase } from "../../application/use-cases/get-one-categories.usecase";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const repo = new CategoryRepositoryImpl();
const createUseCase = new CreateCategoryUseCase(repo);
const updateUseCase = new UpdateCategoryUseCase(repo);
const getOneUseCase = new GetOneCategoryUseCase(repo);

const nameEngSchema = yup.object({
  nameEng: yup.string().required("nameEng is required"),
  nameLao: yup.string().required("nameLao is required"),
  descriptionLao: yup.string(),
  descriptionEng: yup.string(),
  iconUrl: yup.string(),
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: nameEngSchema,
  initialValues: {
    nameEng: "",
    nameLao: "",
    descriptionLao: "",
    descriptionEng: "",
    iconUrl: "",
  },
});


const [nameEngValue] = defineField("nameEng");
const [nameLaoValue] = defineField("nameLao");
const [descriptionLaoValue] = defineField("descriptionLao");
const [descriptionEngValue] = defineField("descriptionEng");
const [iconUrlValue] = defineField("iconUrl");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    const res: any = await createUseCase.execute({
      nameEng: values.nameEng,
      nameLao: values.nameLao,
      descriptionLao: values.descriptionLao,
      descriptionEng: values.descriptionEng,
      iconUrl: values.iconUrl,
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
      nameEng: values.nameEng,
      nameLao: values.nameLao,
      descriptionLao: values.descriptionLao,
      descriptionEng: values.descriptionEng,
      iconUrl: values.iconUrl,
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

    setFieldValue("nameEng", res.data.nameEng);
    setFieldValue("nameLao", res.data.nameLao);
    setFieldValue("descriptionLao", res.data.descriptionLao);
    setFieldValue("descriptionEng", res.data.descriptionEng);
    setFieldValue("iconUrl", res.data.iconUrl);
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
