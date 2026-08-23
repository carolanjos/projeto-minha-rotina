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
  addBlock({ commit, state }: any, payload: AddBlockPayload): void {
    const period = periodFromTime(payload.startTime);
    const order = (state as ScheduleState).blocks
      .filter((b) => periodFromTime(b.startTime) === period).length;

    const block = scheduleBlockService.create(
      payload.name,
      payload.category,
      payload.startTime,
      payload.durationMinutes,
      order,
    );
    commit(Mutations.ADD_BLOCK, block);
    scheduleBlockService.save((state as ScheduleState).blocks);
  },

  updateBlock({ commit, state }: any, payload: UpdateBlockPayload): void {
    commit(Mutations.UPDATE_BLOCK, payload);
    scheduleBlockService.save((state as ScheduleState).blocks);
  },

  removeBlock({ commit, state }: any, id: number): void {
    commit(Mutations.REMOVE_BLOCK, id);
    scheduleBlockService.save((state as ScheduleState).blocks);
  },

  reorderBlocks({ commit, state }: any, orderedIds: number[]): void {
    commit(Mutations.REORDER_BLOCKS, { orderedIds });
    scheduleBlockService.save((state as ScheduleState).blocks);
  },
};
