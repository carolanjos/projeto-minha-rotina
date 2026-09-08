const LoginView = () => import('./Login.vue');
const RegisterView = () => import('./Register.vue');

export const loginRoute = {
  path: '/login',
  name: 'login',
  component: LoginView,
  meta: { guest: true },
};

export const registerRoute = {
  path: '/registrar',
  name: 'register',
  component: RegisterView,
  meta: { guest: true },
};
