<template>
  <div class="vl-parent">
    <loading v-model:active="openLoading" :can-cancel="false" :color="color" :background-color="background"
      :is-full-page="fullPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const color = ref("#f25e77")
const background = ref("#f5f5f5")
const props: any = defineProps({
  isloading: {
    type: Boolean,
    required: true,
  },
})
const openLoading = ref<any>(false)

const fullPage = ref<any>(true)

watch(() => props?.isloading, (value) => {
  openLoading.value = value
}, { deep: true, immediate: true })

</script>