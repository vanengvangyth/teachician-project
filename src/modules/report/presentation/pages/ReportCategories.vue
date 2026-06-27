<template>
  <div class="report-page">
    <!-- HEADER -->
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--violet">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານຂ້ໍມູນປະເພດວຽກ</h1>
          <p class="report-subtitle">ຂໍ້ມູນໝວດໝູ່ (Category) ທັງໝົດໃນລະບົບ</p>
        </div>
      </div>
      <button @click="exportExcel" class="btn-export" :disabled="loading || filteredItems.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
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
      <div class="stat-card stat-card--amber">
        <p class="stat-label">ອັນດັບ 1 ຍອດນິຍົມ</p>
        <p class="stat-value text-sm-value">{{ top1Category }}</p>
      </div>
      <div class="stat-card stat-card--purple">
        <p class="stat-label">ອັນດັບ 2 ຍອດນິຍົມ</p>
        <p class="stat-value text-sm-value">{{ top2Category }}</p>
      </div>
      <div class="stat-card stat-card--teal">
        <p class="stat-label">ອັນດັບ 3 ຍອດນິຍົມ</p>
        <p class="stat-value text-sm-value">{{ top3Category }}</p>
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
          <button @click="showFilterModal = false" class="rounded-lg bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 text-sm font-semibold transition">
            ຕົກລົງ
          </button>
        </div>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <div v-if="loading" class="table-loading"><div class="spinner"></div><span>ກຳລັງໂຫລດຂໍ້ມູນ...</span></div>
      <div v-else-if="filteredItems.length === 0" class="table-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-slate-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p>ບໍ່ພົບຂໍ້ມູນ</p>
      </div>
      <table v-else class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ຊື່ປະເພດ</th>
            <th>ລາຍລະອຽດ</th>
            <th>ຈຳນວນຄັ້ງ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cat, i) in paginatedItems" :key="cat.id">
            <td class="td-num">{{ (currentPage - 1) * perPage + i + 1 }}</td>
            <td class="td-bold">{{ cat.nameLao || cat.nameEng || '-' }}</td>
            <td class="td-desc">{{ cat.descriptionLao || cat.descriptionEng || '-' }}</td>
            <td class="td-num font-semibold">{{ cat.jobCount ?? 0 }}</td>
            <td>{{ formatDate(cat.createdAt) }}</td>
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

const rawCategories = ref<any[]>([]);
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

const matchesSearch = (cat: any) => {
  if (!search.value) return true;
  const term = search.value.toLowerCase();
  return (
    (cat.nameLao && cat.nameLao.toLowerCase().includes(term)) ||
    (cat.nameEng && cat.nameEng.toLowerCase().includes(term)) ||
    (cat.descriptionLao && cat.descriptionLao.toLowerCase().includes(term)) ||
    (cat.descriptionEng && cat.descriptionEng.toLowerCase().includes(term))
  );
};

const filteredItems = computed(() => {
  const items = rawCategories.value.filter(cat => isWithinDateRange(cat.createdAt) && matchesSearch(cat));
  return [...items].sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0));
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredItems.value.slice(start, start + perPage);
});

const numberOfPage = computed(() => Math.ceil(filteredItems.value.length / perPage));

const total = computed(() => filteredItems.value.length);

const top1Category = computed(() => {
  const item = filteredItems.value[0];
  if (!item || item.jobCount === 0) return '-';
  return `${item.nameLao || item.nameEng} (${item.jobCount})`;
});

const top2Category = computed(() => {
  const item = filteredItems.value[1];
  if (!item || item.jobCount === 0) return '-';
  return `${item.nameLao || item.nameEng} (${item.jobCount})`;
});

const top3Category = computed(() => {
  const item = filteredItems.value[2];
  if (!item || item.jobCount === 0) return '-';
  return `${item.nameLao || item.nameEng} (${item.jobCount})`;
});



watch([search, startDate, endDate], () => {
  router.push({ query: { ...route.query, page: '1' } });
});

const clearFilters = () => {
  search.value = '';
  startDate.value = '';
  endDate.value = '';
};

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [catRes, jobRes] = await Promise.all([
      axios.get('/categories', { params: { page: 1, perPage: 1000 } }),
      axios.get('/jobs', { params: { page: 1, perPage: 1000 } })
    ]);
    
    const catData = catRes.data.data ?? catRes.data ?? [];
    const jobData = jobRes.data.data ?? jobRes.data ?? [];

    const jobCountMap = new Map<number, number>();
    for (const job of jobData) {
      const catId = Number(job.categoryId || job.category?.id);
      if (catId) {
        jobCountMap.set(catId, (jobCountMap.get(catId) || 0) + 1);
      }
    }

    rawCategories.value = catData.map((cat: any) => ({
      ...cat,
      jobCount: jobCountMap.get(Number(cat.id)) || 0
    }));
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = filteredItems.value.map((c, i) => ({
    '#': i + 1,
    'ຊື່ປະເພດ': c.nameLao || c.nameEng || '-',
    'ລາຍລະອຽດ': c.descriptionLao || c.descriptionEng || '-',
    'ຈຳນວນຄັ້ງ': c.jobCount ?? 0,
    'ວັນທີສ້າງ': formatDate(c.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ປະເພດວຽກ');
  XLSX.writeFile(wb, 'report_categories.xlsx');
};

onMounted(loadData);
</script>

<style scoped>
@import '../styles/report.css';

.stats-grid {
  grid-template-columns: repeat(4, 1fr);
}

.text-sm-value {
  font-size: 0.95rem !important;
  line-height: 1.2 !important;
  word-break: break-word;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
