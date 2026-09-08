import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './assets/main.css';

Vue.config.productionTip = false;

// Se sobrou um token de uma sessão anterior (localStorage, hidratado em
// store/auth/state.ts), valida ele buscando o usuário antes de montar — evita
// telas piscando "deslogado" por uma fração de segundo a cada refresh.
// Token inválido/expirado: desloga e segue pro login normalmente.
async function bootstrap(): Promise<void> {
  if (store.getters['auth/isAuthenticated']) {
    try {
      await store.dispatch('auth/fetchCurrentUser');
    } catch {
      await store.dispatch('auth/logout');
    }
  }

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
}

bootstrap();
