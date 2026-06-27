<template>
  <div class="report-page">
    <!-- HEADER -->
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--amber">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານຂໍ້ມູນວຽກ</h1>
          <p class="report-subtitle">ຂໍ້ມູນວຽກທັງໝົດໃນລະບົບ</p>
        </div>
      </div>
      <button @click="exportExcel" class="btn-export" :disabled="loading || filteredItems.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Excel
      </button>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card stat-card--blue">
        <p class="stat-label">ທັງໝົດ</p>
        <p class="stat-value">{{ total }}</p>
      </div>
      <div class="stat-card stat-card--sky">
        <p class="stat-label">ຍັງວ່າງ</p>
        <p class="stat-value">{{ countByStatus('open') }}</p>
      </div>
      <div class="stat-card stat-card--purple">
        <p class="stat-label">ຮັບແລ້ວ</p>
        <p class="stat-value">{{ countByStatus('accepted') }}</p>
      </div>
      <div class="stat-card stat-card--amber">
        <p class="stat-label">ກຳລັງດຳເນີນ</p>
        <p class="stat-value">{{ countByStatus('in_progress') }}</p>
      </div>
      <div class="stat-card stat-card--emerald">
        <p class="stat-label">ສຳເລັດ</p>
        <p class="stat-value">{{ countByStatus('completed') }}</p>
      </div>
      <div class="stat-card stat-card--red">
        <p class="stat-label">ຍົກເລີກ</p>
        <p class="stat-value">{{ countByStatus('cancelled') }}</p>
      </div>
    </div>

    <!-- CONTROL ROW -->
    <div class="report-controls-row">
      <input v-model="search" placeholder="Search..." class="w-full max-w-lg rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm
        focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none" />
      <button @click="showFilterModal = true"
        class="rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2"
        :class="hasActiveDateFilters ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'">
        <span>📅 {{ hasActiveDateFilters ? 'ຊ່ວງເວລາຖືກກຳນົດ' : 'ເລືອກຊ່ວງເວລາ' }}</span>
      </button>
    </div>

    <!-- FILTER MODAL -->
    <div v-if="showFilterModal" class="filter-modal-overlay" @click.self="showFilterModal = false">
      <div class="filter-modal">
        <h2 class="filter-modal__title">ຄົ້ນຫາຕາມຊ່ວງເວລາ</h2>
        <div class="filter-modal__body">
          <div class="filter-modal__field">
            <span class="filter-label">ເລີ່ມຕົ້ນ:</span>
            <input type="date" v-model="startDate" class="filter-input" />
          </div>
          <div class="filter-modal__field">
            <span class="filter-label">ຫາ:</span>
            <input type="date" v-model="endDate" class="filter-input" />
          </div>
        </div>
        <div class="filter-modal__footer">
          <button @click="clearFilters" class="btn-clear">ລ້າງ Filter</button>
          <button @click="showFilterModal = false"
            class="rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 text-sm font-semibold transition">
            ຕົກລົງ
          </button>
        </div>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <div class="spinner"></div><span>ກຳລັງໂຫລດຂໍ້ມູນ...</span>
      </div>
      <div v-else-if="filteredItems.length === 0" class="table-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-12 h-12 text-slate-300">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p>ບໍ່ພົບຂໍ້ມູນ</p>
      </div>
      <table v-else class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ໂພສ໌ໂດຍ</th>
            <th>ຊື່ວຽກ</th>
            <th>ລາຍລະອຽດ</th>
            <th>ປະເພດ</th>
            <th>ສະຖານທີ່</th>
            <th>ສະຖານະ</th>
            <th>ເຫດຜົນຍົກເລີກ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, i) in paginatedItems" :key="job.id">
            <td class="td-num">{{ (currentPage - 1) * perPage + i + 1 }}</td>
            <td class="td-bold">{{ job.user?.fullName || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td class="td-bold">{{ job.title || job.name || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td class="td-desc">{{ job.description || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>{{ job.category?.nameLao || job.categoryId || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>{{ job.location || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>
              <span class="badge" :class="statusBadge(job.status)">{{ translateStatus(job.status) }}</span>
            </td>
            <td>{{ job.cancellationReason || '---' }}</td>
            <td>{{ formatDate(job.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="pagination-container" v-if="numberOfPage > 1">
      <Paginator :numberOfPage="numberOfPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import axios from '../../../../service/axios';
import Paginator from '../../../../shared/components/paginator.vue';

const route = useRoute();
const router = useRouter();

const rawJobs = ref<any[]>([]);
const loading = ref(false);

const search = ref('');
const startDate = ref('');
const endDate = ref('');
const perPage = 10;
const showFilterModal = ref(false);

const hasActiveDateFilters = computed(() => !!startDate.value || !!endDate.value);

const currentPage = computed(() => {
  const page = route.query.page;
  return page ? parseInt(page as string) : 1;
});

const isWithinDateRange = (dateStr: string) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);

  if (startDate.value) {
    const start = new Date(startDate.value);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }

  if (endDate.value) {
    const end = new Date(endDate.value);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }

  return true;
};

const matchesSearch = (job: any) => {
  if (!search.value) return true;
  const term = search.value.toLowerCase();
  return (
    (job.user?.fullName && job.user.fullName.toLowerCase().includes(term)) ||
    (job.title && job.title.toLowerCase().includes(term)) ||
    (job.name && job.name.toLowerCase().includes(term)) ||
    (job.description && job.description.toLowerCase().includes(term)) ||
    (job.category?.nameLao && job.category.nameLao.toLowerCase().includes(term)) ||
    (job.location && job.location.toLowerCase().includes(term)) ||
    (job.cancellationReason && job.cancellationReason.toLowerCase().includes(term))
  );
};

const filteredItems = computed(() => {
  return rawJobs.value.filter(job => isWithinDateRange(job.createdAt) && matchesSearch(job));
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredItems.value.slice(start, start + perPage);
});

const numberOfPage = computed(() => Math.ceil(filteredItems.value.length / perPage));

const total = computed(() => filteredItems.value.length);

const countByStatus = (status: string) =>
  filteredItems.value.filter(j => j.status?.toLowerCase() === status).length;

const statusBadge = (status: string) => {
  const map: any = {
    open: 'badge--blue',
    accepted: 'badge--purple',
    in_progress: 'badge--amber',
    completed: 'badge--emerald',
    cancelled: 'badge--red',
    pending: 'badge--blue',
  };
  return map[status?.toLowerCase()] ?? 'badge--gray';
};

const translateStatus = (status: string) => {
  const map: any = {
    open: 'ຍັງວ່າງ',
    accepted: 'ຮັບແລ້ວ',
    in_progress: 'ກຳລັງດຳເນີນ',
    completed: 'ສຳເລັດ',
    cancelled: 'ຍົກເລີກ',
    pending: 'ລໍຖ້າດຳເນີນການ',
  };
  return map[status?.toLowerCase()] ?? status ?? 'ບໍ່ມີຂໍ້ມູນ';
};

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

watch([search, startDate, endDate], () => {
  router.push({ query: { ...route.query, page: '1' } });
});

const clearFilters = () => {
  search.value = '';
  startDate.value = '';
  endDate.value = '';
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/jobs', { params: { page: 1, perPage: 1000 } });
    const data = res.data;
    rawJobs.value = data.data ?? data ?? [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = filteredItems.value.map((j, i) => ({
    '#': i + 1,
    'ຊື່ວຽກ': j.title || j.name || 'ບໍ່ມີຂໍ້ມູນ',
    'ລາຍລະອຽດ': j.description || 'ບໍ່ມີຂໍ້ມູນ',
    'ປະເພດ': j.category?.nameLao || j.categoryId || 'ບໍ່ມີຂໍ້ມູນ',
    'ສະຖານະ': translateStatus(j.status),
    'ເຫດຜົນຍົກເລີກ': j.cancellationReason || 'ບໍ່ມີຂໍ້ມູນ',
    'ວັນທີສ້າງ': formatDate(j.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານວຽກ');
  XLSX.writeFile(wb, 'report_jobs.xlsx');
};

onMounted(loadData);
</script>

<style scoped>
@import '../styles/report.css';

.stats-grid {
  grid-template-columns: repeat(6, 1fr);
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
