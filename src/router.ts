import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./views/LandingPage.vue";
import BoardView from "./views/BoardView.vue";
import ChangelogPage from "./views/ChangelogPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
    {
      path: "/board",
      name: "board",
      component: BoardView,
    },
    {
      path: "/changelog",
      name: "changelog",
      component: ChangelogPage,
    },
  ],
});

export default router;
