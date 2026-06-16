import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../modules/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../modules/Login.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../modules/user/presentation/pages/UserListPage.vue"),
    },

    {
      path: "/users",
      name: "users",
      // 📌 ໃຫ້ໃຊ້ Component ໂຕນີ້ ເພາະເຮົາຂຽນ Filter ໃຫ້ສະແດງສະເພາະລູກຄ້າ (Role: User) ໄວ້ແລ້ວ
      component: () => import("../modules/user/presentation/pages/user.vue"),
    },
    {
      path: "/user/:id/detail",
      name: "user.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/user/presentation/pages/userDetail.vue")
    },

    // Category
    {
      path: "/category",
      name: "category",
      component: () => import("../modules/category/presentation/pages/CategoryListPage.vue")
    },
    {
      path: "/category/:id/detail",
      name: "category.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/category/presentation/pages/categoryDetail.vue")
    },

    //Comment
    {
      path: "/comment",
      name: "comment",
      component: () => import("../modules/comment/presentation/pages/CommentListPage.vue")
    },

    //Job
    {
      path: "/job",
      name: "job",
      component: () => import("../modules/job/presentation/pages/JobListPage.vue")
    },
    {
      path: "/job/create",
      name: "job.create",
      meta: { requiresAuth: true },
      component: () => import("../modules/job/presentation/pages/jobForm.vue")
    },
    {
      path: "/job/:id/edit",
      name: "job.edit",
      meta: { requiresAuth: true },
      component: () => import("../modules/job/presentation/pages/jobForm.vue")
    },
    {
      path: "/job/:id/detail",
      name: "job.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/job/presentation/pages/jobDetail.vue")
    },

    //Techician
    {
      path: "/techician",
      name: "techician",
      component: () => import("../modules/techician/presentation/pages/TechicianListPage.vue")
    },
    {
      path: "/techician/:id/detail",
      name: "techician.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/techician/presentation/pages/techicianDetail.vue")
    },

    //Document
    {
      path: "/document",
      name: "document",
      component: () => import("../modules/document/presentation/pages/DocumentListPage.vue")
    },

    {
      path: "/document/:id/detail",
      name: "document.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/document/presentation/pages/DocumentDetail.vue")
    },

    // Atttachment
    {
      path: "/attachment",
      name: "attachment",
      component: () => import("../modules/attachment/presentation/pages/AttachmentListPage.vue")
    },

    //Notification
    {
      path: "/notification",
      name: "notification",
      component: () => import("../modules/notification/presentation/pages/NotificationListPage.vue")
    },
    {
      path: "/notification/:id/detail",
      name: "notification.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/notification/presentation/pages/notificationDetail.vue")
    },

    //Service_area
    {
      path: "/service_area",
      name: "service_area",
      component: () => import("../modules/service_area/presentation/pages/Service_areaListPage.vue")
    },
    {
      path: "/service_area/:id/detail",
      name: "service_area.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/service_area/presentation/pages/service_areaDetail.vue")
    },

    //Technician_service
    {
      path: "/technician_service",
      name: "technician_service",
      component: () => import("../modules/technician_service/presentation/pages/Technician_serviceListPage.vue")
    },
    {
      path: "/technician_service/:id/detail",
      name: "technician_service.detail",
      meta: { requiresAuth: true },
      component: () => import("../modules/technician_service/presentation/pages/technician_serviceDetail.vue")
    },

    //systemlog
    {
      path: "/systemlog",
      name: "systemlog",
      component: () => import("../modules/systemlog/presentation/pages/SystemlogListPage.vue")
    },

    // Reports
    {
      path: "/manage/users",
      name: "report.users",
      meta: { requiresAuth: true },
      component: () => import("../modules/report/presentation/pages/ReportUsers.vue")
    },
    {
      path: "/manage/job",
      name: "report.jobs",
      meta: { requiresAuth: true },
      component: () => import("../modules/report/presentation/pages/ReportJobs.vue")
    },
    {
      path: "/manage/category",
      name: "report.categories",
      meta: { requiresAuth: true },
      component: () => import("../modules/report/presentation/pages/ReportCategories.vue")
    },
    {
      path: "/manage/service-area",
      name: "report.serviceArea",
      meta: { requiresAuth: true },
      component: () => import("../modules/report/presentation/pages/ReportServiceAreas.vue")
    },
    {
      path: "/manage/technician-status",
      name: "report.technicianStatus",
      meta: { requiresAuth: true },
      component: () => import("../modules/report/presentation/pages/ReportTechnicianVerification.vue")
    },
  ],
});

router.beforeEach((to) => {
  const store = useAuthStore();

  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);

  console.log("to:", to.path);
  console.log("isAuth:", store.isAuth);


  if (authRequired && !store.isAuth) return "/login";
  if (store.isAuth && to.path === "/login") return "/";
});

export default router;
