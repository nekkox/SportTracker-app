import { createRouter, createWebHistory } from "vue-router";
import { useSupabaseClient } from '@/composables/supabase'

const loginRoute = { name: 'Login' };
const loggedInRoute = { name: 'Home' };

const loginGuard = async (to, from, next) => {
    const { data } = await useSupabaseClient.auth.getSession();
    if (data.session) {
      console.log('Logged');
        next();
    } else {
      console.log('NOT Logged');
        next(loginRoute);
    }
}

const loggedInGuard = async (to, from, next) => {
    const { data } = await useSupabaseClient.auth.getSession();
    if (data.session) {
      console.log('Logged');
        next(loggedInRoute);
    } else {
      console.log('NOT Logged');
        next();
    }
}

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        beforeEnter: loginGuard
      },
      {
        path: "/login",
        name: "Login",
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
        beforeEnter: loggedInGuard
      },
      {
        path: "/track",
        name: "Track",
        component: () => import(/* webpackChunkName: "home" */ '@/views/Track.vue'),
        beforeEnter: loginGuard
      },
    ],
  },
];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
