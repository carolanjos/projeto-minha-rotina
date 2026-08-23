import type { ScheduleBlockInterface } from '../interfaces/schedule-block.interface';

export class ScheduleBlock implements ScheduleBlockInterface {
  public id: number = 0;

  public name: string = '';

  public category: string = 'other';

  public startTime: string = '08:00';

  public durationMinutes: number = 30;

  public order: number = 0;

  constructor(data: Partial<ScheduleBlockInterface> = {}) {
    this.id = data.id ?? Date.now();
    this.name = data.name ?? '';
    this.category = data.category ?? 'other';
    this.startTime = data.startTime ?? '08:00';
    this.durationMinutes = data.durationMinutes ?? 30;
    this.order = data.order ?? 0;
  }

  public formatPayload(): ScheduleBlockInterface {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      startTime: this.startTime,
      durationMinutes: this.durationMinutes,
      order: this.order,
    };
  }
}
