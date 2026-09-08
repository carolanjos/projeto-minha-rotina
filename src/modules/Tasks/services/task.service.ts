import apiClient from '@/shared/http/api-client';
import { Task } from '../components/entities/task.entity';
import type { TaskPriority } from '../components/interfaces/task.interface';

// Formato retornado pela API (ver TaskResource no backend) — snake_case,
// diferente do TaskInterface (camelCase) usado no resto do frontend.
/* eslint-disable camelcase */
interface TaskApiDto {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  priority: TaskPriority;
  category: string;
  week_day: number | null;
  time: string | null;
  date: string | null;
}
/* eslint-enable camelcase */

interface TaskUpdatePayload {
  text?: string;
  completed?: boolean;
  priority?: TaskPriority;
  category?: string;
  weekDay?: number | null;
  time?: string | null;
  date?: string | null;
}

function fromApi(dto: TaskApiDto): Task {
  return new Task({
    id: dto.id,
    text: dto.text,
    completed: dto.completed,
    createdAt: new Date(dto.created_at),
    priority: dto.priority,
    category: dto.category,
    weekDay: dto.week_day,
    time: dto.time,
    date: dto.date,
  });
}

class TaskService {
  public async getAll(): Promise<Task[]> {
    const { data } = await apiClient.get<{ data: TaskApiDto[] }>('/tasks');
    return data.data.map(fromApi);
  }

  public async create(
    text: string,
    priority: TaskPriority,
    category: string,
    weekDay: number | null,
    time: string | null,
    date: string | null,
  ): Promise<Task> {
    const { data } = await apiClient.post<{ data: TaskApiDto }>('/tasks', {
      text,
      priority,
      category,
      week_day: weekDay,
      time,
      date,
    });
    return fromApi(data.data);
  }

  public async update(id: number, changes: TaskUpdatePayload): Promise<Task> {
    const { data } = await apiClient.put<{ data: TaskApiDto }>(`/tasks/${id}`, {
      text: changes.text,
      completed: changes.completed,
      priority: changes.priority,
      category: changes.category,
      week_day: changes.weekDay,
      time: changes.time,
      date: changes.date,
    });
    return fromApi(data.data);
  }

  public async remove(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }
}

export default new TaskService();
