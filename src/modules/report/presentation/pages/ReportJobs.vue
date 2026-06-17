<template>
  <div class="report-page">
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--amber">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານຂໍ້ມູນວຽກ</h1>
          <p class="report-subtitle">ຂໍ້ມູນວຽກທັງໝົດໃນລະບົບ</p>
        </div>
      </div>
      <button @click="exportExcel" class="btn-export" :disabled="loading || items.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Excel
      </button>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card stat-card--blue"><p class="stat-label">ທັງໝົດ</p><p class="stat-value">{{ total }}</p></div>
      <div class="stat-card stat-card--emerald"><p class="stat-label">ສຳເລັດ</p><p class="stat-value">{{ countByStatus('completed') }}</p></div>
      <div class="stat-card stat-card--amber"><p class="stat-label">ກຳລັງດຳເນີນ</p><p class="stat-value">{{ countByStatus('in_progress') }}</p></div>
      <div class="stat-card stat-card--red"><p class="stat-label">ຍົກເລີກ</p><p class="stat-value">{{ countByStatus('cancelled') }}</p></div>
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
            <th>ໂພສ໌ໂດຍ</th>
            <th>ຊື່ວຽກ</th>
            <th>ລາຍລະອຽດ</th>
            <th>ປະເພດ</th>
            <th>ສະຖານທີ່</th>
            <th>ສະຖານະ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, i) in items" :key="job.id">
            <td class="td-num">{{ i + 1 }}</td>
            <td class="td-bold">{{ job.user?.fullName || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td class="td-bold">{{ job.title || job.name || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td class="td-desc">{{ job.description || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>{{ job.category?.nameLao || job.categoryId || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>{{ job.location || 'ບໍ່ມີຂໍ້ມູນ' }}</td>
            <td>
              <span class="badge" :class="statusBadge(job.status)">{{ job.status || 'ບໍ່ມີຂໍ້ມູນ' }}</span>
            </td>
            <td>{{ formatDate(job.createdAt) }}</td>
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

const countByStatus = (status: string) =>
  items.value.filter(j => j.status?.toLowerCase() === status).length;

const statusBadge = (status: string) => {
  const map: any = {
    completed: 'badge--emerald',
    in_progress: 'badge--amber',
    cancelled: 'badge--red',
    pending: 'badge--blue',
  };
  return map[status?.toLowerCase()] ?? 'badge--gray';
};

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/jobs', { params: { page: 1, perPage: 1000 } });
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
  const rows = items.value.map((j, i) => ({
    '#': i + 1,
    'ຊື່ວຽກ': j.title || j.name || 'ບໍ່ມີຂໍ້ມູນ',
    'ລາຍລະອຽດ': j.description || 'ບໍ່ມີຂໍ້ມູນ',
    'ປະເພດ': j.category?.nameLao || j.categoryId || 'ບໍ່ມີຂໍ້ມູນ',
    'ສະຖານະ': j.status || 'ບໍ່ມີຂໍ້ມູນ',
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
</style>
