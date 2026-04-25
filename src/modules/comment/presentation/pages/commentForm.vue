<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມຄຳເຫັນ</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">JobId</label>
        <select v-model="jobIdValue" class="w-full rounded-lg border px-3 py-2 text-sm">
          <option :value="null">-- ເລືອກ Job --</option>
          <option v-for="j in jobs" :key="j.id" :value="j.id">
            {{ j.title || ('#' + j.id) }}
          </option>
        </select>
        <p v-if="errors.jobId" class="text-red-500 text-xs mt-1">{{ errors.jobId }}</p>
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຄອມເມັ້ນ</label>
        <input v-model="contentValue" type="text" placeholder="ຄອມເມັ້ນ"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
        <p v-if="errors.content" class="text-red-500 text-xs mt-1">{{ errors.content }}</p>
      </div>

      <!-- parentId -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">parentId</label>
        <input v-model.number="parentIdValue" type="number" placeholder="parentId"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
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
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { CommentRepositoryImpl } from "../../infrastructure/repositories/comment.repository.impl";
import { CreateCommentUseCase } from "../../application/use-cases/create-comments.usecase";
import { UpdateCommentUseCase } from "../../application/use-cases/update-comments.usecase";
import { GetOneCommentUseCase } from "../../application/use-cases/get-one-comments.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToastStore } from "../../../../stores/toast";
import { JobRepositoryImpl } from "../../../job/infrastructure/repositories/job.repository.impl";
import { GetAllJobsUseCase } from "../../../job/application/use-cases/get-all-jobs.usecase";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const toastStore = useToastStore();
const jobs = ref<any[]>([]);

const jobRepo = new JobRepositoryImpl();
const getJobsUseCase = new GetAllJobsUseCase(jobRepo);

const repo = new CommentRepositoryImpl();
const createUseCase = new CreateCommentUseCase(repo);
const updateUseCase = new UpdateCommentUseCase(repo);
const getOneUseCase = new GetOneCommentUseCase(repo);

const loadJobs = async () => {
  try {
    const res: any = await getJobsUseCase.execute();
    jobs.value = res.data || res;
  } catch (e) {
    console.error("Load jobs error:", e);
  }
}; onMounted(loadJobs);

const schema = yup.object({
  jobId: yup.mixed()
    .test("required", "ກະລຸນາເລືອກ Job", (val) => !!val),
  content: yup.string().required("ກະລຸນາປ້ອນຄອມເມັ້ນ"),
  parentId: yup.number().nullable().notRequired(),
});

const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    jobId: "",
    userId: "",
    content: "",
    parentId: "",
  },
});

const [jobIdValue] = defineField("jobId");
const [contentValue] = defineField("content");
const [parentIdValue] = defineField("parentId");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    const payload: any = {
      jobId: values.jobId,
      content: values.content,
    };

    // ✅ important fix
    if (values.parentId !== null && values.parentId !== undefined) {
      payload.parentId = Number(values.parentId);
    }

    const res: any = await createUseCase.execute(payload);

    toastStore.toast("ສ້າງຄອມເມັ້ນສຳເລັດ");

    if (res?.id) {
      emits("closeForm", false);
    }
  } catch (e) {
    console.error("Create error:", e);
    toastStore.toast("ສ້າງຄອມເມັ້ນບໍ່ສຳເລັດ");
  }
});

// Update
const onUpdate = handleSubmit(async (values: any) => {
  try {
    const id = route.query.id;

    const payload: any = {
      content: values.content,
    };

    if (values.parentId !== null && values.parentId !== undefined) {
      payload.parentId = Number(values.parentId);
    }

    const res: any = await updateUseCase.execute(id, payload);

    toastStore.toast("ແກ້ໄຂສຳເລັດ");

    if (res?.id) {
      emits("closeForm", false);
    }
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
    setFieldValue("jobId", res.data.jobId);
    setFieldValue("content", res.data.content);
    setFieldValue("parentId", res.data.parentId ?? null);
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
