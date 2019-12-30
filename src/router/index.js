import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/user/Login'
import Error from '@/views/error/404'
import Layout from '@/components/Layout.vue'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    },{
      path: '/',
      name: 'index',
      redirect: '/role/user-manage',
      component: Layout,
      meta: { title: '首页', module: '/' },
      children: [
        {
          path: '/role/user-manage',
          name: 'UserManage',
          component: () => import('@/views/role/UserManage'),
          meta: { title: '用户管理', module: '/role/user-manage' }
        },
        {
          path: '/role/admin-manage',
          name: 'AdminManage',
          component: () => import('@/views/role/AdminManage'),
          meta: { title: '管理员管理', module: '/role/admin-manage' }
        },
        {
          path: '/petAdopt-manage',
          name: 'PetAdoptManage',
          component: () => import('@/views/adopt/PetAdopt'),
          meta: { title: '宠物领养管理', module: '/petAdopt-manage' }
        },
        {
          path: '/petAdopt-manage/comment/:id',
          name: 'PetCommentManage',
          component: () => import('@/views/adopt/PetComment'),
          meta: { title: '宠物领养管理', module: '/petAdopt-manage' }
        },
        {
          path: '/petAdopt-manage/like/:id',
          name: 'PetLikeManage',
          component: () => import('@/views/adopt/PetLike'),
          meta: { title: '宠物领养管理', module: '/petAdopt-manage' }
        },
        {
          path: '/petBreed-manage',
          name: 'PetBreedManage',
          component: () => import('@/views/breed/PetBreed'),
          meta: { title: '宠物品种管理', module: '/petBreed-manage' }
        },
        {
          path: '/bbs-manage',
          name: 'BBSManage',
          component: () => import('@/views/bbs/bbsManage'),
          meta: { title: '论坛管理', module: '/bbs-manage' }
        },
        {
          path: '/bbs-manage/comment/:id',
          name: 'BBSCommentManage',
          component: () => import('@/views/bbs/bbsComment'),
          meta: { title: '论坛管理', module: '/bbs-manage' }
        },
        {
          path: '/show-manage',
          name: 'ShowManage',
          component: () => import('@/views/show/ShowManage'),
          meta: { title: '宠物秀管理', module: '/show-manage' }
        },
        {
          path: '/show-manage/comment/:id',
          name: 'ShowCommentManage',
          component: () => import('@/views/show/ShowComment'),
          meta: { title: '宠物秀管理', module: '/show-manage' }
        },
        {
          path: '/carousel-manage',
          name: 'CarouselManage',
          component: () => import('@/views/carousel/CarouselManage'),
          meta: { title: '轮播图管理', module: '/carousel-manage' }
        }
      ]

    },
    
  ]
})
