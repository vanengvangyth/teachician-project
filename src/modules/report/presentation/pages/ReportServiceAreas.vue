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
          <p class="report-subtitle">ສະຖິຕິການປະກາດວຽກແຍກຕາມແຕ່ລະປະເພດວຽກ ແລະ ເຂດບໍລິການ</p>
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
      <div class="stat-card stat-card--blue"><p class="stat-label">ເຂດບໍລິການທັງໝົດ</p><p class="stat-value">{{ uniqueServiceAreasCount }}</p></div>
      <div class="stat-card stat-card--amber"><p class="stat-label">ການປະກາດວຽກທັງໝົດ (ຄັ້ງ)</p><p class="stat-value">{{ totalJobs }}</p></div>
      <div class="stat-card stat-card--teal"><p class="stat-label">ຊ່າງກົດຮັບທັງໝົດ (ຄັ້ງ)</p><p class="stat-value">{{ totalAccepted }}</p></div>
      <div class="stat-card stat-card--emerald"><p class="stat-label">ອັດຕາຄວາມສຳເລັດສະເລ່ຍ (%)</p><p class="stat-value">{{ avgSuccessRate }}%</p></div>
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
            <th>ເມືອງ</th>
            <th>ບ້ານ</th>
            <th>ຊື່ປະເພດວຽກ</th>
            <th>ຈຳນວນການປະກາດວຽກທັງໝົດ (ຄັ້ງ)</th>
            <th>ຈຳນວນທີ່ຊ່າງກົດຮັບ (ຄັ້ງ)</th>
            <th>ອັດຕາຄວາມສຳເລັດ (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in items" :key="i">
            <td class="td-num">{{ i + 1 }}</td>
            <td class="td-bold">{{ row.district }}</td>
            <td class="td-bold">{{ row.village }}</td>
            <td>{{ row.categoryName }}</td>
            <td>
              <span class="badge" :class="row.totalJobs > 0 ? 'badge--blue' : 'badge--gray'">
                {{ row.totalJobs }} ຄັ້ງ
              </span>
            </td>
            <td>
              <span class="badge" :class="row.acceptedJobs > 0 ? 'badge--amber' : 'badge--gray'">
                {{ row.acceptedJobs }} ຄັ້ງ
              </span>
            </td>
            <td>
              <span class="badge" :class="Number(row.successRate) > 75 ? 'badge--emerald' : Number(row.successRate) > 40 ? 'badge--amber' : 'badge--gray'">
                {{ row.successRate }}%
              </span>
            </td>
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
  items.value.reduce((sum, row) => sum + (row.totalJobs ?? 0), 0)
);

const totalAccepted = computed(() =>
  items.value.reduce((sum, row) => sum + (row.acceptedJobs ?? 0), 0)
);

const totalCompleted = computed(() =>
  items.value.reduce((sum, row) => sum + (row.completedJobs ?? 0), 0)
);

const avgSuccessRate = computed(() => {
  const totalVal = totalJobs.value;
  return totalVal > 0 ? ((totalCompleted.value / totalVal) * 100).toFixed(1) : '0.0';
});

const uniqueServiceAreasCount = computed(() => {
  const keys = new Set(
    items.value
      .filter(row => row.district !== 'ບໍ່ລະບຸ' || row.village !== 'ບໍ່ລະບຸ')
      .map(row => `${row.district}_${row.village}`)
  );
  return keys.size;
});

