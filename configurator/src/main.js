import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from 'vue-router'
//import { routes } from 'vue-auto-routes'
import routes from 'pages-generated';
import vClickOutside from "click-outside-vue3";

console.log(routes)

import App from "./App.vue";
import "./assets/index.css"

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vClickOutside);

app.mount("#app");
