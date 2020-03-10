import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false


//Axios配置
import Axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, Axios);
Axios.defaults.withCredentials = true;
Vue.prototype.$axios = Axios
//拦截get请求，加上时间参数，防止IE缓存
Axios.interceptors.request.use(
  (config) => {
    config.headers.Zeke_Up = 1;
    if(config.method=="post" || config.method=="get"){
      config.url = config.url.indexOf("?")>-1 ? config.url + "&_=" + (new Date().getTime()) : config.url + "?_=" + (new Date().getTime());
    }
    return config;
})


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI);

//引入css，在element后面引入
import './assets/css/common.scss';
import './assets/css/iconfont/iconfont.css';
import './assets/css/element-reset.scss';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
