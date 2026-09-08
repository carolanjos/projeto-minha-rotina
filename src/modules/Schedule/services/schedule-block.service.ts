import apiClient from '@/shared/http/api-client';
import { ScheduleBlock } from '../components/entities/schedule-block.entity';

// Formato retornado pela API (ver ScheduleBlockResource no backend) —
// snake_case, diferente do ScheduleBlockInterface (camelCase) do frontend.
/* eslint-disable camelcase */
interface ScheduleBlockApiDto {
  id: number;
  name: string;
  category: string;
  start_time: string;
  duration_minutes: number;
  order: number;
}
/* eslint-enable camelcase */

interface ScheduleBlockUpdatePayload {
  name?: string;
  category?: string;
  startTime?: string;
  durationMinutes?: number;
  order?: number;
}

function fromApi(dto: ScheduleBlockApiDto): ScheduleBlock {
  return new ScheduleBlock({
    id: dto.id,
    name: dto.name,
    category: dto.category,
    startTime: dto.start_time,
    durationMinutes: dto.duration_minutes,
    order: dto.order,
  });
}

class ScheduleBlockService {
  public async getAll(): Promise<ScheduleBlock[]> {
    const { data } = await apiClient.get<{ data: ScheduleBlockApiDto[] }>('/schedule-blocks');
    return data.data.map(fromApi);
  }

  public async create(
    name: string,
    category: string,
    startTime: string,
    durationMinutes: number,
    order: number,
  ): Promise<ScheduleBlock> {
    const { data } = await apiClient.post<{ data: ScheduleBlockApiDto }>('/schedule-blocks', {
      name,
      category,
      start_time: startTime,
      duration_minutes: durationMinutes,
      order,
    });
    return fromApi(data.data);
  }

  public async update(id: number, changes: ScheduleBlockUpdatePayload): Promise<ScheduleBlock> {
    const { data } = await apiClient.put<{ data: ScheduleBlockApiDto }>(`/schedule-blocks/${id}`, {
      name: changes.name,
      category: changes.category,
      start_time: changes.startTime,
      duration_minutes: changes.durationMinutes,
      order: changes.order,
    });
    return fromApi(data.data);
  }

  public async remove(id: number): Promise<void> {
    await apiClient.delete(`/schedule-blocks/${id}`);
  }
}

export default new ScheduleBlockService();
