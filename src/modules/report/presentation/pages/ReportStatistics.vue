<template>
  <div class="report-page">
    <div class="report-header">
      <div class="report-header__left">
        <div class="report-icon report-icon--teal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <div>
          <h1 class="report-title">ລາຍງານສະຖິຕິການປະກາດວຽກ</h1>
          <p class="report-subtitle">ສະຖິຕິການປະກາດວຽກແຍກຕາມແຕ່ລະປະເພດວຽກ ແລະ ເຂດບໍລິການ</p>
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
        <p class="stat-label">ການປະກາດວຽກທັງໝົດ</p>
        <p class="stat-value">{{ totalJobs }}</p>
      </div>
      <div class="stat-card stat-card--amber">
        <p class="stat-label">ຮັບວຽກແລ້ວ</p>
        <p class="stat-value">{{ acceptedRate }}%</p>
      </div>
      <div class="stat-card stat-card--teal">
        <p class="stat-label">ປະເພດວຽກ</p>
        <p class="stat-value text-sm-value">{{ overallPopularCategory }}</p>
      </div>
      <div class="stat-card stat-card--emerald">
        <p class="stat-label">ສະຖານທີ່</p>
        <p class="stat-value">{{ locationPopular }}</p>
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
            <th>ຊື່ຜູ້ໂພສ໌ວຽກ</th>
            <th>ຊື່ຜູ້ຮັບວຽກ</th>
            <th>ສະຖານທີ່</th>
            <th>ຊື່ວຽກ</th>
            <th>ສະຖານະວຽກ</th>
            <th>ອັດຕາຄວາມສຳເລັດ (%)</th>
            <th>ປະເພດວຽກຍອດນິຍົມ (%)</th>
            <th>ວັນທີ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in paginatedItems" :key="row.id">
            <td class="td-num">{{ (currentPage - 1) * perPage + i + 1 }}</td>
            <td class="td-bold">{{ row.posterName }}</td>
            <td class="td-bold">{{ row.workerName }}</td>
            <td>{{ row.location }}</td>
            <td class="td-bold">{{ row.title }}</td>
            <td>
              <span class="badge" :class="statusBadge(row.status)">{{ translateStatus(row.status) }}</span>
            </td>
            <td>
              <span class="badge"
                :class="Number(row.successRate) > 75 ? 'badge--emerald' : Number(row.successRate) > 40 ? 'badge--amber' : 'badge--gray'">
                {{ row.successRate }}%
              </span>
            </td>
            <td>
              <span class="badge badge--purple">
                {{ row.popularCategory }}
              </span>
            </td>
            <td>{{ formatDate(row.createdAt) }}</td>
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
const rawJobs = ref<any[]>([]);
const rawServiceAreas = ref<any[]>([]);
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

const matchesSearch = (row: any) => {
  if (!search.value) return true;
  const term = search.value.toLowerCase();
  return (
    (row.location && row.location.toLowerCase().includes(term)) ||
    (row.title && row.title.toLowerCase().includes(term)) ||
    (row.categoryName && row.categoryName.toLowerCase().includes(term)) ||
    (row.status && row.status.toLowerCase().includes(term)) ||
    (row.cancellationReason && row.cancellationReason.toLowerCase().includes(term)) ||
    (row.posterName && row.posterName.toLowerCase().includes(term)) ||
    (row.workerName && row.workerName.toLowerCase().includes(term))
  );
};

