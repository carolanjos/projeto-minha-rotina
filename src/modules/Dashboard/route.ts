const DashboardView = () => import('./Dashboard.vue');

export default {
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView,
  meta: { requiresAuth: true },
};
