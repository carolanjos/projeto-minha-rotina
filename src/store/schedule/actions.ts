import scheduleBlockService from '@/modules/Schedule/services/schedule-block.service';
import { Mutations } from '../mutations.enum';
import { periodFromTime } from './getters';
import type { ScheduleState } from './state';

interface AddBlockPayload {
  name: string;
  category: string;
  startTime: string;
  durationMinutes: number;
}

interface UpdateBlockPayload extends AddBlockPayload {
  id: number;
}

export default {
  async fetchBlocks({ commit }: any): Promise<void> {
    const blocks = await scheduleBlockService.getAll();
    commit(Mutations.SET_BLOCKS, blocks);
  },

  async addBlock({ commit, state }: any, payload: AddBlockPayload): Promise<void> {
    const period = periodFromTime(payload.startTime);
    const order = (state as ScheduleState).blocks
      .filter((b) => periodFromTime(b.startTime) === period).length;

    const block = await scheduleBlockService.create(
      payload.name,
      payload.category,
      payload.startTime,
      payload.durationMinutes,
      order,
    );
    commit(Mutations.ADD_BLOCK, block);
  },

  async updateBlock({ commit }: any, payload: UpdateBlockPayload): Promise<void> {
    const block = await scheduleBlockService.update(payload.id, {
      name: payload.name,
      category: payload.category,
      startTime: payload.startTime,
      durationMinutes: payload.durationMinutes,
    });
    commit(Mutations.UPDATE_BLOCK, block);
  },

  async removeBlock({ commit }: any, id: number): Promise<void> {
    await scheduleBlockService.remove(id);
    commit(Mutations.REMOVE_BLOCK, id);
  },

  async reorderBlocks({ commit }: any, orderedIds: number[]): Promise<void> {
    await Promise.all(orderedIds.map((id, index) => scheduleBlockService.update(id, {
      order: index,
    })));
    commit(Mutations.REORDER_BLOCKS, { orderedIds });
  },
};