const filteredJobs = computed(() => {
  return rawJobs.value.filter(job => isWithinDateRange(job.createdAt));
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

const serviceAreaStats = computed(() => {
  const stats: {
    [key: string]: {
      total: number;
      completed: number;
      accepted: number;
      categoryCounts: { [key: string]: { name: string; count: number } };
    }
  } = {};

  const serviceAreas = rawServiceAreas.value;
  const categories = rawCategories.value;

  filteredJobs.value.forEach((j: any) => {
    const { village, district } = getJobServiceArea(j, serviceAreas);
    const key = `${district}_${village}`;

    if (!stats[key]) {
      stats[key] = {
        total: 0,
        completed: 0,
        accepted: 0,
        categoryCounts: {}
      };
    }

    const saStat = stats[key];
    saStat.total += 1;
    if (j.status?.toLowerCase() === 'completed') {
      saStat.completed += 1;
    }
    const isAccepted = j.workerId || j.worker || ['accepted', 'in_progress', 'completed'].includes(j.status?.toLowerCase());
    if (isAccepted) {
      saStat.accepted += 1;
    }

    const catId = j.categoryId ?? j.category?.id ?? 0;
    const foundCat = categories.find((c: any) => Number(c.id) === Number(catId));
    const catName = foundCat?.nameLao || j.category?.nameLao || j.category?.name || 'ບໍ່ມີປະເພດ';

    if (!saStat.categoryCounts[catId]) {
      saStat.categoryCounts[catId] = {
        name: catName,
        count: 0
      };
    }
    saStat.categoryCounts[catId].count += 1;
  });

  const result: { [key: string]: { successRate: string; popularCategory: string; acceptedCount: number } } = {};

  Object.entries(stats).forEach(([key, saStat]) => {
    const successRate = saStat.total > 0
      ? ((saStat.completed / saStat.total) * 100).toFixed(1)
      : '0.0';

    let maxCount = 0;
    let popularCatName = '-';
    let popularPct = '0.0';

    Object.values(saStat.categoryCounts).forEach((catInfo: any) => {
      if (catInfo.count > maxCount) {
        maxCount = catInfo.count;
        popularCatName = catInfo.name;
      }
    });

    if (saStat.total > 0 && maxCount > 0) {
      popularPct = ((maxCount / saStat.total) * 100).toFixed(1);
    }

    result[key] = {
      successRate,
      popularCategory: maxCount > 0 ? `${popularCatName} (${popularPct}%)` : '-',
      acceptedCount: saStat.accepted
    };
  });

  return result;
});

const groupedItems = computed(() => {
  const categories = rawCategories.value;
  const jobs = filteredJobs.value;
  const serviceAreas = rawServiceAreas.value;
  const statsMap = serviceAreaStats.value;

  return jobs.map((j: any) => {
    const { village, district } = getJobServiceArea(j, serviceAreas);
    const key = `${district}_${village}`;
    const stats = statsMap[key] || { successRate: '0.0', popularCategory: '-', acceptedCount: 0 };

    const catId = j.categoryId ?? j.category?.id ?? 0;
    const foundCat = categories.find((c: any) => Number(c.id) === Number(catId));
    const catName = foundCat?.nameLao || j.category?.nameLao || j.category?.name || 'ບໍ່ມີປະເພດ';

    const posterName = j.user?.fullName || (typeof j.user === 'string' ? j.user : '-') || '-';

    let workerName = '-';
    const workerData = j.worker;
    if (workerData) {
      if (typeof workerData === 'string') {
        try {
          const parsed = JSON.parse(workerData);
          workerName = parsed.fullName || parsed.name || workerData;
        } catch {
          workerName = workerData;
        }
      } else {
        workerName = workerData.fullName || workerData.name || '-';
      }
    }

    return {
      id: j.jobId ?? j.id,
      location: j.location || 'ບໍ່ມີຂໍ້ມູນ',
      district,
      village,
      posterName,
      workerName,
      title: j.title || j.name || 'ບໍ່ມີຂໍ້ມູນ',
      categoryName: catName,
      status: j.status || 'ບໍ່ມີຂໍ້ມູນ',
      cancellationReason: j.cancellationReason || '-',
      successRate: stats.successRate,
      popularCategory: stats.popularCategory,
      acceptedCount: stats.acceptedCount,
      workerId: j.workerId || j.worker?.id || null,
      createdAt: j.createdAt
    };
  });
});

const filteredItems = computed(() => {
  return groupedItems.value.filter(matchesSearch);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredItems.value.slice(start, start + perPage);
});

const numberOfPage = computed(() => Math.ceil(filteredItems.value.length / perPage));

const totalJobs = computed(() => filteredItems.value.length);

const totalAccepted = computed(() => {
  return filteredItems.value.filter((row: any) => {
    const status = row.status?.toLowerCase();
    return !!row.workerId || ['accepted', 'in_progress', 'completed'].includes(status);
  }).length;
});

const acceptedRate = computed(() => {
  const total = totalJobs.value;
  return total > 0 ? ((totalAccepted.value / total) * 100).toFixed(1) : '0.0';
});

const formatDate = (d: string) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('lo-LA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const overallPopularCategory = computed(() => {
  const counts: { [key: string]: number } = {};
  filteredItems.value.forEach((row: any) => {
    if (row.categoryName && row.categoryName !== '-' && row.categoryName !== 'ບໍ່ມີປະເພດ') {
      counts[row.categoryName] = (counts[row.categoryName] || 0) + 1;
    }
  });

  let maxCount = 0;
  let popularName = '-';
  Object.entries(counts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      popularName = name;
    }
  });

  if (maxCount > 0 && filteredItems.value.length > 0) {
    const pct = ((maxCount / filteredItems.value.length) * 100).toFixed(1);
    return `${popularName} (${pct}%)`;
  }
  return '-';
});

