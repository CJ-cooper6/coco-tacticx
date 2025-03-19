import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/LandingPage.vue";
import Field from "./components/Field.vue";

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
      component: Field,
    },
  ],
});

export default router;
