const TasksView = () => import('./Tasks.vue');

export default {
  path: '/',
  name: 'tasks',
  component: TasksView,
  meta: { requiresAuth: true },
};
