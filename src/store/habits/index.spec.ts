jest.mock('@/modules/Habits/services/habit.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(() => []),
    save: jest.fn(),
    create: jest.fn((name, emoji, weekDays) => ({
      id: Math.floor(Math.random() * 1_000_000),
      name,
      emoji,
      weekDays,
      completedToday: false,
      streak: 0,
      lastCompletion: null,
    })),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
// eslint-disable-next-line import/first
import habitsModule from './index';
// eslint-disable-next-line import/first
import type { HabitsState } from './state';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    modules: {
      habits: habitsModule,
    },
  });
}

function habitsState(store: any): HabitsState {
  return store.state.habits;
}

describe('store/habits', () => {
  it('starts a streak at 1 on the first completion', () => {
    const store = createStore();
    store.dispatch('habits/addHabit', { name: 'Beber água', emoji: '💧', weekDays: [0, 1, 2, 3, 4, 5, 6] });
    const [habit] = habitsState(store).habits;

    store.dispatch('habits/toggleHabit', habit.id);

    expect(habitsState(store).habits[0].completedToday).toBe(true);
    expect(habitsState(store).habits[0].streak).toBe(1);
  });

  it('increments the streak when the last completion was yesterday', () => {
    const store = createStore();
    store.dispatch('habits/addHabit', { name: 'Ler', emoji: '📖', weekDays: [0, 1, 2, 3, 4, 5, 6] });
    const [habit] = habitsState(store).habits;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    habit.streak = 3;
    habit.lastCompletion = yesterday;

    store.dispatch('habits/toggleHabit', habit.id);

    expect(habitsState(store).habits[0].streak).toBe(4);
  });

  it('resets the streak to 1 when the last completion was not yesterday', () => {
    const store = createStore();
    store.dispatch('habits/addHabit', { name: 'Correr', emoji: '🏃', weekDays: [0, 1, 2, 3, 4, 5, 6] });
    const [habit] = habitsState(store).habits;
    habit.streak = 5;
    habit.lastCompletion = new Date(2000, 0, 1).toDateString();

    store.dispatch('habits/toggleHabit', habit.id);

    expect(habitsState(store).habits[0].streak).toBe(1);
  });

  it('decrements the streak (without going below 0) when unmarking', () => {
    const store = createStore();
    store.dispatch('habits/addHabit', { name: 'Meditar', emoji: '🧘', weekDays: [0, 1, 2, 3, 4, 5, 6] });
    const [habit] = habitsState(store).habits;
    habit.completedToday = true;
    habit.streak = 1;

    store.dispatch('habits/toggleHabit', habit.id);

    expect(habitsState(store).habits[0].completedToday).toBe(false);
    expect(habitsState(store).habits[0].streak).toBe(0);
  });
});
