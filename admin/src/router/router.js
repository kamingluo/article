import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { title: '系统首页' }
        },
        {
          path: '/users',
          component: resolve => require(['../components/page/Users.vue'], resolve),
          meta: { title: '用户列表' }
        },
        {
          path: '/article',
          component: resolve => require(['../components/page/Article.vue'], resolve),
          meta: { title: '文章列表' }
        },
        {
          path: '/articleEdit',
          component: resolve => require(['../components/page/ArticleEdit.vue'], resolve),
          meta: { title: '文章',noActive:true },
        },
        {
          path: '/banner',
          component: resolve => require(['../components/page/Banner.vue'], resolve),
          meta: { title: '首页轮播图' }
        },
        {
          path: '/bannerEdit',
          component: resolve => require(['../components/page/BannerEdit.vue'], resolve),
          meta: { title: '轮播图' },
        },
        {
          path: '/channel',
          component: resolve => require(['../components/page/Channel.vue'], resolve),
          meta: { title: '用户渠道配置' }
        },
        {
          path: '/clickaddata',
          component: resolve => require(['../components/page/Clickaddata.vue'], resolve),
          meta: { title: '点击广告列表' }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    },

  ]
})

