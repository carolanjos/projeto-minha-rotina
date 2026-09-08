import type { ScheduleBlock } from '@/modules/Schedule/components/entities/schedule-block.entity';

export interface ScheduleState {
  blocks: ScheduleBlock[];
}

// Populado via a action `fetchBlocks` (ver actions.ts), disparada no
// created() da tela que precisa dos dados — não mais síncrono/localStorage.
export default (): ScheduleState => ({
  blocks: [],
});
