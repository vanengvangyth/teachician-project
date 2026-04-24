<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມໝວດໝູ່</h3>

      <!-- nameEng -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ (ENG)</label>
        <input v-model="nameEngValue" type="text"
          class="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>

      <!-- nameLao -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່ (LAO)</label>
        <input v-model="nameLaoValue" type="text"
          class="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>

      <!-- description -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Description (LAO)</label>
        <input v-model="descriptionLaoValue" type="text"
          class="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Description (ENG)</label>
        <input v-model="descriptionEngValue" type="text"
          class="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>

      <!-- IMAGE UPLOAD -->
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">ຮູບພາບ</label>

        <!-- preview -->
        <div v-if="previewUrl" class="mb-2">
          <img :src="previewUrl"
            class="w-full h-40 object-cover rounded-lg border" />
        </div>

        <!-- upload -->
        <label class="flex justify-center items-center border-2 border-dashed rounded-lg py-4 cursor-pointer hover:border-sky-400">
          📎 ເລືອກຮູບ
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <p v-if="iconUrlValue" class="text-xs text-gray-400 mt-1 truncate">
          {{ iconUrlValue }}
        </p>
      </div>

      <!-- BUTTON -->
      <div class="flex justify-around gap-3">
        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white rounded-lg">
          Update
        </button>

        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white rounded-lg">
          Save
        </button>

        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-gray-200 rounded-lg">
          Cancel
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
import { getImageUrl } from "../../../../shared/utils/image.util";
import { useToastStore } from "../../../../stores/toast";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const previewUrl = ref("");
const toastStore = useToastStore();

const repo = new CategoryRepositoryImpl();
const createUseCase = new CreateCategoryUseCase(repo);
const updateUseCase = new UpdateCategoryUseCase(repo);
const getOneUseCase = new GetOneCategoryUseCase(repo);

/* ===================== UPLOAD ===================== */
const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  previewUrl.value = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setFieldValue("iconUrl", data.url);
  } catch (err) {
    console.error("Upload error:", err);
  }
};

/* ===================== FORM ===================== */
const schema = yup.object({
  nameEng: yup.string().required(),
  nameLao: yup.string().required(),
  descriptionLao: yup.string(),
  descriptionEng: yup.string(),
  iconUrl: yup.string(),
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: schema,
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

/* ===================== CREATE ===================== */
const onSubmit = handleSubmit(async (values) => {
  try {
    await createUseCase.execute(values);

    toastStore.toast("ສ້າງສຳເລັດ ✅");

    emits("closeForm", false);
  } catch (error) {
    console.error(error);
    toastStore.toast("ສ້າງບໍ່ສຳເລັດ ❌");
  }
});

/* ===================== UPDATE ===================== */
const onUpdate = handleSubmit(async (values) => {
  try {
    const id = route.query.id;

    await updateUseCase.execute(id, values);

    toastStore.toast("ອັບເດດສຳເລັດ ✅");

    emits("closeForm", false);
  } catch (error) {
    console.error(error);
    toastStore.toast("ອັບເດດບໍ່ສຳເລັດ ❌");
  }
});

/* ===================== EDIT ===================== */
const editItem = async () => {
  const id = route.query.id;
  if (!id) return;

  const res: any = await getOneUseCase.execute(id);

  setFieldValue("nameEng", res.data.nameEng);
  setFieldValue("nameLao", res.data.nameLao);
  setFieldValue("descriptionLao", res.data.descriptionLao);
  setFieldValue("descriptionEng", res.data.descriptionEng);
  setFieldValue("iconUrl", res.data.iconUrl);

  // ✅ สำคัญ: show รูปเก่า
  if (res.data.iconUrl) {
  previewUrl.value = getImageUrl(res.data.iconUrl);
}
};

/* ===================== WATCH ===================== */
watch(
  () => route.query.id,
  (id) => {
    if (id) editItem();
    else handleReset();
  },
  { immediate: true }
);
</script>