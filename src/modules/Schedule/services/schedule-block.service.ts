import { ScheduleBlock } from '../components/entities/schedule-block.entity';
import type { ScheduleBlockInterface } from '../components/interfaces/schedule-block.interface';

const STORAGE_KEY = 'schedule-blocks';

class ScheduleBlockService {
  public getAll(): ScheduleBlock[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed: ScheduleBlockInterface[] = JSON.parse(data);
    return parsed.map((d) => new ScheduleBlock(d));
  }

  public save(blocks: ScheduleBlock[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks.map((b) => b.formatPayload())));
  }

  public create(
    name: string,
    category: string,
    startTime: string,
    durationMinutes: number,
    order: number,
  ): ScheduleBlock {
    return new ScheduleBlock({
      name, category, startTime, durationMinutes, order,
    });
  }
}

export default new ScheduleBlockService();
