jest.mock('@/modules/Schedule/services/schedule-block.service', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(() => []),
    save: jest.fn(),
    create: jest.fn((name, category, startTime, durationMinutes, order) => ({
      id: Math.floor(Math.random() * 1_000_000),
      name,
      category,
      startTime,
      durationMinutes,
      order,
    })),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
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

describe('store/schedule', () => {
  it('addBlock creates a block and assigns the next order within its period', () => {
    const store = createStore();

    store.dispatch('schedule/addBlock', {
      name: 'Café', category: 'health', startTime: '07:00', durationMinutes: 15,
    });
    store.dispatch('schedule/addBlock', {
      name: 'Reunião', category: 'work', startTime: '09:00', durationMinutes: 30,
    });

    const { blocks } = scheduleState(store);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].order).toBe(0);
    expect(blocks[1].order).toBe(1);
  });

  it('reorderBlocks updates the order field to match the given id sequence', () => {
    const store = createStore();
    store.dispatch('schedule/addBlock', {
      name: 'A', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    store.dispatch('schedule/addBlock', {
      name: 'B', category: 'other', startTime: '08:00', durationMinutes: 15,
    });
    const [first, second] = scheduleState(store).blocks;

    store.dispatch('schedule/reorderBlocks', [second.id, first.id]);

    const byId = (id: number) => scheduleState(store).blocks.find((b: any) => b.id === id);
    expect(byId(second.id)?.order).toBe(0);
    expect(byId(first.id)?.order).toBe(1);
  });

  it('updateBlock overwrites the fields of an existing block', () => {
    const store = createStore();
    store.dispatch('schedule/addBlock', {
      name: 'Original', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    const [block] = scheduleState(store).blocks;

    store.dispatch('schedule/updateBlock', {
      id: block.id, name: 'Atualizado', category: 'work', startTime: '08:30', durationMinutes: 45,
    });

    const updated = scheduleState(store).blocks[0];
    expect(updated.name).toBe('Atualizado');
    expect(updated.category).toBe('work');
    expect(updated.startTime).toBe('08:30');
    expect(updated.durationMinutes).toBe(45);
  });

  it('removeBlock removes only the targeted block', () => {
    const store = createStore();
    store.dispatch('schedule/addBlock', {
      name: 'A', category: 'other', startTime: '07:00', durationMinutes: 15,
    });
    store.dispatch('schedule/addBlock', {
      name: 'B', category: 'other', startTime: '08:00', durationMinutes: 15,
    });
    const [first] = scheduleState(store).blocks;

    store.dispatch('schedule/removeBlock', first.id);

    expect(scheduleState(store).blocks).toHaveLength(1);
    expect(scheduleState(store).blocks[0].name).toBe('B');
  });
});
