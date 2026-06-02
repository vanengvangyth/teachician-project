<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-100 rounded-lg max-h-[60vh] overflow-y-auto">
    <Loading :isloading="isLoading" />
    
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
        
        <!-- Skeleton Loader for values -->
        <div v-if="isLoading" class="h-8 w-16 bg-slate-100 rounded-lg animate-pulse mt-1"></div>
        <div v-else class="text-2xl font-semibold text-slate-800">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Line Chart Trend Card -->
    <DashboardLineChart :users-count="usersCount" :jobs-count="jobsCount" :techs-count="techsCount" class="mb-6" />

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Recent Jobs -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">
          ວຽກລ່າສຸດ
        </div>
        
        <!-- Premium List Skeleton Loading -->
        <div v-if="isLoading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="flex items-center justify-between py-2.5 px-2 border-b border-slate-50 last:border-0">
            <div class="space-y-2 flex-1 animate-pulse">
              <div class="h-4 bg-slate-200 rounded w-2/3"></div>
              <div class="h-3 bg-slate-100 rounded w-1/3"></div>
            </div>
            <div class="h-6 bg-slate-100 rounded-full w-14 animate-pulse"></div>
          </div>
        </div>
        
        <div v-else-if="recentJobs.length === 0" class="text-sm text-slate-400">ບໍ່ມີຂໍ້ມູນ</div>
        <div v-else v-for="job in recentJobs" :key="job.jobId || job.id"
          @click="viewJobDetail(job.jobId || job.id)"
          class="flex items-center justify-between py-2.5 px-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-lg cursor-pointer transition">
          <div>
            <div class="text-sm font-semibold text-slate-700 hover:text-sky-600 transition">{{ job.title || '-' }}</div>
            <div class="text-xs text-slate-400 mt-0.5">
              {{ job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-' }}
            </div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :class="statusClass(job.status)">
            {{ job.status || '-' }}
          </span>
        </div>
      </div>

      <!-- Recent Technicians -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">
          ຊ່າງລ່າສຸດ
        </div>
        
        <!-- Premium List Skeleton Loading -->
        <div v-if="isLoading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="flex items-center justify-between py-2.5 px-2 border-b border-slate-50 last:border-0">
            <div class="space-y-2 flex-1 animate-pulse">
              <div class="h-4 bg-slate-200 rounded w-1/2"></div>
              <div class="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div class="h-6 bg-slate-100 rounded-full w-12 animate-pulse"></div>
          </div>
        </div>
        
        <div v-else-if="recentTechnicians.length === 0" class="text-sm text-slate-400">ບໍ່ມີຂໍ້ມູນ</div>
        <div v-else v-for="tech in recentTechnicians" :key="tech.id"
          @click="viewTechDetail(tech.id)"
          class="flex items-center justify-between py-2.5 px-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-lg cursor-pointer transition">
          <div>
            <div class="text-sm font-semibold text-slate-700 hover:text-sky-600 transition">{{ tech.user?.fullName || '-' }}</div>
            <div class="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{{ tech.descriptionLao || '-' }}</div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium"
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
import { useRouter } from 'vue-router';
import Loading from '../shared/components/Loading.vue';
import { Users, Briefcase, HardHat, FileText } from 'lucide-vue-next';
import DashboardLineChart from '../shared/components/DashboardLineChart.vue';
import { userApi } from '../modules/user/infrastructure/api/user.api';
import { jobApi } from '../modules/job/infrastructure/api/job.api';
import { techicianApi } from '../modules/techician/infrastructure/api/techician.api';
import { documentApi } from '../modules/document/infrastructure/api/document.api';

const router = useRouter();
const isLoading = ref(true);
const recentJobs = ref<any[]>([]);
const recentTechnicians = ref<any[]>([]);

const usersCount = ref(0);
const jobsCount = ref(0);
const techsCount = ref(0);

const viewJobDetail = (id: number) => {
  router.push(`/job/${id}/detail`);
};

const viewTechDetail = (id: number) => {
  router.push(`/techician/${id}/detail`);
};

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

    usersCount.value = users.total ?? 0;
    jobsCount.value = jobs.total ?? 0;
    techsCount.value = techs.total ?? 0;

    stats.value = [
      { label: 'ຜູ້ໃຊ້ທັງໝົດ', value: users.total ?? 0, icon: Users, bg: '#E6F1FB', color: '#185FA5' },
      { label: 'ວຽກທັງໝົດ', value: jobs.total ?? 0, icon: Briefcase, bg: '#EAF3DE', color: '#3B6D11' },
      { label: 'ຊ່າງທັງໝົດ', value: techs.total ?? 0, icon: HardHat, bg: '#FAEEDA', color: '#854F0B' },
      { label: 'ເອກະສານ', value: docs.total ?? 0, icon: FileText, bg: '#E1F5EE', color: '#0F6E56' },
    ];

    const jobRes = await jobApi.getAll(1, 50);
    const rawJobs = jobRes.data ?? [];
    recentJobs.value = rawJobs
      .map((job: any) => ({
        ...job,
        isApproved: job.isApproved ?? job.is_approved ?? false,
        isRead: job.isRead ?? job.is_read ?? false,
      }))
      .filter((job: any) => job.status === 'open')
      .slice(0, 9);

    const techRes = await techicianApi.getAll(1, 50);
    const rawTechs = techRes.data ?? [];
    recentTechnicians.value = rawTechs
      .map((tech: any) => ({
        ...tech,
        isApproved: tech.isApproved ?? tech.is_approved ?? false,
        isRead: tech.isRead ?? tech.is_read ?? false,
        user: tech.user
          ? {
            ...tech.user,
            fullName: tech.user.fullName ?? tech.user.fullNam ?? "-",
          }
          : undefined,
      }))
      .filter((tech: any) => !tech.isApproved) 
      .slice(0, 9);

  } catch (e) {
    console.error('Dashboard load error:', e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadStats);
</script>