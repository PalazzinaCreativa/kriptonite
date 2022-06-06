import { createApp } from "vue";
import { createPinia } from "pinia";
import vClickOutside from "click-outside-vue3";

import App from "./App.vue";
import "./assets/index.css"

const app = createApp(App);

app.use(createPinia());
app.use(vClickOutside);

app.mount("#app");
