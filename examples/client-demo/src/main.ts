import { createApp } from 'vue';
import App from './App.vue';
import { setupElement } from "./plugins/element";
import "./style/index.scss";

const app = createApp(App);

setupElement(app);
app.mount('#app');
