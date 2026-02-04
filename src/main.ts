import "./shared/assets/css/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import App from "./App.vue";
import router from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './shared/assets/tailwind.css'
import FontAwesomeIcon from "./plugins/fontawesome"

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(LoadingPlugin)
app.use(Antd)
app.mount("#app");
