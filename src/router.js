import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var routers =[
  {
    path: '/login',
    name: '登录',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/home',
    name: '主页',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/Home.vue')
  },
  {
    path: '/articleIndex',
    name: '文章',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/article/ArticleIndex.vue')
  },
  {
    path: '/articleEdit',
    name: '文章编辑',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/article/ArticleEdit.vue')
  },
  {
    path: '/articleView',
    name: '文章预览',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/article/ArticleView.vue')
  },
  {
    path: '/productIndex',
    name: '作品',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/product/ProductIndex.vue')
  },
  {
    path: '/productEdit',
    name: '作品编辑',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/product/ProductEdit.vue')
  },
  {
    path: '/productView',
    name: '作品预览',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/product/ProductView.vue')
  },
  {
    path: '/userIndex',
    name: '用户',
    // meta: {
    //   requireAuth: true
    // },
    component: () => import('./views/user/UserIndex.vue')
  },
]

var router_ = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routers
})

router_.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    var loginInfo = localStorage.getItem('Admin-Token')
    if (loginInfo) {
        next()
    } else {
      //重定向登录界面
      next({
        path: '/login',
        // query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router_
