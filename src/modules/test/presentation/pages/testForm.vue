<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade"
  >
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">Test Form</h3>

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
import { TestRepositoryImpl } from "../../infrastructure/repositories/test.repository.impl";
import { CreateTestUseCase } from "../../application/use-cases/create-tests.usecase";
import { UpdateTestUseCase } from "../../application/use-cases/update-tests.usecase";
import { GetOneTestUseCase } from "../../application/use-cases/get-one-tests.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";

const route = useRoute();
const emits = defineEmits(["closeForm"]);

const repo = new TestRepositoryImpl();
const createUseCase = new CreateTestUseCase(repo);
const updateUseCase = new UpdateTestUseCase(repo);
const getOneUseCase = new GetOneTestUseCase(repo);

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
