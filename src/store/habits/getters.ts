import type { Habit } from '@/modules/Habits/components/entities/habit.entity';
import type { HabitsState } from './state';

export default {
  todaysHabits: (state: HabitsState): Habit[] => {
    const today = new Date().getDay();
    return state.habits.filter((h) => h.weekDays.includes(today));
  },

  totalCompleted: (state: HabitsState, getters: any): number => getters.todaysHabits
    .filter((h: Habit) => h.completedToday).length,
};
