import Vue from 'vue';
import VueRouter from 'vue-router';
import tasksRoute from '../modules/Tasks/route';
import habitsRoute from '../modules/Habits/route';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [tasksRoute, habitsRoute],
});

export default router;
