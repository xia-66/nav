import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index/index.vue";
import Search from "@/components/search/Search.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { title: "黑羽导航" },
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    meta: { title: "搜索" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
