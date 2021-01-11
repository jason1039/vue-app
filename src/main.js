import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
let port = 5040;
axios.get(`/test`).catch(() => {
  port++;
});
console.log(port);
Vue.config.productionTip = false
const userRequest = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})
Vue.use(VueAxios, userRequest)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
