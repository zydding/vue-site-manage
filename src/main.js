import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'es6-promise/auto'
import store from './store';

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

Axios.defaults.withCredentials = true;

//拦截get请求，加上时间参数，防止IE缓存
Axios.interceptors.request.use(
  (config) => {
    config.headers.Zeke_Up = 1;
    config.headers.is_back = 1;
    if(config.method=="post" || config.method=="get"){
      config.url = config.url.indexOf("?")>-1 ? config.url + "&_=" + (new Date().getTime()) : config.url + "?_=" + (new Date().getTime());
    }
    return config;
})

//拦截服务器响应
Axios.interceptors.response.use(
  //成功
  res => {
    //把userInfo放在Vuex中
    if(res.headers.user_role){
      // console.log("info",JSON.parse(res.headers.userinfo),store);
      //在后端接口中把userInfo加入session，每个接口调用时都更新vuex的userinfo，在每个前端页面的操作列判断vuex
      //模块提交
      store.commit("user/setProp",JSON.parse(res.headers.user_role));
    }
    if(res.status=="203"){
      Vue.prototype.$message.error("登录过期！3秒后自动跳转到登录界面！");
      setTimeout(function(){
        router.replace("/login");
      },3000)
    }
    return res;
  },
  error => {
    if(error.response.status=="203"){
      // console.log("没有登录！");
      Vue.prototype.$message.error("登录过期！3秒后自动跳转到登录界面！");
      setTimeout(function(){
        router.replace("/login");
      },3000)
    }
    return Promise.reject(error);
})

Vue.prototype.$axios = Axios

Vue.use(VueAxios, Axios);


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
