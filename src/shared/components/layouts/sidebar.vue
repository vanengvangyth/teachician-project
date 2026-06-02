<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': !isOpen }">
    <div class="sidebar-top">
      <button class="toggle-btn" @click="emit('toggle')">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="3" width="14" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="8" width="14" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="13" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
    <div class="sidebar-items">
      <RouterLink class="sidebar-item" to="/">
        <p>
          <Home class="w-4 h-4 mx-2" />
          <span class="label">ໜ້າຫຼັກ</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/category">
        <p>
          <List class="w-4 h-4 mx-2" />
          <span class="label">Category</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/comment">
        <p>
          <MessagesSquare class="w-4 h-4 mx-2" />
          <span class="label">Comment</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/job">
        <p>
          <Briefcase class="w-4 h-4 mx-2" />
          <span class="label">Job</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/techician">
        <p>
          <HardHat class="w-4 h-4 mx-2" />
          <span class="label">Technician</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/document">
        <p>
          <FileText class="w-4 h-4 mx-2" />
          <span class="label">Document</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/attachment">
        <p>
          <Paperclip class="w-4 h-4 mx-2" />
          <span class="label">Attachment</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/notification">
        <p>
          <Bell class="w-4 h-4 mx-2" />
          <span class="label">Notification</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/service_area">
        <p>
          <MapPin class="w-4 h-4 mx-2" />
          <span class="label">Service_area</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/technician_service">
        <p>
          <Wrench class="w-4 h-4 mx-2" />
          <span class="label">Technician_service</span>
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/systemlog">
        <p>
          <ScrollText class="w-4 h-4 mx-2" />
          <span class="label">Systemlog</span>
        </p>
      </RouterLink>

      <!-- GROUP -->
      <div class="sidebar-item has-child" :class="{ expanded: expanded && isOpen }">
        <p @click="isOpen && (expanded = !expanded)">
          <Folder class="w-4 h-4 mx-2" />
          <span class="label">ການຈັດການ</span>
          <ChevronRight class="chevron label" />
        </p>

        <ul v-show="isOpen && expanded">
          <li>
            <RouterLink to="/manage/benefit">Benefit</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage/skill-library">Skill Library</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage/skill-level">Skill Level</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage/language">Language</RouterLink>
          </li>
          <li>
            <RouterLink to="/manage/language-level">Language Level</RouterLink>
          </li>
        </ul>
      </div>

      <RouterLink class="sidebar-item" :to="{ path: '/user', query: { page: '1', search: '' } }">
        <p>
          <Users class="w-4 h-4 mx-2" />
          <span class="label">ຂໍ້ມູນພະນັກງານ</span>
        </p>
      </RouterLink>
    </div>

    <a class="logout" @click="log_Out">
      <LogOut class="w-4 h-4 mx-2" />
      <span class="label">Logout</span>
    </a>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
import {
  Home,
  List,
  Briefcase,
  HardHat,
  MessagesSquare,
  Paperclip,
  Bell,
  MapPin,
  Wrench,
  ScrollText,
  FileText,
  Folder,
  Users,
  LogOut,
  ChevronRight,
} from 'lucide-vue-next';

defineProps<{
  isOpen: boolean
}>()

const store = useAuthStore();
const { logOut } = store;
const expanded = ref(false);
const route = useRoute();

const emit = defineEmits(['toggle'])

watch(
  route,
  () => {
    if (
      [
        "/manage/benefit",
        "/manage/skill-library",
        "/manage/skill-level",
        "/manage/language",
        "/manage/language-level",
      ].includes(route.path)
    ) {
      expanded.value = true;
    }
  },
  { immediate: true }
);

const log_Out = async () => {
  await logOut();
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #5370917b;
  border-right: 1px solid #64748b65;

  width: 220px;
  min-width: 220px;
  transition: width 0.3s ease, min-width 0.3s ease;
  overflow: hidden;


  &--collapsed {
    width: 56px;
    min-width: 56px;

    // ເຊື່ອງ label text
    .label {
      display: none;
    }

    // icon ໃຫ້ center
    p {
      justify-content: center;
      padding: 0;
      padding: 0 !important;
    }

    svg {
      margin: 0 !important;
    }

    // logout icon center
    .logout {
      justify-content: center;
      padding: 0;
    }
  }
}

.sidebar-top {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
}

.toggle-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #000000;
  cursor: pointer;
  transition: all .2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, .12);

  filter:
    drop-shadow(0 0 2px rgba(37, 99, 235, .8)) drop-shadow(0 0 8px rgba(37, 99, 235, .5));
}

.sidebar-items {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  overflow: auto;

  .sidebar-item {
    user-select: none;

    &.router-link-active {
      p {
        background-color: transparent;
        color: #0051ff;
        text-shadow:
          0 0 16px rgba(255, 255, 255, 0.4);
      }

      svg {
        filter:
          drop-shadow(0 0 2px rgba(37, 99, 235, 0.8)) drop-shadow(0 0 6px rgba(37, 99, 235, 0.6)) drop-shadow(0 0 12px rgba(37, 99, 235, 0.6));
      }
    }

    // router-link-active
    p {
      display: flex;
      align-items: center;
      height: 2.5rem;
      margin: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all ease-in-out 0.15s;
      border-radius: 6px;
      padding: 0 1rem;
      font-size: var(--sm-font);
      white-space: nowrap;
    }

    i {
      width: 20px;
    }
  }

  .sidebar-item.has-child {
    flex-direction: column;
    align-items: flex-start;

    p {
      width: 100%;
      display: flex;
      align-items: center;

      .chevron {
        margin-left: auto;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        transition: transform 0.15s ease;
      }
    }

    ul {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.15s ease-out;
      border-radius: 6px;

      li {
        white-space: pre;
        line-height: 2.8rem;
        display: flex;
        align-items: center;
        padding-right: 2rem;

        a {
          display: flex;

          &::before {
            margin-left: 1rem;
            width: 30px;
            content: "\e130";
            font-family: "Font Awesome 6 Pro";
            font-weight: 700;
            display: flex;
            font-size: 0.7rem;
            padding-left: 5px;
            color: var(--black-400);
          }

          &.router-link-active {
            display: flex;
            color: var(--primary-900);

            &::before {
              content: "\e130";
              font-family: "Font Awesome 6 Pro";
              font-weight: 700;
              display: flex;
              font-size: 0.7rem;
              width: 30px;
              padding-left: 5px;
              color: var(--primary-900);
            }
          }
        }
      }
    }

    // ul
    &.expanded {
      p {
        color: var(--primary-900);

        .chevron {
          transform: rotate(90deg);
        }
      }

      ul {
        height: auto;
        max-height: 500px;
        background-color: var(--primary-100);
      }
    }
  }
}

.logout {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  color: red;
  transition: all ease-in-out 0.15s;

  &:hover {
    color: var(--orange-900);

    &::before {
      content: "\f52b";
    }
  }

  &::before {
    content: "\f52a";
    font-family: "Font Awesome 6 Pro";
    font-weight: 700;
  }
}
</style>
