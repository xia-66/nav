import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { title: "黑羽导航" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
