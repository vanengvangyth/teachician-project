<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade"
  >
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">User Form</h3>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Passwrod</label>
        <input
          v-model="password"
          type="text"
          placeholder="Password"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">Role</label>
        <select
          v-model="role"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        >
          <option disabled value="">Select role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
          <option value="TECHNICIANS">TECHNICIANS</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">FullName</label>
        <input
          v-model="fullName"
          v-bind="fullNameProps"
          type="text"
          placeholder="fullName"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">Phone</label>
        <input
          v-model="phone"
          type="text"
          placeholder="Phone"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <div class="flex justify-around gap-3">
        <button
          type="button"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          v-if="route.query.id"
          @click="onUpdate"
        >
          Update
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
          @click="onSubmit"
          v-else
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
import { useForm } from "vee-validate";
import { CreateUserUseCase } from "../../application/use-cases/create-users.usecase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import * as yup from "yup";
import { useRoute } from "vue-router";
import { getOneUserUseCase } from "../../application/use-cases/get-user.usecase";
import { watch } from "vue";
import { UpdateUserUseCase } from "../../application/use-cases/update-users.usecase";

const repo = new UserRepositoryImpl();
const usecase = new CreateUserUseCase(repo);
const editUsecase = new getOneUserUseCase(repo);
const updateUsecase = new UpdateUserUseCase(repo);

const route = useRoute();

const userSchema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
  phone: yup.string().required("Phone is required"),
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: userSchema,
  initialValues: {
    fullName: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  },
});

const [fullName, fullNameProps] = defineField("fullName");
const [email] = defineField("email");
const [password] = defineField("password");
const [role, roleProps] = defineField("role");
const [phone] = defineField("phone");

const onSubmit = handleSubmit(async (values: any) => {
  const data = {
    fullName: values.fullName ?? "",
    email: values.email ?? "",
    password: values.password ?? "",
    role: values.role ?? "",
    phone: values.phone ?? "",
  };

  try {
    const res: any = await usecase.execute(data);

    if (res && res.id) {
      console.log("create success");
      emits("closeForm", false);
    } else {
      console.log("Create error");
    }
  } catch (e) {
    console.log("Error: ", e);
  }
});

const onUpdate = handleSubmit(async (values: any) => {
  const id = route.query.id;
  const data = {
    fullName: values.fullName ?? "",
    email: values.email ?? "",
    password: values.password ?? "",
    role: values.role ?? "",
    phone: values.phone ?? "",
  };

  try {
    const res: any = await updateUsecase.execute(id, data);
    if (res && res.id) {
      console.log("update success");
      emits("closeForm", false);
    } else {
      console.log("Update error");
    }
  } catch (e) {
    console.log("Error: ", e);
  }
});

const editUser = async () => {
  const id = route.query.id;
  const res = await editUsecase.execute(id);

  setFieldValue("email", res.data.email);
  setFieldValue("password", res.data.password);
  setFieldValue("role", res.data.role);
  setFieldValue("fullName", res.data.fullName);
  setFieldValue("phone", res.data.phone);
};

watch(
  () => route.query.id,
  (newValue) => {
    if (newValue) {
      editUser();
    } else {
      handleReset();
    }
  },
  { immediate: true }
);

const emits = defineEmits({
  closeForm: (payload) => typeof payload === "boolean",
});
</script>
