import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false



import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI);

//引入css，在element后面引入
import './assets/css/common.scss';
import './assets/css/iconfont/iconfont.css';
import './assets/css/element-reset.scss';


//Axios配置
import Axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, Axios);
Axios.defaults.withCredentials = true;

//拦截get请求，加上时间参数，防止IE缓存
Axios.interceptors.request.use(
  (config) => {
    config.headers.Zeke_Up = 1;
    if(config.method=="post" || config.method=="get"){
      config.url = config.url.indexOf("?")>-1 ? config.url + "&_=" + (new Date().getTime()) : config.url + "?_=" + (new Date().getTime());
    }
    return config;
})

//拦截服务器响应
Axios.interceptors.response.use(
  //成功
  res => {
    // console.log(res);
    return res;
  },
  error => {
    if(error.response.status=="401"){
      // console.log("没有登录！");
      Vue.prototype.$message.error("登录过期！3秒后自动跳转到登录界面！");
      setTimeout(function(){
        router.replace("/login");
      },3000)
    }
    return Promise.reject(error);
})

Vue.prototype.$axios = Axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
