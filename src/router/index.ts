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
      component: () => import("../modules/user/presentation/pages/UserListPage.vue")
    },
    {
      path: "/test",
      name: "test",
      component: () => import("../modules/test/presentation/pages/TestListPage.vue")
    },
    // {
    //   path: "/່job",
    //   name: "job",
    //   component: () => import("../modules/job/presentation/pages/JobListPage.vue")
    // },
    {
      path: "/category",
      name: "category",
      component: () => import("../modules/category/presentation/pages/CategoryListPage.vue")
    }
    // {
    //   path: "/product",
    //   name: "product",
    //   component: () => import("../modules/product/presentation/pages/ProductListPage.vue")
    // }
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
