<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade">
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">User Form</h3>

      <!-- Profile Image Upload -->
      <div class="mb-6 flex flex-col items-center">
        <div class="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-sky-400 transition shadow-inner">
          <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
          <span v-else class="text-slate-400 text-3xl font-sans">👤</span>
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition">
            ອັບໂຫຼດຮູບ
          </div>
          <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="onFileChange" />
        </div>
        <p v-if="profileImageUrlError" class="text-xs text-red-500 mt-1">{{ profileImageUrlError }}</p>
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input v-model="email" v-bind="emailProps" type="text" placeholder="Email"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          :class="emailError ? 'border-red-400' : 'border-slate-300 focus:border-sky-500'" />
        <p v-if="emailError" class="text-xs text-red-500 mt-1">{{ emailError }}</p>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Password</label>
        <input v-model="password" v-bind="passwordProps" type="password" placeholder="Password"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          :class="passwordError ? 'border-red-400' : 'border-slate-300 focus:border-sky-500'" />
        <p v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</p>
      </div>

      <!-- Role -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Role</label>
        <select v-model="role" v-bind="roleProps"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          :class="roleError ? 'border-red-400' : 'border-slate-300 focus:border-sky-500'">
          <option disabled value="">Select role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
          <option value="TECHNICIANS">TECHNICIANS</option>
        </select>
        <p v-if="roleError" class="text-xs text-red-500 mt-1">{{ roleError }}</p>
      </div>

      <!-- FullName -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">FullName</label>
        <input v-model="fullName" v-bind="fullNameProps" type="text" placeholder="fullName"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          :class="fullNameError ? 'border-red-400' : 'border-slate-300 focus:border-sky-500'" />
        <p v-if="fullNameError" class="text-xs text-red-500 mt-1">{{ fullNameError }}</p>
      </div>

      <!-- Phone -->
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">Phone</label>
        <input v-model="phone" v-bind="phoneProps" type="text" placeholder="Phone"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          :class="phoneError ? 'border-red-400' : 'border-slate-300 focus:border-sky-500'" />
        <p v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</p>
      </div>

      <!-- Server error (phone/email ຊ້ຳ) -->
      <div v-if="serverError" class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        {{ serverError }}
      </div>

      <div class="flex justify-around gap-3">
        <button type="button"
          class="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
          v-if="props.editId" @click="onUpdate">
          Update
        </button>
        <button type="button"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
          @click="onSubmit" v-else>
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
import { useForm } from "vee-validate";
import * as yup from "yup";

import { CreateUserUseCase } from "../../application/use-cases/create-users.usecase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { getOneUserUseCase } from "../../application/use-cases/get-user.usecase";
import { UpdateUserUseCase } from "../../application/use-cases/update-users.usecase";
import { useField } from "vee-validate";
import { useToastStore } from "../../../../stores/toast";
import { getImageUrl } from "../../../../shared/utils/image.util";
import axios from "../../../../service/axios";

const repo = new UserRepositoryImpl();
const usecase = new CreateUserUseCase(repo);
const editUsecase = new getOneUserUseCase(repo);
const updateUsecase = new UpdateUserUseCase(repo);
const toastStore = useToastStore();
const serverError = ref("");
const previewUrl = ref("");
const props = defineProps<{ editId?: string | number }>();

const userSchema = yup.object({
  fullName: yup.string().required("ກະລຸນາໃສ່ຊື່"),
  email: yup.string().email("ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ").required("ກະລຸນາໃສ່ອີເມວ"),
  password: yup.string().min(6, "ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 6 ຕົວ").required("ກະລຸນາໃສ່ລະຫັດຜ່ານ"),
  role: yup.string().required("ກະລຸນາເລືອກສິດ"),
  phone: yup.string().required("ກະລຸນາໃສ່ເບີໂທ"),
  profileImageUrl: yup.string().nullable().optional()
});

const { handleSubmit, defineField, setFieldValue, handleReset } = useForm({
  validationSchema: userSchema,
  initialValues: { fullName: "", email: "", password: "", role: "", phone: "", profileImageUrl: "" },
});

const [fullName, fullNameProps] = defineField("fullName");
const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");
const [role, roleProps] = defineField("role");
const [phone, phoneProps] = defineField("phone");

const { errorMessage: fullNameError } = useField("fullName");
const { errorMessage: emailError } = useField("email");
const { errorMessage: passwordError } = useField("password");
const { errorMessage: roleError } = useField("role");
const { errorMessage: phoneError } = useField("phone");
const { errorMessage: profileImageUrlError } = useField("profileImageUrl");

// helper ດຶງ message ຈາກ axios error
function parseServerError(e: any): string {
  const msg = e?.response?.data?.message;
  if (!msg) return "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່";
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.join(", ");
  return "ເກີດຂໍ້ຜິດພາດ";
}

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  previewUrl.value = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    const url = res.data?.url || res.data;
    setFieldValue("profileImageUrl", url);
  } catch (err) {
    console.error("Upload error:", err);
    toastStore.toast("ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ ❌");
  }
};

const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";
  try {
    await usecase.execute(values);

    toastStore.toast("ສ້າງສຳເລັດ ✅");
    emits("closeForm", false);
  } catch (e: any) {
    serverError.value = parseServerError(e);
    toastStore.toast("ສ້າງບໍ່ສຳເລັດ ❌");
  }
});

const onUpdate = handleSubmit(async (values) => {
  console.log("onUpdate called, editId =", props.editId);
  try {
    await updateUsecase.execute(props.editId, values);
    toastStore.toast("ອັບເດດສຳເລັດ ✅");
    emits("closeForm", false);
  } catch (error) {
    toastStore.toast("ອັບເດດບໍ່ສຳເລັດ ❌");
  }
});

const editUser = async (id: string | number) => {
  const res = await editUsecase.execute(id);
  setFieldValue("email", res.data.email);
  setFieldValue("password", res.data.password);
  setFieldValue("fullName", res.data.fullName);
  setFieldValue("phone", res.data.phone);
  
  const rawUrl = res.data.profileImageUrl ?? res.data.profile_image_url;
  const cleanUrl = (!rawUrl || rawUrl === "null" || rawUrl === "undefined" || String(rawUrl).trim() === "") ? "" : rawUrl;
  setFieldValue("profileImageUrl", cleanUrl);
  if (cleanUrl) {
    previewUrl.value = getImageUrl(cleanUrl);
  } else {
    previewUrl.value = "";
  }
};

watch(
  () => props.editId,
  (newValue) => {
    serverError.value = "";
    previewUrl.value = "";
    if (newValue) editUser(newValue);
    else handleReset();
  },
  { immediate: true }
);

const emits = defineEmits({ closeForm: (payload) => typeof payload === "boolean" });
</script>