const locationPopular = computed(() => {
  const counts: { [key: string]: number } = {};
  filteredItems.value.forEach((row: any) => {
    let locKey = '';
    if (row.district && row.district !== 'ບໍ່ລະບຸ') {
      locKey = row.village && row.village !== 'ບໍ່ລະບຸ'
        ? `${row.district} (${row.village})`
        : row.district;
    } else if (row.location && row.location !== 'ບໍ່ມີຂໍ້ມູນ') {
      locKey = row.location;
    }

    if (locKey) {
      counts[locKey] = (counts[locKey] || 0) + 1;
    }
  });

  let maxCount = 0;
  let popularName = '-';
  Object.entries(counts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      popularName = name;
    }
  });

  if (maxCount > 0 && filteredItems.value.length > 0) {
    const pct = ((maxCount / filteredItems.value.length) * 100).toFixed(1);
    return `${popularName} (${pct}%)`;
  }
  return '-';
});

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
    const [catRes, jobRes, saRes] = await Promise.all([
      axios.get('/categories', { params: { page: 1, perPage: 1000 } }),
      axios.get('/jobs', { params: { page: 1, perPage: 1000 } }),
      axios.get('/service_areas', { params: { page: 1, perPage: 1000 } })
    ]);

    rawCategories.value = catRes.data.data ?? catRes.data ?? [];
    rawJobs.value = jobRes.data.data ?? jobRes.data ?? [];
    rawServiceAreas.value = saRes.data.data ?? saRes.data ?? [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const exportExcel = () => {
  const rows = filteredItems.value.map((row, i) => ({
    '#': i + 1,
    'ຊື່ຜູ້ໂພສ໌ວຽກ': row.posterName,
    'ຊື່ຜູ້ຮັບວຽກ': row.workerName,
    'ສະຖານທີ່': row.location,
    'ຊື່ວຽກ': row.title,
    'ປະເພດວຽກ': row.categoryName,
    'ສະຖານະວຽກ': translateStatus(row.status),
    'ອັດຕາຄວາມສຳເລັດ (%)': `${row.successRate}%`,
    'ປະເພດວຽກຍອດນິຍົມ (%)': row.popularCategory,
    'ວັນທີ': formatDate(row.createdAt),
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

.text-sm-value {
  font-size: 0.95rem !important;
  line-height: 1.2 !important;
  word-break: break-word;
}
</style>
