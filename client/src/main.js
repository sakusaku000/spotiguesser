import { createApp } from 'vue'
import './assets/css/tailwind.css';
import './assets/css/main.css';
import store from './store/index.js';
import App from './App.vue'

const app = createApp(App);
app.use(store);
app.mount("#app");    
