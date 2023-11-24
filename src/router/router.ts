import Main from "../routes/main/Main.vue";
import Dashboard from "../routes/dashboard/Dashboard.vue";
import MultilevelDashboard from "../routes/dashboard/MultilevelDashboard.vue";
import { createRouter, createWebHashHistory } from "vue-router";
// let routes: { path: string; component: any }[];

const routes = [
  { path: "/", component: Main, name: "designer" },
  { path: "/dashboard", component: Dashboard, name: "dashboard" },
  {
    path: "/multilevel-dashboard",
    component: MultilevelDashboard,
    name: "multilevelDashboard",
  },
] as any;

export const router = createRouter({
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});