// Helper to map a job to a service area or extract village & district from the location text
const getJobServiceArea = (job: any, serviceAreas: any[]) => {
  let matchedVillage = '';
  let matchedDistrict = '';

  // 1. Try to find a match in the registered service areas database list
  if (job.location) {
    const jobLoc = job.location.toLowerCase();
    let bestScore = 0;

    for (const area of serviceAreas) {
      const v = area.village?.toLowerCase();
      const d = area.district?.toLowerCase();

      let score = 0;
      if (d && jobLoc.includes(d)) {
        score += 1;
        if (v && jobLoc.includes(v)) {
          score += 2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        matchedVillage = area.village || '';
        matchedDistrict = area.district || '';
      }
    }
  }

  // 2. If no matching database record found, parse the text directly
  if (!matchedDistrict && job.location) {
    const districtMatch = job.location.match(/(ເມືອງ|เມືອງ|District)\s*([\u0e80-\u0eff\w\s\-]+)/i);
    if (districtMatch) {
      matchedDistrict = districtMatch[2].split(/[,|\n]/)[0].trim();
    }

    const villageMatch = job.location.match(/(ບ້ານ|Ban)\s*([\u0e80-\u0eff\w\s\-]+)/i);
    if (villageMatch) {
      matchedVillage = villageMatch[2].split(/[,|\n]/)[0].trim();
    }
  }

  return {
    village: matchedVillage || 'ບໍ່ລະບຸ',
    district: matchedDistrict || 'ບໍ່ລະບຸ'
  };
};

const loadData = async () => {
  loading.value = true;
  try {
    const [catRes, jobRes, saRes] = await Promise.all([
      axios.get('/categories', { params: { page: 1, perPage: 1000 } }),
      axios.get('/jobs', { params: { page: 1, perPage: 1000 } }),
      axios.get('/service_areas', { params: { page: 1, perPage: 1000 } })
    ]);

    const categories = catRes.data.data ?? catRes.data ?? [];
    const jobs = jobRes.data.data ?? jobRes.data ?? [];
    const serviceAreas = saRes.data.data ?? saRes.data ?? [];

    // Group jobs by service area first
    const saGroups: { [key: string]: any } = {};

    // Initialize with registered service areas so we preserve them
    serviceAreas.forEach((sa: any) => {
      const d = sa.district || 'ບໍ່ລະບຸ';
      const v = sa.village || 'ບໍ່ລະບຸ';
      const key = `${d}_${v}`;
      if (!saGroups[key]) {
        saGroups[key] = {
          district: d,
          village: v,
          jobs: []
        };
      }
    });

    // Populate jobs into their respective service areas
    jobs.forEach((j: any) => {
      const { village, district } = getJobServiceArea(j, serviceAreas);
      const key = `${district}_${village}`;
      if (!saGroups[key]) {
        saGroups[key] = {
          district,
          village,
          jobs: []
        };
      }
      saGroups[key].jobs.push(j);
    });

    // Flatten data by grouping jobs in each service area by category
    const finalItems: any[] = [];

    Object.values(saGroups).forEach((sa: any) => {
      if (sa.jobs.length === 0) {
        finalItems.push({
          district: sa.district,
          village: sa.village,
          categoryName: '-',
          totalJobs: 0,
          acceptedJobs: 0,
          completedJobs: 0,
          successRate: '0.0'
        });
      } else {
        const catGroups: { [key: string]: any } = {};
        sa.jobs.forEach((j: any) => {
          const catId = j.categoryId ?? j.category?.id ?? 0;
          const foundCat = categories.find((c: any) => Number(c.id) === Number(catId));
          const catName = foundCat?.nameLao || j.category?.nameLao || j.category?.name || 'ບໍ່ມີປະເພດ';

          if (!catGroups[catId]) {
            catGroups[catId] = {
              district: sa.district,
              village: sa.village,
              categoryName: catName,
              totalJobs: 0,
              acceptedJobs: 0,
              completedJobs: 0
            };
          }

          catGroups[catId].totalJobs += 1;

          const isAccepted = j.workerId || j.worker || ['in_progress', 'completed'].includes(j.status?.toLowerCase());
          if (isAccepted) {
            catGroups[catId].acceptedJobs += 1;
          }

          if (j.status?.toLowerCase() === 'completed') {
            catGroups[catId].completedJobs += 1;
          }
        });

        Object.values(catGroups).forEach((cg: any) => {
          const successRate = cg.totalJobs > 0
            ? ((cg.completedJobs / cg.totalJobs) * 100).toFixed(1)
            : '0.0';
          finalItems.push({
            ...cg,
            successRate
          });
        });
      }
    });

    items.value = finalItems;
    total.value = items.value.length;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = items.value.map((row, i) => ({
    '#': i + 1,
    'ເມືອງ': row.district,
    'ບ້ານ': row.village,
    'ຊື່ປະເພດວຽກ': row.categoryName,
    'ຈຳນວນການປະກາດວຽກທັງໝົດ (ຄັ້ງ)': row.totalJobs ?? 0,
    'ຈຳນວນທີ່ຊ່າງກົດຮັບ (ຄັ້ງ)': row.acceptedJobs ?? 0,
    'ອັດຕາຄວາມສຳເລັດ (%)': `${row.successRate}%`,
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
