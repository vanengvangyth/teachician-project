<template>
  <div class="report-page">
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--teal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານສະຖິຕິການປະກາດວຽກ</h1>
          <p class="report-subtitle">ສະຖິຕິ Service Area ທັງໝົດໃນລະບົບ</p>
        </div>
      </div>
      <button @click="exportExcel" class="btn-export" :disabled="loading || items.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Excel
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card stat-card--blue"><p class="stat-label">ທັງໝົດ</p><p class="stat-value">{{ total }}</p></div>
      <div class="stat-card stat-card--teal"><p class="stat-label">ເຂດທີ່ມີວຽກ</p><p class="stat-value">{{ items.filter(s => (s.jobCount ?? 0) > 0).length }}</p></div>
      <div class="stat-card stat-card--amber"><p class="stat-label">ວຽກທັງໝົດ</p><p class="stat-value">{{ totalJobs }}</p></div>
      <div class="stat-card stat-card--emerald"><p class="stat-label">ສະເລ່ຍ/ເຂດ</p><p class="stat-value">{{ avgJobs }}</p></div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="table-loading"><div class="spinner"></div><span>ກຳລັງໂຫລດຂໍ້ມູນ...</span></div>
      <div v-else-if="items.length === 0" class="table-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-slate-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p>ບໍ່ພົບຂໍ້ມູນ</p>
      </div>
      <table v-else class="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ຊື່ເຂດ</th>
            <th>ລາຍລະອຽດ</th>
            <th>ຈຳນວນວຽກ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(area, i) in items" :key="area.id">
            <td class="td-num">{{ i + 1 }}</td>
            <td class="td-bold">{{ area.district || '-' }}</td>
            <td class="td-desc">{{ area.descriptionLao || '-' }}</td>
            <td>
              <span class="badge" :class="(area.jobCount ?? 0) > 0 ? 'badge--teal' : 'badge--gray'">
                {{ area.jobCount ?? 0 }} ວຽກ
              </span>
            </td>
            <td>{{ formatDate(area.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import axios from '../../../../service/axios';

const items = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const totalJobs = computed(() =>
  items.value.reduce((sum, s) => sum + (s.jobCount ?? 0), 0)
);
const avgJobs = computed(() =>
  items.value.length ? (totalJobs.value / items.value.length).toFixed(1) : '0'
);

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/service_areas', { params: { page: 1, perPage: 1000 } });
    const data = res.data;
    items.value = data.data ?? data ?? [];
    total.value = data.total ?? items.value.length;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = items.value.map((s, i) => ({
    '#': i + 1,
    'ຊື່ເຂດ': s.name || '-',
    'ລາຍລະອຽດ': s.description || '-',
    'ຈຳນວນວຽກ': s.jobCount ?? 0,
    'ວັນທີສ້າງ': formatDate(s.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ສະຖິຕິການປະກາດວຽກ');
  XLSX.writeFile(wb, 'report_service_areas.xlsx');
};

onMounted(loadData);
</script>

<style scoped>
@import '../styles/report.css';
</style>
