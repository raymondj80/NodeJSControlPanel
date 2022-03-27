import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/HomeView'
import Charts from './views/ChartView'
import Login from './views/LoginView'
import Register from "./views/RegisterView"
import FireBase from "./services/firebase"

Vue.use(VueRouter)

// Set up routes
const routes = [
    { path: '/', 
      component: Home,
      name: 'Home',
      meta: {
        requiresAuth: true,
      }
    },
    { path: '/charts', 
      component: Charts,
      name: 'Charts',
      meta: {
        requiresAuth: true,
      }
    },
    {path: '/login', 
      component: Login,
      name: 'Login'
    },
    {path: '/register', 
     component: Register,
     name: 'Register'}
  ];


  const router = new VueRouter({
    routes, 
    mode: 'history'
  })

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = FireBase.firebase.auth().onAuthStateChanged(
          (user) => {
            removeListener();
            resolve(user);
          },
          reject
        )
    })
  }

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (await getCurrentUser()) {
        next();
      } else {
      next("/login");
      }
    } else {
      next();
    }
  })
  
export {router, routes}
