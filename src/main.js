import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.timeout = 3000;
function getPort(port) {
  // let url = `http://localhost:${port}`;
  let url = ``;
  axios.get(`${url}/test`).then((response) => {
    if (response.data == `TestCheck`) {
      const userRequest = axios.create({
        baseURL: url,
        headers: { 'Content-Type': 'application/json' },
      });
      Vue.config.productionTip = false
      Vue.use(VueAxios, userRequest);
      new Vue({
        router,
        render: h => h(App)
      }).$mount('#app');
    } else {
      port++;
      // getPort(port);
    }
  }).catch(() => {
    port++;
    // getPort(port);
  });
}
getPort(5050);