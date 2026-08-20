import habitService from '@/modules/Habits/services/habit.service';
import type { Habit } from '@/modules/Habits/components/entities/habit.entity';

export interface HabitsState {
  habits: Habit[];
}

export default (): HabitsState => ({
  habits: habitService.getAll(),
});
