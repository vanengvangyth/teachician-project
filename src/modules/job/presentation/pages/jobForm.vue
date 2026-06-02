<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">

    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 border-b">
      <h1 class="text-2xl font-bold text-slate-800">ຈັດການວຽກ</h1>
    </div>

    <!-- FORM GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

      <!-- LEFT SIDE -->
      <div class="space-y-4">

        <!-- User -->
        <div>
          <label class="block text-sm font-semibold mb-1">User</label>
          <select v-model="userValue" class="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">-- select user --</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.fullName }}
            </option>
          </select>
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.userId }}</p>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold mb-1">Title</label>
          <input v-model="titleValue" type="text" placeholder="Title"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold mb-1">Description</label>
          <input v-model="descriptionValue" type="text" placeholder="Description"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold mb-1">Category</label>
          <select v-model="categoryValue" class="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">-- select category --</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.nameLao }}
            </option>
          </select>
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.categoryId }}</p>
        </div>

        <!-- Estimated Duration -->
        <div>
          <label class="block text-sm font-semibold mb-1">Estimated Duration</label>
          <input v-model="estimatedDurationValue" type="number" placeholder="Estimated Duration"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.estimatedDuration }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-semibold mb-1">Status</label>
          <input v-model="statusValue" type="text" placeholder="Status"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.status }}</p>
        </div>

      </div>

      <!-- RIGHT SIDE -->
      <div class="space-y-4">

        <!-- Location -->
        <div>
          <label class="block text-sm font-semibold mb-1">Location</label>
          <input v-model="locationValue" type="text" placeholder="Location"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.location }}</p>
        </div>

        <!-- Map -->
        <div>
          <label class="block text-sm font-semibold mb-1">Map (ຄລິກ ຫຼື ລາກເຂັມເພື່ອປັກໝຸດ)</label>
          <div ref="mapContainer" class="w-full h-64 rounded-lg border border-slate-200 shadow-sm z-0"></div>
        </div>

        <!-- Latitude -->
        <div>
          <label class="block text-sm font-semibold mb-1">Latitude</label>
          <input v-model="latitudeValue" type="text" placeholder="Latitude"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.latitude }}</p>
        </div>

        <!-- Longitude -->
        <div>
          <label class="block text-sm font-semibold mb-1">Longitude</label>
          <input v-model="longitudeValue" type="text" placeholder="Longitude"
            class="w-full rounded-lg border px-3 py-2 text-sm" />
          <p v-if="errors.userId" class="text-red-500 text-xs mt-1">{{ errors.longitude }}</p>
        </div>

      </div>

    </div>

    <!-- BUTTONS -->
    <div class="flex justify-center gap-4 mt-10 mb-10">

      <button @click="goBack" class="px-6 py-2 bg-slate-200 rounded-lg">
        Cancel
      </button>

      <button v-if="route.params.id" @click="onUpdate" class="px-6 py-2 bg-amber-500 text-white rounded-lg">
        Update
      </button>
      <button v-else @click="onSubmit" class="px-6 py-2 bg-sky-500 text-white rounded-lg">
        Save
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { JobRepositoryImpl } from "../../infrastructure/repositories/job.repository.impl";
import { CreateJobUseCase } from "../../application/use-cases/create-jobs.usecase";
import { UpdateJobUseCase } from "../../application/use-cases/update-jobs.usecase";
import { GetOneJobUseCase } from "../../application/use-cases/get-one-jobs.usecase";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { userApi } from "../../../user/infrastructure/api/user.api";
import { categoryApi } from "../../../category/infrastructure/api/category.api";
import { useToastStore } from "../../../../stores/toast";
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
const emits = defineEmits(["closeForm"]);

const toastStore = useToastStore();

const repo = new JobRepositoryImpl();
const createUseCase = new CreateJobUseCase(repo);
const updateUseCase = new UpdateJobUseCase(repo);
const getOneUseCase = new GetOneJobUseCase(repo);

const users = ref<any[]>([]);
const categories = ref<any[]>([]);

const router = useRouter();
const id = computed(() => Number(route.params.id));

const goBack = () => {
  router.push("/job");
};

const fetchUsers = async () => {
  const res = await userApi.getAll();
  users.value = res.data; // ສ່ວນຫຼາຍ API ຈະຢູ່ໃນ data
};

const fetchCategories = async () => {
  const res = await categoryApi.getAll();
  categories.value = res.data;
};

const schema = yup.object({
  userId: yup.mixed()
    .test("required", "ກະລຸນາເລືອກ User", (val) => !!val),

  categoryId: yup.mixed()
    .test("required", "ກະລຸນາເລືອກ Category", (val) => !!val),

  title: yup.string().required("ກະລຸນາປ້ອນ Title"),
  description: yup.string().required("ກະລຸນາປ້ອນ Description"),
  location: yup.string().required("ກະລຸນາປ້ອນ Location"),
  latitude: yup.string().required("ກະລຸນາປ້ອນ Latitude"),
  longitude: yup.string().required("ກະລຸນາປ້ອນ Longitude"),
  estimatedDuration: yup.number().typeError("ກະລຸນາປ້ອນຕົວເລກ").required("ກະລຸນາປ້ອນ Estimated Duration").min(0),
  status: yup.string().required("ກະລຸນາປ້ອນ Status"),
});

