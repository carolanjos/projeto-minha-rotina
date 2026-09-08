jest.mock('@/modules/Tasks/services/task.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
// eslint-disable-next-line import/first
import taskService from '@/modules/Tasks/services/task.service';
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

const mockedCreate = taskService.create as jest.Mock;
const mockedUpdate = taskService.update as jest.Mock;
const mockedRemove = taskService.remove as jest.Mock;

let nextId = 0;

// Cada chamada a addTask consome um valor mockado de `create`, na ordem em
// que os testes disparam as actions — helper só pra não repetir o DTO inteiro
// em cada teste.
function mockNextCreate(overrides: Record<string, unknown> = {}): number {
  nextId += 1;
  const id = nextId;
  mockedCreate.mockResolvedValueOnce({
    id,
    text: 'tarefa',
    completed: false,
    createdAt: new Date(),
    priority: 'medium',
    category: 'other',
    weekDay: null,
    time: null,
    date: null,
    ...overrides,
  });
  return id;
}

describe('store/tasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
    nextId = 0;
  });

  it('orders tasks by priority first (high, medium, low)', async () => {
    const store = createStore();
    mockNextCreate({ text: 'baixa', priority: 'low' });
    mockNextCreate({ text: 'alta', priority: 'high' });
    mockNextCreate({ text: 'media', priority: 'medium' });

    await store.dispatch('tasks/addTask', { text: 'baixa', priority: 'low' });
    await store.dispatch('tasks/addTask', { text: 'alta', priority: 'high' });
    await store.dispatch('tasks/addTask', { text: 'media', priority: 'medium' });

    const order = store.getters['tasks/sortedTasks'].map((t: any) => t.priority);
    expect(order).toEqual(['high', 'medium', 'low']);
  });

  it('at the same priority, a task with a scheduled day comes before one without', async () => {
    const store = createStore();
    mockNextCreate({ text: 'sem agenda', priority: 'medium', weekDay: null });
    mockNextCreate({ text: 'com dia', priority: 'medium', weekDay: new Date().getDay() });

    await store.dispatch('tasks/addTask', { text: 'sem agenda', priority: 'medium' });
    await store.dispatch('tasks/addTask', {
      text: 'com dia', priority: 'medium', weekDay: new Date().getDay(),
    });

    const order = store.getters['tasks/sortedTasks'].map((t: any) => t.text);
    expect(order).toEqual(['com dia', 'sem agenda']);
  });

  it('toggleTask asks the API to flip completed and applies the response', async () => {
    const store = createStore();
    const id = mockNextCreate({ text: 'a', completed: false });
    await store.dispatch('tasks/addTask', { text: 'a' });
    mockedUpdate.mockResolvedValueOnce({
      id, text: 'a', completed: true, createdAt: new Date(), priority: 'medium', category: 'other', weekDay: null, time: null, date: null,
    });

    await store.dispatch('tasks/toggleTask', id);

    expect(mockedUpdate).toHaveBeenCalledWith(id, { completed: true });
    expect(tasksState(store).tasks[0].completed).toBe(true);
  });

  it('clearCompleted removes only completed tasks', async () => {
    const store = createStore();
    const firstId = mockNextCreate({ text: 'a', completed: false });
    mockNextCreate({ text: 'b', completed: false });
    await store.dispatch('tasks/addTask', { text: 'a' });
    await store.dispatch('tasks/addTask', { text: 'b' });
    mockedUpdate.mockResolvedValueOnce({
      id: firstId, text: 'a', completed: true, createdAt: new Date(), priority: 'medium', category: 'other', weekDay: null, time: null, date: null,
    });
    await store.dispatch('tasks/toggleTask', firstId);
    mockedRemove.mockResolvedValue(undefined);

    await store.dispatch('tasks/clearCompleted');

    expect(mockedRemove).toHaveBeenCalledWith(firstId);
    expect(tasksState(store).tasks).toHaveLength(1);
    expect(tasksState(store).tasks[0].text).toBe('b');
  });
});
