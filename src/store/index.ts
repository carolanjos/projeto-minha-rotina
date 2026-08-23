import Vue from 'vue';
import Vuex from 'vuex';
import tasks from './tasks';
import habits from './habits';
import theme from './theme';
import schedule from './schedule';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tasks,
    habits,
    theme,
    schedule,
  },
});
