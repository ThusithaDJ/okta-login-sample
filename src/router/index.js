import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '@okta/okta-vue'
// import OktaConfig from '../util/OktaConfig'
import Private from '@/components/HelloWorld'


const OKTA_DOMAIN = process.env.DOMAIN || 'dev-9970099.okta.com';
const CLIENT_ID = process.env.CLIENT_ID || '0oa1twxkzc2nfuosb5d6';
const CALLBACK_PATH = '/login/callback';

const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const HOST = window.location.host;
const REDIRECT_URI = `http://${HOST}${CALLBACK_PATH}`;
const SCOPES = 'openid profile email';

const config = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  scope: SCOPES.split(/\s+/)
};

Vue.use(Auth, {...config})

const routes = [
  {
    path: CALLBACK_PATH,
    component: Auth.handleCallback()
  },
  {
    path: '/private',
    component: Private,
    meta:{requiresAuth: true}
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta:{requiresAuth: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())
Vue.use(VueRouter)

export default router
