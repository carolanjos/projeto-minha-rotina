jest.mock('@/modules/Schedule/services/schedule-block.service', () => ({
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
import scheduleBlockService from '@/modules/Schedule/services/schedule-block.service';
// eslint-disable-next-line import/first
import scheduleModule from './index';
// eslint-disable-next-line import/first
import type { ScheduleState } from './state';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    modules: {
      schedule: scheduleModule,
    },
  });
}

function scheduleState(store: any): ScheduleState {
  return store.state.schedule;
}

const mockedCreate = scheduleBlockService.create as jest.Mock;
const mockedUpdate = scheduleBlockService.update as jest.Mock;
const mockedRemove = scheduleBlockService.remove as jest.Mock;

let nextId = 0;

function mockNextCreate(overrides: Record<string, unknown> = {}): number {
  nextId += 1;
  const id = nextId;
  mockedCreate.mockResolvedValueOnce({
    id,
    name: 'bloco',
    category: 'other',
    startTime: '07:00',
    durationMinutes: 15,
    order: 0,
    ...overrides,
  });
  return id;
}

describe('store/schedule', () => {
  afterEach(() => {
    jest.clearAllMocks();
    nextId = 0;
  });

  it('addBlock creates a block and assigns the next order within its period', async () => {
    const store = createStore();
    mockNextCreate({
      name: 'Café', category: 'health', startTime: '07:00', durationMinutes: 15, order: 0,
    });
    mockNextCreate({
      name: 'Reunião', category: 'work', startTime: '09:00', durationMinutes: 30, order: 1,
    });

    await store.dispatch('schedule/addBlock', {
      name: 'Café', category: 'health', startTime: '07:00', durationMinutes: 15,
    });
    await store.dispatch('schedule/addBlock', {
      name: 'Reunião', category: 'work', startTime: '09:00', durationMinutes: 30,
    });

    expect(mockedCreate).toHaveBeenNthCalledWith(1, 'Café', 'health', '07:00', 15, 0);
    expect(mockedCreate).toHaveBeenNthCalledWith(2, 'Reunião', 'work', '09:00', 30, 1);
    const { blocks } = scheduleState(store);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].order).toBe(0);
    expect(blocks[1].order).toBe(1);
  });

  it('reorderBlocks sends the new order to the API and applies it locally', async () => {
    const store = createStore();
    const firstId = mockNextCreate({ name: 'A', startTime: '07:00', order: 0 });
    const secondId = mockNextCreate({ name: 'B', startTime: '08:00', order: 1 });
    await store.dispatch('schedule/addBlock', {
      name: 'A', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    await store.dispatch('schedule/addBlock', {
      name: 'B', category: 'other', startTime: '08:00', durationMinutes: 15,
    });
    mockedUpdate.mockResolvedValue({});

    await store.dispatch('schedule/reorderBlocks', [secondId, firstId]);

    expect(mockedUpdate).toHaveBeenCalledWith(secondId, { order: 0 });
    expect(mockedUpdate).toHaveBeenCalledWith(firstId, { order: 1 });
    const byId = (id: number) => scheduleState(store).blocks.find((b: any) => b.id === id);
    expect(byId(secondId)?.order).toBe(0);
    expect(byId(firstId)?.order).toBe(1);
  });

  it('updateBlock sends the changes to the API and replaces the block with the response', async () => {
    const store = createStore();
    const id = mockNextCreate({
      name: 'Original', category: 'other', startTime: '07:00', durationMinutes: 15, order: 0,
    });
    await store.dispatch('schedule/addBlock', {
      name: 'Original', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    mockedUpdate.mockResolvedValueOnce({
      id, name: 'Atualizado', category: 'work', startTime: '08:30', durationMinutes: 45, order: 0,
    });

    await store.dispatch('schedule/updateBlock', {
      id, name: 'Atualizado', category: 'work', startTime: '08:30', durationMinutes: 45,
    });

    const updated = scheduleState(store).blocks[0];
    expect(updated.name).toBe('Atualizado');
    expect(updated.category).toBe('work');
    expect(updated.startTime).toBe('08:30');
    expect(updated.durationMinutes).toBe(45);
  });

  it('removeBlock removes only the targeted block', async () => {
    const store = createStore();
    const firstId = mockNextCreate({ name: 'A' });
    mockNextCreate({ name: 'B' });
    await store.dispatch('schedule/addBlock', {
      name: 'A', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    await store.dispatch('schedule/addBlock', {
      name: 'B', category: 'other', startTime: '08:00', durationMinutes: 15,
    });
    mockedRemove.mockResolvedValueOnce(undefined);

    await store.dispatch('schedule/removeBlock', firstId);

    expect(mockedRemove).toHaveBeenCalledWith(firstId);
    expect(scheduleState(store).blocks).toHaveLength(1);
    expect(scheduleState(store).blocks[0].name).toBe('B');
  });
});
