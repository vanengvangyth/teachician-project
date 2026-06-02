<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b bg-white rounded-t-xl">
      <div class="flex items-center gap-4">
        <button @click="goBack"
          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition flex items-center gap-1 cursor-pointer font-sans text-sm font-semibold">
          ກັບຄືນ
        </button>
        <h1 class="text-2xl font-bold text-slate-800 font-sans">ລາຍລະອຽດວຽກ</h1>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bg-white rounded-b-xl border-t border-slate-100 p-6 shadow-sm">
      <div v-if="isLoading" class="text-center py-10 text-slate-500 font-sans text-sm">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
      <div v-else-if="!job" class="text-center py-10 text-slate-500 font-sans text-sm">ບໍ່ພົບຂໍ້ມູນວຽກນີ້</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Left Side: Basic Info -->
        <div class="space-y-6 font-sans">
          <div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusClass(job.status)">
              {{ job.status || 'open' }}
            </span>
            <h2 class="text-2xl font-bold text-slate-800 mt-3">{{ job.title }}</h2>
            <p class="text-sm text-slate-500 mt-1">ລະຫັດວຽກ: #{{ job.jobId }}</p>
          </div>

          <div class="border-t border-slate-100 pt-4 space-y-3">
            <div class="flex items-start gap-2">
              <span class="font-semibold w-28 text-slate-500 text-lg">ປະເພດວຽກ:</span>
              <span class="text-slate-800 text-lg font-semibold">{{ job.category?.nameLao || '-' }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-semibold w-28 text-slate-500 text-lg">ລາຍລະອຽດ:</span>
              <span class="text-slate-700 text-lg break-words flex-1">{{ job.description || '-' }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-semibold w-28 text-slate-500 text-lg">ເວລາປະເມີນ:</span>
              <span class="text-slate-800 text-lg font-semibold">{{ job.estimatedDuration }} ຊົ່ວໂມງ</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-semibold w-28 text-slate-500 text-lg">ວັນທີ່ສ້າງ:</span>
              <span class="text-slate-600 text-lg">{{ new Date(job.createdAt).toLocaleString('lo-LA') }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-semibold w-28 text-slate-500 text-lg">ວັນທີ່ແກ້ໄຂ:</span>
              <span class="text-slate-600 text-lg">{{ new Date(job.updatedAt).toLocaleString('lo-LA') }}</span>
            </div>
          </div>

          <!-- User Card -->
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
            <h3 class="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              👤 ຂໍ້ມູນຜູ້ໂພສວຽກ
            </h3>
            <div class="space-y-2 text-lg">
              <div class="flex">
                <span class="text-slate-400 w-24">ຊື່ຜູ້ໃຊ້:</span>
                <span class="text-slate-800 font-semibold">{{ job.user?.fullName || '-' }}</span>
              </div>
              <div class="flex">
                <span class="text-slate-400 w-24">ອີເມວ:</span>
                <span class="text-slate-600">{{ job.user?.email || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Location & Map -->
        <div class="space-y-4 font-sans">
          <div>
            <h3 class="text-base font-semibold text-slate-800">📍 ສະຖານທີ່</h3>
            <p class="text-lg text-slate-600 mt-1">{{ job.location || '-' }}</p>
          </div>

          <!-- Map Container -->
          <div>
            <div ref="mapContainer" class="w-full h-72 rounded-lg border border-slate-200 shadow-lg z-0"></div>
          </div>

          <!-- Lat & Long display -->
          <div class="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border">
            <div>
              <span class="text-slate-400 font-medium">Latitude</span>
              <div class="font-mono text-slate-700 mt-0.5 font-bold">{{ job.latitude || '-' }}</div>
            </div>
            <div>
              <span class="text-slate-400 font-medium">Longitude</span>
              <div class="font-mono text-slate-700 mt-0.5 font-bold">{{ job.longitude || '-' }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { JobRepositoryImpl } from "../../infrastructure/repositories/job.repository.impl";
import { GetOneJobUseCase } from "../../application/use-cases/get-one-jobs.usecase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Vite asset loader issues for default Leaflet markers
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const route = useRoute();
const router = useRouter();
const repo = new JobRepositoryImpl();
const getOneUseCase = new GetOneJobUseCase(repo);

const isLoading = ref(true);
const job = ref<any>(null);
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

const goBack = () => {
  router.push("/job");
};

function statusClass(status: string) {
  const mapClasses: any = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return mapClasses[status] ?? 'bg-slate-100 text-slate-600';
}

const loadJob = async () => {
  try {
    isLoading.value = true;
    const id = Number(route.params.id);
    const res: any = await getOneUseCase.execute(id);
    job.value = res.data;

    // Load map after data is fetched
    setTimeout(() => {
      initMap();
    }, 100);
  } catch (error) {
    console.error("Fetch job detail failed:", error);
  } finally {
    isLoading.value = false;
  }
};

const initMap = () => {
  if (!mapContainer.value || !job.value) return;

  const lat = Number(job.value.latitude) || 17.9757;
  const lng = Number(job.value.longitude) || 102.6331;

  map = L.map(mapContainer.value).setView([lat, lng], 15);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    }
  ).addTo(map);

  // Place a static marker
  L.marker([lat, lng]).addTo(map)
    .bindPopup(`<b>${job.value.title}</b><br>${job.value.location || ''}`)
    .openPopup();
};

onMounted(loadJob);
</script>