const { handleSubmit, defineField, setFieldValue, handleReset, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    userId: "",
    title: "",
    description: "",
    categoryId: "",
    location: "",
    latitude: "",
    longitude: "",
    estimatedDuration: "",
    status: "",
  },
});

const [userValue] = defineField("userId");
const [titleValue] = defineField("title");
const [descriptionValue] = defineField("description");
const [categoryValue] = defineField("categoryId");
const [locationValue] = defineField("location");
const [latitudeValue] = defineField("latitude");
const [longitudeValue] = defineField("longitude");
const [estimatedDurationValue] = defineField("estimatedDuration");
const [statusValue] = defineField("status");

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

// Helper to update coordinates fields and place/move the marker
const updateCoordinates = (lat: number, lng: number) => {
  setFieldValue("latitude", lat.toFixed(6));
  setFieldValue("longitude", lng.toFixed(6));

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else if (map) {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      if (marker) {
        const position = marker.getLatLng();
        updateCoordinates(position.lat, position.lng);
      }
    });
  }
};

// Sync map state based on form input values (e.g. during load or edit)
const syncMapFromInputs = () => {
  const lat = Number(latitudeValue.value);
  const lng = Number(longitudeValue.value);
  if (map && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
    map.setView([lat, lng], 15);
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        if (marker) {
          const position = marker.getLatLng();
          updateCoordinates(position.lat, position.lng);
        }
      });
    }
  }
};

// Create
const onSubmit = handleSubmit(async (values: any) => {
  try {
    const res = await createUseCase.execute({
      userId: values.userId,
      categoryId: values.categoryId,
      title: values.title,
      description: values.description,
      location: values.location,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      estimatedDuration: Number(values.estimatedDuration),
      status: values.status,
    });
    toastStore.toast("ສ້າງວຽກສຳເລັດ")
    if (res?.id) {
      router.push("/job?refresh=" + Date.now());
    }
  } catch (e) {
    console.error("Create error:", e);
    toastStore.toast("ສ້າງວຽກບໍ່ສຳເລັດ");
  }
});

// Update
const onUpdate = handleSubmit(async (values: any) => {
  try {
    const id = route.params.id;
    const mapJob = (job: any) => ({
      jobId: job.jobId,
      userId: job.user?.id,
      categoryId: job.category?.id,
      title: job.title,
      description: job.description,
      location: job.location,
      latitude: Number(job.latitude),
      longitude: Number(job.longitude),
      estimatedDuration: job.estimatedDuration,
      status: job.status,

    });

    const res = await updateUseCase.execute(
      id,
      mapJob({
        userId: values.user,
        categoryId: values.category,
        title: values.title,
        description: values.description,
        location: values.location,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        estimatedDuration: Number(values.estimatedDuration),
        status: values.status,
      })
    );

    toastStore.toast("✅ ແກ້ໄຂສຳເລັດ");
    if (res?.id) {
      router.push("/job?refresh=" + Date.now());
    }
  } catch (e) {
    console.error("Update error:", e);
    toastStore.toast("❌ ແກ້ໄຂບໍ່ສຳເລັດ");
  }
});


// Load data for edit
const editItem = async (id: number) => {
  const res: any = await getOneUseCase.execute(id);

  console.log("EDIT DATA:", res);

  setFieldValue("userId", res.data.userId);
  setFieldValue("title", res.data.title);
  setFieldValue("description", res.data.description);
  setFieldValue("categoryId", res.data.categoryId);
  setFieldValue("location", res.data.location);
  setFieldValue("latitude", res.data.latitude);
  setFieldValue("longitude", res.data.longitude);
  setFieldValue("estimatedDuration", res.data.estimatedDuration);
  setFieldValue("status", res.data.status);

  // Sync map center and marker position after loading edit item
  setTimeout(() => {
    syncMapFromInputs();
  }, 150);
};


// Watch for edit mode
watch(
  id,
  (newId) => {
    if (newId) {
      editItem(newId);
    } else {
      handleReset();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchCategories()]);

  if (mapContainer.value) {
    const initialLat = Number(latitudeValue.value) || 17.9757;
    const initialLng = Number(longitudeValue.value) || 102.6331;
    const initialZoom = (latitudeValue.value && longitudeValue.value) ? 15 : 13;

    map = L.map(mapContainer.value).setView([initialLat, initialLng], initialZoom);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
      }
    ).addTo(map);

    if (latitudeValue.value && longitudeValue.value) {
      const lat = Number(latitudeValue.value);
      const lng = Number(longitudeValue.value);
      marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        if (marker) {
          const position = marker.getLatLng();
          updateCoordinates(position.lat, position.lng);
        }
      });
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      updateCoordinates(lat, lng);
    });

    // ✅ อยู่ใน if block — map ไม่เป็น null แน่นอน
    const FindMeControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd() {
        const btn = L.DomUtil.create('button', '');
        btn.innerHTML = '📍 Find Me';
        btn.style.cssText = `
          background: white;
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        `;
        btn.onmouseover = () => btn.style.background = '#f0f9ff';
        btn.onmouseout = () => btn.style.background = 'white';

        L.DomEvent.on(btn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              map?.setView([latitude, longitude], 16);
              updateCoordinates(latitude, longitude);
            },
            () => alert('ບໍ່ສາມາດດຶງຕຳແໜ່ງໄດ້'),
            { enableHighAccuracy: true }
          );
        });

        return btn;
      }
    });

    new FindMeControl().addTo(map);
  }
});
</script>
