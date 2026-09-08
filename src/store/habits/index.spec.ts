jest.mock('@/modules/Habits/services/habit.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    create: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
// eslint-disable-next-line import/first
import habitService from '@/modules/Habits/services/habit.service';
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

const mockedGetAll = habitService.getAll as jest.Mock;
const mockedCreate = habitService.create as jest.Mock;
const mockedToggle = habitService.toggle as jest.Mock;
const mockedRemove = habitService.remove as jest.Mock;

describe('store/habits', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchHabits populates state with what the API returns', async () => {
    mockedGetAll.mockResolvedValue([
      {
        id: 1, name: 'Ler', emoji: '📖', weekDays: [1], completedToday: false, streak: 0, lastCompletion: null,
      },
    ]);
    const store = createStore();

    await store.dispatch('habits/fetchHabits');

    expect(habitsState(store).habits).toHaveLength(1);
  });

  it('addHabit sends the payload to the API and appends the created habit', async () => {
    mockedCreate.mockResolvedValue({
      id: 1, name: 'Beber água', emoji: '💧', weekDays: [0], completedToday: false, streak: 0, lastCompletion: null,
    });
    const store = createStore();

    await store.dispatch('habits/addHabit', { name: 'Beber água', emoji: '💧', weekDays: [0] });

    expect(mockedCreate).toHaveBeenCalledWith('Beber água', '💧', [0]);
    expect(habitsState(store).habits).toHaveLength(1);
  });

  it('toggleHabit replaces the habit with whatever the API (streak calculated server-side) returns', async () => {
    mockedCreate.mockResolvedValue({
      id: 1, name: 'Ler', emoji: '📖', weekDays: [0], completedToday: false, streak: 0, lastCompletion: null,
    });
    mockedToggle.mockResolvedValue({
      id: 1, name: 'Ler', emoji: '📖', weekDays: [0], completedToday: true, streak: 4, lastCompletion: '2024-01-01',
    });
    const store = createStore();
    await store.dispatch('habits/addHabit', { name: 'Ler', emoji: '📖', weekDays: [0] });

    await store.dispatch('habits/toggleHabit', 1);

    expect(mockedToggle).toHaveBeenCalledWith(1);
    expect(habitsState(store).habits[0].completedToday).toBe(true);
    expect(habitsState(store).habits[0].streak).toBe(4);
  });

  it('removeHabit deletes via the API and removes it from state', async () => {
    mockedCreate.mockResolvedValue({
      id: 1, name: 'Ler', emoji: '📖', weekDays: [0], completedToday: false, streak: 0, lastCompletion: null,
    });
    mockedRemove.mockResolvedValue(undefined);
    const store = createStore();
    await store.dispatch('habits/addHabit', { name: 'Ler', emoji: '📖', weekDays: [0] });

    await store.dispatch('habits/removeHabit', 1);

    expect(mockedRemove).toHaveBeenCalledWith(1);
    expect(habitsState(store).habits).toHaveLength(0);
  });

  it('bestStreak returns the highest streak among today\'s habits, or 0 if there are none', async () => {
    const store = createStore();
    expect(store.getters['habits/bestStreak']).toBe(0);

    const today = new Date().getDay();
    mockedCreate
      .mockResolvedValueOnce({
        id: 1, name: 'Ler', emoji: '📖', weekDays: [today], completedToday: false, streak: 3, lastCompletion: null,
      })
      .mockResolvedValueOnce({
        id: 2, name: 'Correr', emoji: '🏃', weekDays: [today], completedToday: false, streak: 7, lastCompletion: null,
      });

    await store.dispatch('habits/addHabit', { name: 'Ler', emoji: '📖', weekDays: [today] });
    await store.dispatch('habits/addHabit', { name: 'Correr', emoji: '🏃', weekDays: [today] });

    expect(store.getters['habits/bestStreak']).toBe(7);
  });
});
