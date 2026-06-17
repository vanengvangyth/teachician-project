<template>
  <div class="report-page">
    <!-- HEADER -->
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານຂໍ້ມູນສະມາຊິກ</h1>
          <p class="report-subtitle">ຂໍ້ມູນຜູ້ໃຊ້ທັງໝົດໃນລະບົບ</p>
        </div>
      </div>
      <button @click="exportExcel" class="btn-export" :disabled="loading || items.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Excel
      </button>
    </div>

    <!-- STATS CARDS -->
    <div class="stats-grid">
      <div class="stat-card stat-card--blue">
        <p class="stat-label">ທັງໝົດ</p>
        <p class="stat-value">{{ total }}</p>
      </div>
      <div class="stat-card stat-card--emerald">
        <p class="stat-label">ຊ່າງ</p>
        <p class="stat-value">{{ countByRole('technician') }}</p>
      </div>
      <div class="stat-card stat-card--sky">
        <p class="stat-label">ລູກຄ້າ</p>
        <p class="stat-value">{{ countByRole('user') }}</p>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <div class="spinner"></div>
        <span>ກຳລັງໂຫລດຂໍ້ມູນ...</span>
      </div>
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
            <th>ຊື່</th>
            <th>ອີເມວ</th>
            <th>ເບີໂທ</th>
            <th>ສິດ</th>
            <th>ສະຖານະ</th>
            <th>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in items" :key="user.id">
            <td class="td-num">{{ i + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="avatar">{{ user.fullName?.charAt(0)?.toUpperCase() || 'U' }}</div>
                <span>{{ user.fullName || '-' }}</span>
              </div>
            </td>
            <td>{{ user.email || '-' }}</td>
            <td>{{ user.phone || '-' }}</td>
            <td>
              <span class="badge" :class="roleBadge(user.role)">{{ user.role }}</span>
            </td>
            <td>
              <span class="badge" :class="user.isActive ? 'badge--green' : 'badge--gray'">
                {{ user.isActive ? 'ເປີດ' : 'ປິດ' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import * as XLSX from 'xlsx';
import axios from '../../../../service/axios';

const items = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const countByRole = (role: string) =>
  items.value.filter(u => {
    const r = u.role?.toLowerCase();
    if (role === 'technician') {
      return r === 'technician' || r === 'technicians';
    }
    return r === role;
  }).length;

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

const loadData = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/users', { params: { page: 1, perPage: 1000 } });
    const data = res.data;
    const rawUsers = data.data ?? data ?? [];
    items.value = rawUsers.filter((u: any) => {
      const r = u.role?.toLowerCase();
      return r === 'user' || r === 'technician' || r === 'technicians';
    });
    total.value = items.value.length;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = items.value.map((u, i) => ({
    '#': i + 1,
    'ຊື່ ແລະ ນາມສະກຸນ': u.fullName || '-',
    'ອີເມວ': u.email || '-',
    'ເບີໂທ': u.phone || '-',
    'ສິດ': u.role || '-',
    'ສະຖານະ': u.isActive ? 'ເປີດ' : 'ປິດ',
    'ວັນທີສ້າງ': formatDate(u.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານສະມາຊິກ');
  XLSX.writeFile(wb, 'report_users.xlsx');
};

onMounted(loadData);
</script>

<style scoped>
@import '../styles/report.css';

.stats-grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 500px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
