jest.mock('@/modules/Tasks/services/task.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(() => []),
    save: jest.fn(),
    create: jest.fn((text, priority, category, weekDay, time, date) => ({
      id: Math.floor(Math.random() * 1_000_000),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      category,
      weekDay,
      time,
      date,
    })),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
// eslint-disable-next-line import/first
import tasksModule from './index';
// eslint-disable-next-line import/first
import type { TasksState } from './state';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    modules: {
      tasks: tasksModule,
    },
  });
}

function tasksState(store: any): TasksState {
  return store.state.tasks;
}

describe('store/tasks', () => {
  it('orders tasks by priority first (high, medium, low)', () => {
    const store = createStore();

    store.dispatch('tasks/addTask', { text: 'baixa', priority: 'low' });
    store.dispatch('tasks/addTask', { text: 'alta', priority: 'high' });
    store.dispatch('tasks/addTask', { text: 'media', priority: 'medium' });

    const order = store.getters['tasks/sortedTasks'].map((t: any) => t.priority);
    expect(order).toEqual(['high', 'medium', 'low']);
  });

  it('at the same priority, a task with a scheduled day comes before one without', () => {
    const store = createStore();

    store.dispatch('tasks/addTask', { text: 'sem agenda', priority: 'medium' });
    store.dispatch('tasks/addTask', {
      text: 'com dia',
      priority: 'medium',
      weekDay: new Date().getDay(),
    });

    const order = store.getters['tasks/sortedTasks'].map((t: any) => t.text);
    expect(order).toEqual(['com dia', 'sem agenda']);
  });

  it('toggleTask flips the completed flag', () => {
    const store = createStore();
    store.dispatch('tasks/addTask', { text: 'a' });
    const [task] = tasksState(store).tasks;

    store.dispatch('tasks/toggleTask', task.id);

    expect(tasksState(store).tasks[0].completed).toBe(true);
  });

  it('clearCompleted removes only completed tasks', () => {
    const store = createStore();
    store.dispatch('tasks/addTask', { text: 'a' });
    store.dispatch('tasks/addTask', { text: 'b' });
    const [first] = tasksState(store).tasks;
    store.dispatch('tasks/toggleTask', first.id);

    store.dispatch('tasks/clearCompleted');

    expect(tasksState(store).tasks).toHaveLength(1);
    expect(tasksState(store).tasks[0].text).toBe('b');
  });
});
