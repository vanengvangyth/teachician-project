<template>
  <div v-if="isloading" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white px-6 py-4 rounded-lg shadow">
      ⏳ Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isloading: Boolean,
});
</script>x