<template>
  <div class="sidebar">
    <div class="sidebar-items">
      <RouterLink class="sidebar-item" to="/">
        <p>
          <Home class="w-4 h-4 mx-2" />
          ໜ້າຫຼັກ
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/category">
        <p>
          <List class="w-4 h-4 mx-2" />
          Category
        </p>
      </RouterLink>

       <RouterLink class="sidebar-item" to="/comment">
        <p>
          <MessagesSquare class="w-4 h-4 mx-2" />
          Comment
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/job">
        <p>
          <Briefcase class="w-4 h-4 mx-2" />
          Job
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/techician">
        <p>
          <HardHat class="w-4 h-4 mx-2" />
          Technician
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/document">
        <p>
          <FileText class="w-4 h-4 mx-2" />
          Document
        </p>
      </RouterLink> 

      <RouterLink class="sidebar-item" to="/attachment">
        <p>
          <Paperclip class="w-4 h-4 mx-2" />
          Attachment
        </p>
      </RouterLink> 
      
      <RouterLink class="sidebar-item" to="/notification">
        <p>
          <Bell class="w-4 h-4 mx-2" />
          Notification
        </p>
      </RouterLink> 

      <RouterLink class="sidebar-item" :to="{ path: '/product', query: { page: '1', search: '' } }">
        <p>
          <Package class="w-4 h-4 mx-2" />
          Product
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/test">
        <p>
          <TestTube class="w-4 h-4 mx-2" />
          Test
        </p>
      </RouterLink>

      <RouterLink class="sidebar-item" to="/stock-history">
        <p>
          <Archive class="w-4 h-4 mx-2" />
          StockHistory
        </p>
      </RouterLink>

      <!-- GROUP -->
      <div class="sidebar-item has-child" :class="{ expanded }">
        <p @click="expanded = !expanded">
          <Folder class="w-4 h-4 mx-2" />
          ການຈັດການ
          <ChevronRight class="chevron" />
        </p>

        <ul>
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
          ຂໍ້ມູນພະນັກງານ
        </p>
      </RouterLink>
    </div>

    <a class="logout" @click="log_Out">
      <LogOut class="w-4 h-4 mx-2" />
      Logout
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
  Package,
  TestTube,
  Briefcase,
  HardHat, 
  MessagesSquare,
  Paperclip,
  Bell,
  UserCheck,
  FileText,
  Archive,
  Folder,
  Users,
  LogOut,
  ChevronRight,
} from 'lucide-vue-next';

const store = useAuthStore();
const { logOut } = store;
const expanded = ref(false);
const route = useRoute();

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
  border-right: 1px solid var(--black-300);
}

.sidebar-items {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;

  .sidebar-item {
    user-select: none;

    &.router-link-active {
      p {
        background-color: var(--primary-100);
        color: var(--primary-900);
        box-shadow: 0 0 0 1px var(--primary-900);
      }

      i {
        font-weight: 700;
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
    }

    i {
      width: 20px;
    }
  }

  .sidebar-item.has-child {
    flex-direction: column;
    align-items: flex-start;

    p {
      display: flex;
      align-items: center;

      span {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        &::before {
          content: "";
          height: 2px;
          border-radius: 2px;
          width: 12px;
          background-color: var(--black-900);
          position: absolute;
          transition: all ease-in-out 0.15s;
        }

        &::after {
          content: "";
          height: 12px;
          width: 2px;
          background-color: var(--black-900);
          position: absolute;
          border-radius: 2px;
          transition: all ease-in-out 0.15s;
        }
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

        span {
          &::after {
            background-color: var(--primary-100);
            z-index: 0;
          }

          &::before {
            z-index: 1;
            background-color: var(--primary-900);
          }
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
  color: var(--black-500);
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
