import Vue from 'vue'
import App from './App.vue'
import {router} from "./router"
import store from "./store/index"
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  router: router,
  store,
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    } 
  },
  render: h => h(App),
}).$mount('#app');

