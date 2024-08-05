import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index/index.vue";
import Login from "@/components/login/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { title: "黑羽导航" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "测试" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
