<template>
  <div class="report-page">
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--indigo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານສະຖານະການຢືນຢັນຕົວຕົນ</h1>
          <p class="report-subtitle">ສະຖານະ Verified ຂອງ User ແລະ Technician ທັງໝົດ</p>
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
      <div class="stat-card stat-card--blue"><p class="stat-label">ທັງໝົດ</p><p class="stat-value">{{ total }}</p></div>
      <div class="stat-card stat-card--emerald"><p class="stat-label">ຢືນຢັນແລ້ວ</p><p class="stat-value">{{ countVerified(true) }}</p></div>
      <div class="stat-card stat-card--red"><p class="stat-label">ຍັງບໍ່ຢືນຢັນ</p><p class="stat-value">{{ countVerified(false) }}</p></div>
      <div class="stat-card stat-card--amber">
        <p class="stat-label">% ຢືນຢັນ</p>
        <p class="stat-value">{{ verifiedPct }}%</p>
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
            <th>ຊື່</th>
            <th>ອີເມວ</th>
            <th>ເບີໂທ</th>
            <th>ສິດ</th>
            <th>ຢືນຢັນຕົວຕົນ</th>
            <th>ສະຖານະ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tech, i) in paginatedItems" :key="tech.id">
            <td class="td-num">{{ (currentPage - 1) * perPage + i + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="avatar" :class="{ 'avatar--green': tech.role?.toLowerCase() !== 'user' }">
                  {{ tech.fullName?.charAt(0)?.toUpperCase() || (tech.role?.toLowerCase() === 'user' ? 'U' : 'T') }}
                </div>
                <span class="td-bold">{{ tech.fullName || '-' }}</span>
              </div>
            </td>
            <td>{{ tech.email || '-' }}</td>
            <td>{{ tech.phone || '-' }}</td>
            <td>
              <span class="badge" :class="roleBadge(tech.role)">{{ tech.role }}</span>
            </td>
            <td>
              <span class="badge" :class="tech.isVerified ? 'badge--emerald' : 'badge--amber'">
                {{ tech.isVerified ? '✓ ຢືນຢັນແລ້ວ' : '⏳ ລໍຖ້າ' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="tech.isActive ? 'badge--blue' : 'badge--gray'">
                {{ tech.isActive ? 'ເປີດ' : 'ປິດ' }}
              </span>
            </td>
            <td>{{ formatDate(tech.createdAt) }}</td>
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

const rawTechnicians = ref<any[]>([]);
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

const matchesSearch = (tech: any) => {
  if (!search.value) return true;
  const term = search.value.toLowerCase();
  return (
    (tech.fullName && tech.fullName.toLowerCase().includes(term)) ||
    (tech.email && tech.email.toLowerCase().includes(term)) ||
    (tech.phone && tech.phone.toLowerCase().includes(term)) ||
    (tech.role && tech.role.toLowerCase().includes(term))
  );
};

const filteredItems = computed(() => {
  return rawTechnicians.value.filter(tech => isWithinDateRange(tech.createdAt) && matchesSearch(tech));
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredItems.value.slice(start, start + perPage);
});

const numberOfPage = computed(() => Math.ceil(filteredItems.value.length / perPage));

const total = computed(() => filteredItems.value.length);

const countVerified = (val: boolean) =>
  filteredItems.value.filter(t => t.isVerified === val).length;

const verifiedPct = computed(() => {
  if (!filteredItems.value.length) return 0;
  return ((countVerified(true) / filteredItems.value.length) * 100).toFixed(1);
});

const roleBadge = (role: string) => {
  const map: any = {
    admin: 'badge--purple',
    user: 'badge--blue',
    technician: 'badge--emerald',
    technicians: 'badge--emerald',
  };
  return map[role?.toLowerCase()] ?? 'badge--gray';
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
    const res = await axios.get('/users', { params: { page: 1, perPage: 1000 } });
    const data = res.data;
    const rawUsers = data.data ?? data ?? [];
    rawTechnicians.value = rawUsers.filter((u: any) => {
      const r = u.role?.toLowerCase();
      return r === 'user' || r === 'technician' || r === 'technicians';
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = filteredItems.value.map((t, i) => ({
    '#': i + 1,
    'ຊື່': t.fullName || '-',
    'ອີເມວ': t.email || '-',
    'ເບີໂທ': t.phone || '-',
    'ສິດ': t.role || '-',
    'ຢືນຢັນຕົວຕົນ': t.isVerified ? 'ຢືນຢັນແລ້ວ' : 'ຍັງບໍ່ຢືນຢັນ',
    'ສະຖານະ': t.isActive ? 'ເປີດ' : 'ປິດ',
    'ວັນທີສ້າງ': formatDate(t.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ສະຖານະຢືນຢັນ');
  XLSX.writeFile(wb, 'report_technician_verification.xlsx');
};

onMounted(loadData);
</script>

<style scoped>
@import '../styles/report.css';
</style>
