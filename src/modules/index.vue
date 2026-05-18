<template>
<div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-400 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <span class="text-sm text-slate-1000">{{ today }}</span>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-3" :style="{ background: stat.bg }">
          <component :is="stat.icon" class="w-4 h-4" :style="{ color: stat.color }" />
        </div>
        <div class="text-xs text-slate-500 mb-1">{{ stat.label }}</div>
        <div class="text-2xl font-semibold text-slate-800">
          {{ isLoading ? '...' : stat.value }}
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Recent Jobs -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">
          ວຽກລ່າສຸດ
        </div>
        <div v-if="isLoading" class="text-sm text-slate-400">ກຳລັງໂຫລດ...</div>
        <div v-else-if="recentJobs.length === 0" class="text-sm text-slate-400">ບໍ່ມີຂໍ້ມູນ</div>
        <div v-for="job in recentJobs" :key="job.id"
          class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
          <div>
            <div class="text-sm text-slate-800">{{ job.title || '-' }}</div>
            <div class="text-xs text-slate-400">
              {{ job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-' }}
            </div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(job.status)">
            {{ job.status || '-' }}
          </span>
        </div>
      </div>

      <!-- Recent Technicians -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">
          ຊ່າງລ່າສຸດ
        </div>
        <div v-if="isLoading" class="text-sm text-slate-400">ກຳລັງໂຫລດ...</div>
        <div v-else-if="recentTechnicians.length === 0" class="text-sm text-slate-400">ບໍ່ມີຂໍ້ມູນ</div>
        <div v-for="tech in recentTechnicians" :key="tech.id"
          class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
          <div>
            <div class="text-sm text-slate-800">{{ tech.user?.fullName || '-' }}</div>
            <div class="text-xs text-slate-400">{{ tech.descriptionLao || '-' }}</div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full"
            :class="tech.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'">
            {{ tech.isApproved ? 'ອະນຸມັດ' : 'ລໍຖ້າ' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Users, Briefcase, HardHat, FileText } from 'lucide-vue-next';
import { userApi } from '../modules/user/infrastructure/api/user.api';
import { jobApi } from '../modules/job/infrastructure/api/job.api';
import { techicianApi } from '../modules/techician/infrastructure/api/techician.api';
import { documentApi } from '../modules/document/infrastructure/api/document.api';

const isLoading = ref(true);
const recentJobs = ref<any[]>([]);
const recentTechnicians = ref<any[]>([]);

const today = new Date().toLocaleDateString('lo-LA', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const stats = ref([
  { label: 'ຜູ້ໃຊ້ທັງໝົດ', value: 0, icon: Users, bg: '#E6F1FB', color: '#185FA5' },
  { label: 'ວຽກທັງໝົດ', value: 0, icon: Briefcase, bg: '#EAF3DE', color: '#3B6D11' },
  { label: 'ຊ່າງທັງໝົດ', value: 0, icon: HardHat, bg: '#FAEEDA', color: '#854F0B' },
  { label: 'ເອກະສານ', value: 0, icon: FileText, bg: '#E1F5EE', color: '#0F6E56' },
]);

function statusClass(status: string) {
  const map: any = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

async function loadStats() {
  try {
    const [users, jobs, techs, docs] = await Promise.all([
      userApi.getAll(1, 1),
      jobApi.getAll(1, 1),
      techicianApi.getAll(1, 1),
      documentApi.getAll(1, 1),
    ]);

    stats.value = [
      { label: 'ຜູ້ໃຊ້ທັງໝົດ', value: users.total ?? 0, icon: Users, bg: '#E6F1FB', color: '#185FA5' },
      { label: 'ວຽກທັງໝົດ', value: jobs.total ?? 0, icon: Briefcase, bg: '#EAF3DE', color: '#3B6D11' },
      { label: 'ຊ່າງທັງໝົດ', value: techs.total ?? 0, icon: HardHat, bg: '#FAEEDA', color: '#854F0B' },
      { label: 'ເອກະສານ', value: docs.total ?? 0, icon: FileText, bg: '#E1F5EE', color: '#0F6E56' },
    ];

    // ດຶງ 4 ລາຍການລ່າສຸດ
    const jobRes = await jobApi.getAll(1, 4);
    recentJobs.value = jobRes.data ?? [];

    const techRes = await techicianApi.getAll(1, 4);
    recentTechnicians.value = techRes.data ?? [];

  } catch (e) {
    console.error('Dashboard load error:', e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadStats);
</script>