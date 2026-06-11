<template>
  <div class="report-page">
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
      <button @click="exportExcel" class="btn-export" :disabled="loading || items.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Excel
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card stat-card--blue"><p class="stat-label">ທັງໝົດ</p><p class="stat-value">{{ total }}</p></div>
      <div class="stat-card stat-card--emerald"><p class="stat-label">ເປີດໃຊ້</p><p class="stat-value">{{ countActive(true) }}</p></div>
      <div class="stat-card stat-card--red"><p class="stat-label">ປິດໃຊ້</p><p class="stat-value">{{ countActive(false) }}</p></div>
      <div class="stat-card stat-card--amber"><p class="stat-label">ບໍ່ລະບຸ</p><p class="stat-value">{{ items.filter(c => c.isActive === undefined || c.isActive === null).length }}</p></div>
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
            <th>ຊື່ປະເພດ</th>
            <th>ລາຍລະອຽດ</th>
            <th>ສະຖານະ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cat, i) in items" :key="cat.id">
            <td class="td-num">{{ i + 1 }}</td>
            <td class="td-bold">{{ cat.nameLao || '-' }}</td>
            <td class="td-desc">{{ cat.descriptionLao || '-' }}</td>
            <td>
              <span class="badge" :class="cat.isActive === false ? 'badge--red' : 'badge--emerald'">
                {{ cat.isActive === false ? 'ປິດ' : 'ເປີດ' }}
              </span>
            </td>
            <td>{{ formatDate(cat.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import axios from '../../../../service/axios';

const items = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const countActive = (val: boolean) =>
  items.value.filter(c => c.isActive === val).length;

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/categories', { params: { page: 1, perPage: 1000 } });
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
  const rows = items.value.map((c, i) => ({
    '#': i + 1,
    'ຊື່ປະເພດ': c.name || '-',
    'ລາຍລະອຽດ': c.description || '-',
    'ສະຖານະ': c.isActive === false ? 'ປິດ' : 'ເປີດ',
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
</style>
