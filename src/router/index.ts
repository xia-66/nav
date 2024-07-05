import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index/index.vue";
import Search from "@/components/search/Search.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { title: "河南农业大学微服务平台" },
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
