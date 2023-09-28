import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Auth from '../views/auth/Auth.vue'
import AuthHome from '../views/auth/auth_children/AuthHome.vue' 
import SignIn from '../views/auth/auth_children/SignIn.vue' 
import SignUp from '../views/auth/auth_children/SignUp.vue' 
import SignUpForm from '../views/auth/auth_children/SignUpForm.vue' 
import Welcome from '../views/Welcome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // here, display splash screen while it is determined if person is authenticated, and if so, loading the application, and if not,
      // pausing for a second and then  redirecting to the sign in page.
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        // {
        //   path: 'welcome'
        //   components: {
        //     default: Welcome,
        //     // picture: 
        //   }
        // },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: '',
          name:'auth',
          components: {
            default: AuthHome,
          },
        },
        {
          path: 'signin',
          components: {
            default: SignIn,
          }
        },
        {
          path: 'signupform',
          components: {
            default: SignUpForm,
          },
        },
        {
          path: 'signup',
          components: {
            default: SignUp,
          }
        },
      ],
    },
  ],
})

export default router
