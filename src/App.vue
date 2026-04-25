<template>
  <div class="layouts" v-if="token">
    <Loading :isloading="isLoading" />
    <nav>
      <Toast />
      <Sidebar />
    </nav>

    <div class="main-wrapper">
      <main>
        <RouterView />
      </main>

      <footer class="app-footer">
        <div class="footer-left">
          <div class="footer-icon">⚙</div>
          <div>
            <div class="footer-name">Admin Dashboard</div>
            <div class="footer-version">v1.0.0</div>
          </div>
        </div>
        <div class="footer-center">
          <span class="status-dot"></span>
          <span>ລະບົບເຮັດວຽກປົກກະຕິ</span>
        </div>
        <div class="footer-right">© 2025 Admin System · NestJS · Vue 3</div>
      </footer>
    </div>

  </div>
  <div v-else style="height: 100%">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from "./stores/loading";
import { RouterView } from "vue-router";
import Sidebar from "./shared/components/layouts/sidebar.vue";
import Toast from "./shared/components/toast.vue";
import Loading from "./shared/components/Loading.vue";
import { useAuthStore } from "./stores/auth";
import { storeToRefs } from "pinia";
import { useToastStore } from "./stores/toast";

import { ref } from "vue";

const loadingStore = useLoadingStore();

const { isLoading } = storeToRefs(loadingStore);

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
    overflow: hidden;

    .main-wrapper {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: hidden;
    }

    main {
      margin: 20px 20px 0 20px;
      flex-grow: 1;
      overflow-y: auto; 
      display: flex; 
      flex-direction: column;

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

.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border-top: 1px solid var(--black-300);
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  font-size: 12px;
  color: #333;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .footer-icon {
      font-size: 20px;
    }

    .footer-name {
      font-size: 13px;
      font-weight: 600;
      color: #111;
    }

    .footer-version {
      font-size: 11px;
      color: #666;
    }
  }

  .footer-center {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #333;

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #1D9E75;
    }
  }

  .footer-right {
    color: #666; 
  }
}
</style>
