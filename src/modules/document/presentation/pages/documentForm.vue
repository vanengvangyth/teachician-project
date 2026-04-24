<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມເອກະສານ</h3>

      <!-- technician -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຊື່</label>
        <select v-model="technicianValue"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກຊ່າງ --</option>
          <option v-for="u in technicians" :key="u.id" :value="u.id">
            {{ u.user?.fullName }}
          </option>
        </select>
      </div>

      <!-- documentType -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ປະເພດເອກະສານ</label>
        <select v-model="documentTypeValue"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
          <option value="">-- ເລືອກປະເພດ --</option>
          <option value="id_card">ບັດປະຈຳຕົວ</option>
          <option value="certificate">ໃບຢັ້ງຢືນ</option>
          <option value="portfolio">ພອດໂຟລິໂອ</option>
          <option value="other">ອື່ນໆ</option>
        </select>
      </div>

      <!-- fileUrl -->
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">ຮູບພາບ</label>

        <div v-if="previewUrl" class="mb-2">
          <img :src="previewUrl" class="w-full h-40 object-cover rounded-lg border border-slate-200" />
        </div>

        <label
          class="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 cursor-pointer hover:border-sky-400 hover:text-sky-500 transition">
          <span>📎 ເລືອກຮູບພາບ</span>
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <p v-if="fileUrlValue" class="text-xs text-slate-400 mt-1 truncate">{{ fileUrlValue }}</p>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { DocumentRepositoryImpl } from "../../infrastructure/repositories/document.repository.impl";
import { CreateDocumentUseCase } from "../../application/use-cases/create-documents.usecase";
import { UpdateDocumentUseCase } from "../../application/use-cases/update-documents.usecase";
import { GetOneDocumentUseCase } from "../../application/use-cases/get-one-documents.usecase";
import { GetAllTechiciansUseCase } from "../../../techician/application/use-cases/get-all-techicians.usecase";
import { TechicianRepositoryImpl } from "../../../techician/infrastructure/repositories/techician.repository.impl";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { getImageUrl } from "../../../../shared/utils/image.util";
import { useToastStore } from "../../../../stores/toast";


const technicianRepo = new TechicianRepositoryImpl();
const getAllTechiciansUseCase = new GetAllTechiciansUseCase(technicianRepo);

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const toastStore = useToastStore();

const previewUrl = ref<string>("");
const technicians = ref<any[]>([]);

const repo = new DocumentRepositoryImpl();
const createUseCase = new CreateDocumentUseCase(repo);
const updateUseCase = new UpdateDocumentUseCase(repo);
const getOneUseCase = new GetOneDocumentUseCase(repo);

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
    setFieldValue("fileUrl", data.url); 
  } catch (e) {
    console.error("Error uploading file:", e);
  }
};

const documentSchema = yup.object({
  technicianId: yup
    .number()
    .nullable()
    .min(1, "ກະລຸນາເລືອກຊ່າງ") 
    .required("ກະລຸນາເລືອກຊ່າງ"),
  documentType: yup
    .string()
    .oneOf(['id_card', 'certificate', 'portfolio', 'other'], "ປະເພດບໍ່ຖືກຕ້ອງ")
    .required("ກະລຸນາເລືອກປະເພດ"),
  fileUrl: yup.string().required("ກະລຸນາເລືອກຮູບພາບ"),
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: documentSchema,
  initialValues: {
    technicianId: null as number | null, 
    documentType: "",
    fileUrl: "",
  },
});

const [technicianValue] = defineField("technicianId");
const [documentTypeValue] = defineField("documentType");
const [fileUrlValue] = defineField("fileUrl");

const loadTechnicians = async () => {
  try {
    const res = await getAllTechiciansUseCase.execute();
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

const onSubmit = handleSubmit(async (values) => {
  try {
    const res: any = await createUseCase.execute({
      technicianId: values.technicianId,
      documentType: values.documentType,
      fileUrl: values.fileUrl,
    });

    toastStore.toast("ສຳເລັດ");
    if (res?.data?.id) {
      emits("closeForm", false);
    }
  } catch (e: any) {
    console.error("Create error:", e);
    toastStore.toast("ບໍ່ສຳເລັດ");
  }
});

const onUpdate = handleSubmit(async (values) => {
  try {
    const id = route.query.id as string;
    const res: any = await updateUseCase.execute(id, {
      technicianId: values.technicianId,
      documentType: values.documentType,
      fileUrl: values.fileUrl,
    });

    toastStore.toast("ອັບເດດສຳເລັດ");  
    if (res?.docId) {
      emits("closeForm", false);
    }
  } catch (e) {
    console.error("Update error:", e);
    toastStore.toast("ອັບເດດບໍ່ສຳເລັດ");
  }
});

const editItem = async () => {
  const id = route.query.id;
  if (!id) return;

  try {
    const res: any = await getOneUseCase.execute(id);
    console.log("🔥 ຂໍ້ມູນຈາກ API:", res.data); // ເບິ່ງວ່າ technician_id ຫຼື technician.id

    // ປ່ຽນການດຶງຄ່າໃຫ້ຊົວ: ຖ້າ technician.id ບໍ່ມີ ໃຫ້ລອງດຶງຈາກ technicianId ໂດຍກົງ
    const techId = res.data?.technician?.id || res.data?.technicianId;

    setFieldValue("technicianId", techId ?? null);
    setFieldValue("documentType", res.data.documentType);
    setFieldValue("fileUrl", res.data.fileUrl);

    if (res.data.fileUrl) {
      previewUrl.value = getImageUrl(res.data.fileUrl);
    }
  } catch (e) {
    console.error("Error loading item:", e);
  }
};

onMounted(() => {
  loadTechnicians();
});
</script>