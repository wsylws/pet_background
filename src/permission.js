import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', '404'] 

router.beforeEach((to, from, next) => {
  NProgress.start()
  const { id } = store.getters.getUser
  if (id) {
    if (to.name === 'login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
