<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">Attachment Form</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">job_id</label>
        <input v-model="job_idValue" type="text" placeholder="Enter job_id"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">ຮູບພາບ</label>

        <!-- preview -->
        <div v-if="previewUrl" class="mb-2">
          <img :src="previewUrl" class="w-full h-40 object-cover rounded-lg border" />
        </div>

        <!-- upload -->
        <label
          class="flex justify-center items-center border-2 border-dashed rounded-lg py-4 cursor-pointer hover:border-sky-400">
          📎 ເລືອກຮູບ
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <p v-if="fileUrlValue" class="text-xs text-gray-400 mt-1 truncate">
          {{ fileUrlValue }}
        </p>
        <p v-if="errors.fileUrl" class="text-red-500 text-xs mt-1">{{ errors.fileUrl }}</p>
      </div>


      <!-- Buttons -->
      <div class="flex justify-around gap-3">
        <button v-if="route.query.id" type="button" @click="onUpdate"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition">
          Update
        </button>

        <button v-else type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition">
          Save
        </button>

        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { AttachmentRepositoryImpl } from "../../infrastructure/repositories/attachment.repository.impl";
import { CreateAttachmentUseCase } from "../../application/use-cases/create-attachments.usecase";
import { UpdateAttachmentUseCase } from "../../application/use-cases/update-attachments.usecase";
import { GetOneAttachmentUseCase } from "../../application/use-cases/get-one-attachments.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToastStore } from "../../../../stores/toast";
import { getImageUrl } from "../../../../shared/utils/image.util";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const previewUrl = ref("");
const toastStore = useToastStore();

const repo = new AttachmentRepositoryImpl();
const createUseCase = new CreateAttachmentUseCase(repo);
const updateUseCase = new UpdateAttachmentUseCase(repo);
const getOneUseCase = new GetOneAttachmentUseCase(repo);

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  previewUrl.value = URL.createObjectURL(file);

  const formData = new FormData();

  // 🔥 IMPORTANT: must match backend "FilesInterceptor('files')"
  formData.append("files", file);

  try {
    const res = await fetch("http://localhost:3000/attachments", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    console.log("UPLOAD RESPONSE:", data);

    // backend should return fileUrl (or adjust if different)
    setFieldValue("fileUrl", data.fileUrl || data.url);

  } catch (err) {
    console.error("Upload error:", err);
  }
};

const job_idSchema = yup.object({
  job_id: yup.string().required("job_id is required"),
  fileUrl: yup.string().required("fileUrl is required"),
});

const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: job_idSchema,
  initialValues: {
    job_id: "",
    fileUrl: "",
  },
});

const [job_idValue] = defineField("job_id");
const [fileUrlValue] = defineField("fileUrl");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    console.log("SUBMIT VALUES:", values);

    await createUseCase.execute(values);

    toastStore.toast("ສຳເລັດ");
    emits("closeForm", false);
  } catch (e) {
    console.error("Create error:", e);
    toastStore.toast("ບໍ່ສຳເລັດ");
  }
});

// Update
const onUpdate = handleSubmit(async (values: any) => {
  try {
    const id = String(route.query.id);

    if (!id) return;

    await updateUseCase.execute(id, values);

    emits("closeForm", false);
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

    setFieldValue("job_id", res.data.job_id);
    setFieldValue("fileUrl", res.data.fileUrl);

    // 🔥 FIX: use correct field
    if (res.data.fileUrl) {
      previewUrl.value = getImageUrl(res.data.fileUrl);
    }

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
