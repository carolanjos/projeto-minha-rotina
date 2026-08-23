export type SchedulePeriod = 'morning' | 'afternoon' | 'evening';

export interface ScheduleBlockInterface {
  id: number;
  name: string;
  category: string;
  startTime: string; // formato 'HH:mm'
  durationMinutes: number;
  order: number;
}
