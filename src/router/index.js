import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import AuthenticatedOnly from '@/components/AuthenticatedOnly';

// Guards
import authenticated from './guards/authenticated';
import anonimous from './guards/anonimous';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/sign_in',
      name: 'Sign In',
      component: SignIn,
      beforeEnter: anonimous,
    },
    {
      path: '/sign_up',
      name: 'Sign Up',
      component: SignUp,
      beforeEnter: anonimous,
    },
    {
      path: '/authenticated_only',
      name: 'Authenticated Only',
      component: AuthenticatedOnly,
      beforeEnter: authenticated,
    },
  ],
});
