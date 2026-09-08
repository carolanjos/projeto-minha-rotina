import type { ScheduleBlock } from '@/modules/Schedule/components/entities/schedule-block.entity';
import { Mutations } from '../mutations.enum';
import type { ScheduleState } from './state';

export default {
  [Mutations.SET_BLOCKS](state: ScheduleState, blocks: ScheduleBlock[]): void {
    state.blocks = blocks;
  },

  [Mutations.ADD_BLOCK](state: ScheduleState, block: ScheduleBlock): void {
    state.blocks.push(block);
  },

  // `block` já vem atualizado da API (PUT /schedule-blocks/{id}) — substitui
  // o registro local em vez de sobrescrever campo a campo.
  [Mutations.UPDATE_BLOCK](state: ScheduleState, block: ScheduleBlock): void {
    const index = state.blocks.findIndex((b) => b.id === block.id);
    if (index !== -1) state.blocks.splice(index, 1, block);
  },

  [Mutations.REMOVE_BLOCK](state: ScheduleState, id: number): void {
    state.blocks = state.blocks.filter((b) => b.id !== id);
  },

  // orderedIds já vem filtrado a um único período pelo componente (a lista
  // que o vuedraggable reordenou). Recalcula `order` = índice na sequência
  // dada, sobrescrevendo o valor anterior de cada bloco encontrado — mesmos
  // valores já enviados à API em `reorderBlocks` (ver actions.ts).
  [Mutations.REORDER_BLOCKS](state: ScheduleState, payload: { orderedIds: number[] }): void {
    payload.orderedIds.forEach((id, index) => {
      const block = state.blocks.find((b) => b.id === id);
      if (block) block.order = index;
    });
  },
};
