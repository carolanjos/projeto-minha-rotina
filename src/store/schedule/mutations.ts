import type { ScheduleBlock } from '@/modules/Schedule/components/entities/schedule-block.entity';
import { Mutations } from '../mutations.enum';
import type { ScheduleState } from './state';

interface UpdateBlockPayload {
  id: number;
  name: string;
  category: string;
  startTime: string;
  durationMinutes: number;
}

export default {
  [Mutations.SET_BLOCKS](state: ScheduleState, blocks: ScheduleBlock[]): void {
    state.blocks = blocks;
  },

  [Mutations.ADD_BLOCK](state: ScheduleState, block: ScheduleBlock): void {
    state.blocks.push(block);
  },

  [Mutations.UPDATE_BLOCK](state: ScheduleState, payload: UpdateBlockPayload): void {
    const block = state.blocks.find((b) => b.id === payload.id);
    if (!block) return;
    block.name = payload.name;
    block.category = payload.category;
    block.startTime = payload.startTime;
    block.durationMinutes = payload.durationMinutes;
  },

  [Mutations.REMOVE_BLOCK](state: ScheduleState, id: number): void {
    state.blocks = state.blocks.filter((b) => b.id !== id);
  },

  // orderedIds já vem filtrado a um único período pelo componente (a lista
  // que o vuedraggable reordenou). Recalcula `order` = índice na sequência
  // dada, sobrescrevendo o valor anterior de cada bloco encontrado.
  [Mutations.REORDER_BLOCKS](state: ScheduleState, payload: { orderedIds: number[] }): void {
    payload.orderedIds.forEach((id, index) => {
      const block = state.blocks.find((b) => b.id === id);
      if (block) block.order = index;
    });
  },
};
