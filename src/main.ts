import "./assets/styles/main.css";
import "virtual:svg-icons-register";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import { debug } from "./utils/debugBus";

import App from "./App.vue";
import pinia from "./stores/index.js";

const app = createApp(App);
if (import.meta.env.DEV) {
  window.$debug = debug;
}

app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
