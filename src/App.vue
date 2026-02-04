<template>
  <div class="layouts" v-if="token">
    <Loading :isloading="isloading" />
    <nav>
      <Toast />
      <Sidebar />
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
  <div v-else style="height: 100%">
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./shared/components/layouts/sidebar.vue";
import Toast from "./shared/components/toast.vue";
import Loading from "./shared/components/Loading.vue";
import { useAuthStore } from "./stores/auth";
import { storeToRefs } from "pinia";
import { useToastStore } from "./stores/toast";

import { ref } from "vue";

const isloading = ref<any>(false);

const store = useAuthStore();

const toastStore = useToastStore();

const { toast } = toastStore;

const { token } = storeToRefs(store);
</script>
<style lang="scss">
body,
html {
  font-family: var(--font-family);
  height: 100%;
  font-weight: 500;
  overflow-x: hidden;
}

#app {
  height: 100%;
  overflow: hidden;

  .layouts {
    display: flex;
    height: 100%;

    main {
      margin-right: 20px;
      margin-top: 20px;
      margin-left: 20px;
      flex-grow: 1;

      .page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .page-header {
          padding: 0 1.5rem;
          min-height: 4rem;
          max-height: 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fff;
          border-bottom: 1px solid var(--black-300);

          .page-header-start {
            display: flex;
            align-items: center;
            position: relative;

            .page-title {
              font-weight: 700;
              font-size: var(--lg-font);
            }
          }
        }

        .page-body {
          flex-grow: 1;
          padding: 1.5rem;
          height: 100%;
          overflow-y: auto;
        }

        .page-footer {
          height: 6rem;
          display: flex;
          align-items: center;
          background-color: #fff;
          padding: 0 1rem;
          position: relative;
          z-index: 3;
        }
      }
    }
  }
}

.ellipse {
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
