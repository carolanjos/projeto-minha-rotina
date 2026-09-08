import apiClient from '@/shared/http/api-client';
import { Habit } from '../components/entities/habit.entity';

// Formato retornado pela API (ver HabitResource no backend) — snake_case,
// diferente do HabitInterface (camelCase) usado no resto do frontend.
/* eslint-disable camelcase */
interface HabitApiDto {
  id: number;
  name: string;
  emoji: string;
  week_days: number[];
  completed_today: boolean;
  streak: number;
  last_completion: string | null;
}
/* eslint-enable camelcase */

function fromApi(dto: HabitApiDto): Habit {
  return new Habit({
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji,
    weekDays: dto.week_days,
    completedToday: dto.completed_today,
    streak: dto.streak,
    lastCompletion: dto.last_completion,
  });
}

class HabitService {
  public async getAll(): Promise<Habit[]> {
    const { data } = await apiClient.get<{ data: HabitApiDto[] }>('/habits');
    return data.data.map(fromApi);
  }

  public async create(name: string, emoji: string, weekDays: number[]): Promise<Habit> {
    const { data } = await apiClient.post<{ data: HabitApiDto }>('/habits', {
      name,
      emoji,
      week_days: weekDays,
    });
    return fromApi(data.data);
  }

  // Alterna a conclusão de hoje — a regra de streak é calculada no backend
  // (app/Services/Habit/HabitService.php), aqui só aplicamos o resultado.
  public async toggle(id: number): Promise<Habit> {
    const { data } = await apiClient.patch<{ data: HabitApiDto }>(`/habits/${id}/toggle`);
    return fromApi(data.data);
  }

  public async remove(id: number): Promise<void> {
    await apiClient.delete(`/habits/${id}`);
  }
}

export default new HabitService();
