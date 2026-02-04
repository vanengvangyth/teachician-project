<template>
  <div class="flex items-center justify-center gap-4 p-4 rounded-lg shadow-md">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-700">Page</span>

      <button @click="prevPage">
        <font-awesome-icon icon="chevron-left" />
      </button>

      <input
        type="text"
        :value="currentPage"
        disabled
        class="w-10 text-center rounded-md border border-gray-300 bg-gray-100 text-gray-800 font-medium outline-none"
      />

      <button @click="nextPage">
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <span class="text-sm text-gray-500">/ {{ numberOfPage }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  numberOfPage: { type: Number, required: true },
});

const router = useRouter();
const route = useRoute();

const currentPage = computed(() => {
  const page = route.query.page;
  return page ? parseInt(page as string) : 1;
});

const nextPage = () => {
  if (currentPage.value >= props.numberOfPage) return;
  router.push({
    ...route,
    query: { ...route.query, page: (currentPage.value + 1).toString() },
  });
};

const prevPage = () => {
  if (currentPage.value <= 1) return;
  router.push({
    ...route,
    query: { ...route.query, page: (currentPage.value - 1).toString() },
  });
};
</script>
