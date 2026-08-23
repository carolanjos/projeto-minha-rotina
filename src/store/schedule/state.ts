import scheduleBlockService from '@/modules/Schedule/services/schedule-block.service';
import type { ScheduleBlock } from '@/modules/Schedule/components/entities/schedule-block.entity';

export interface ScheduleState {
  blocks: ScheduleBlock[];
}

export default (): ScheduleState => ({
  blocks: scheduleBlockService.getAll(),
});
