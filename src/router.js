import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const routers =[
//   {
//     path: '/login',
//     name: '登录',
//     component: () => import('./views/Login.vue')
//   },
//   {
//     path: '/home',
//     name: '主页',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/Home.vue')
//   },
//   {
//     path: '/articleIndex',
//     name: '文章',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/article/ArticleIndex.vue')
//   },
//   {
//     path: '/articleEdit',
//     name: '文章编辑',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/article/ArticleEdit.vue')
//   },
//   {
//     path: '/articleView',
//     name: '文章预览',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/article/ArticleView.vue')
//   },
//   {
//     path: '/productIndex',
//     name: '作品',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/product/ProductIndex.vue')
//   },
//   {
//     path: '/productEdit',
//     name: '作品编辑',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/product/ProductEdit.vue')
//   },
//   {
//     path: '/userIndex',
//     name: '用户',
//     meta: {
//       requireAuth: true
//     },
//     component: () => import('./views/user/UserIndex.vue')
//   },
// ]

var routers =[
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  {
    path: '/login',
    name: '登录',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/',
    redirect: '/home',
    meta: {
      requireAuth: true
    },
    component: () => import('./views/Home.vue'),
    children :[
      {
        path: 'home',
        name: '系统首页',
        meta: {
          isRouter: true,
          requireAuth: true
        },
        component: () => import('./views/Dashboard.vue')
      },
      {
        path: 'pageViewLog',
        name: '访问日志',
        meta: {
          isRouter: true,
          requireAuth: true
        },
        component: () => import('./views/pageView/PageViewLog.vue')
      },
      {
        path: 'articleIndex',
        name: '文章管理',
        meta: {
          isRouter: true,
          requireAuth: true
        },
        component: () => import('./views/article/ArticleIndex.vue')
      },
      {
        path: 'articleEdit',
        name: '文章编辑',
        meta: {
          requireAuth: true
        },
        component: () => import('./views/article/ArticleEdit.vue')
      },
      {
        path: 'articleView',
        name: '文章预览',
        meta: {
          requireAuth: true
        },
        component: () => import('./views/article/ArticleView.vue')
      },
      {
        path: 'productIndex',
        name: '作品管理',
        meta: {
          isRouter: true,
          requireAuth: true
        },
        component: () => import('./views/product/ProductIndex.vue')
      },
      {
        path: 'productEdit',
        name: '作品编辑',
        meta: {
          requireAuth: true
        },
        component: () => import('./views/product/ProductEdit.vue')
      },
      {
        path: 'userIndex',
        name: '用户管理',
        meta: {
          isRouter: true,
          requireAuth: true
        },
        component: () => import('./views/user/UserIndex.vue')
      }
    ]
  },
  {
    // 会匹配所有路径
    path: '*',
    component: () => import('./components/404.vue')
  }
]

var router_ = new Router({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes: routers
})

router_.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    var loginInfo = sessionStorage.getItem('logined')
    // console.log(loginInfo);
    if (loginInfo && loginInfo=="true") {
        next()
    } else {
      //重定向登录界面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router_
