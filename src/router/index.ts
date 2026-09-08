import Vue from 'vue';
import VueRouter from 'vue-router';
import tasksRoute from '../modules/Tasks/route';
import habitsRoute from '../modules/Habits/route';
import dashboardRoute from '../modules/Dashboard/route';
import scheduleRoute from '../modules/Schedule/route';
import { loginRoute, registerRoute } from '../modules/Auth/route';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    tasksRoute, habitsRoute, dashboardRoute, scheduleRoute, loginRoute, registerRoute,
  ],
});

// Rotas de domínio exigem sessão (ver auth/route.ts pro contrário: `guest`,
// só acessível SEM sessão). Token vem do Vuex (store/auth), hidratado do
// localStorage no boot — ver main.ts.
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some((record) => record.meta?.requiresAuth) && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.matched.some((record) => record.meta?.guest) && isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
});

export default router;
