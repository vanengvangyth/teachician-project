<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade"
  >
    <form class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 overflow-auto">
      <h3 class="text-center text-xl font-bold mb-6">ແບບຟອມແຈ້ງການ</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຜູ້ໃຊ້</label>
        <select v-model="userIdValue"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
          <option :value="null">-- ເລືອກຜູ້ໃຊ້ --</option>
          <option v-for="u in users" :key="u.id" :value="u.id">
            {{ u.fullName ?? u.email }}
          </option>
        </select>
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຫົວຂໍ້ (Lao)</label>
        <input
          v-model="titleLaoValue"
          type="text"
          placeholder="Enter titleLao"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຫົວຂໍ້ (Eng)</label>
        <input
          v-model="titleEngValue"
          type="text"
          placeholder="Enter titleEng"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ຂໍ້ຄວາມ</label>
        <input
          v-model="messageValue"
          type="text"
          placeholder="Enter message"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <!-- Type -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ປະເພດ</label>
        <select v-model="typeValue"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
          <option value="job_posted">job_posted</option>
          <option value="bid_received">bid_received</option>
          <option value="appointment_confirmed">appointment_confirmed</option>
          <option value="review_posted">review_posted</option>
        </select>
      </div>

      <!-- ReferenceId-->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">ລະຫັດອ້າງອີງ</label>
        <input
          v-model="referenceIdValue"
          type="text"
          placeholder="Enter referenceId"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-around gap-3">

        <button type="button" @click="emits('closeForm', false)"
          class="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
          ຍົກເລີກ
        </button>

        <button type="button" @click="onSubmit"
          class="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition">
          ບັນທຶກ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { NotificationRepositoryImpl } from "../../infrastructure/repositories/notification.repository.impl";
import { CreateNotificationUseCase } from "../../application/use-cases/create-notifications.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToastStore } from "../../../../stores/toast";
import { UserRepositoryImpl } from "../../../user/infrastructure/repositories/user.repository.impl";

const emits = defineEmits(["closeForm"]);
const toastStore = useToastStore();

const users = ref<any[]>([]);

const repo = new NotificationRepositoryImpl();
const createUseCase = new CreateNotificationUseCase(repo);

const userRepo = new UserRepositoryImpl();

const loadUsers = async () => {
  try {
    const res = await userRepo.getAll(1, 100, '');
    users.value = res.data ?? res;
  } catch (e) {
    console.error("Error loading users:", e);
  }
};

const userIdSchema = yup.object({
  userId: yup.string().required("userId is required"),
});

const { handleSubmit, defineField} = useForm({
  validationSchema: userIdSchema,
  initialValues: {
    userId: "",
    titleLao: "",
    titleEng: "",
    message: "",
    type: "",
    referenceId: "",
  },
});

const [userIdValue] = defineField("userId");
const [titleLaoValue] = defineField("titleLao");
const [titleEngValue] = defineField("titleEng");
const [messageValue] = defineField("message");
const [typeValue] = defineField("type");
const [referenceIdValue] = defineField("referenceId");

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    const res: any = await createUseCase.execute({
      userId: values.userId,
      titleLao: values.titleLao,
      titleEng: values.titleEng,
      message: values.message,
      type: values.type,
      referenceId: values.referenceId 
    });
    
    toastStore.toast("ບັນທຶກສໍາເລັດ");

    if (res?.id) {
      emits("closeForm", false);
    }
  } catch (e) {
    console.error("Create error:", e);
    toastStore.toast("ບັນທຶກບໍ່ສໍາເລັດ");
  }
});


onMounted(() => {
  loadUsers(); // ✅ ດຶງ users ຕອນ mount
});
</script>
