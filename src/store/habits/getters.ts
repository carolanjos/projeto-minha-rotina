import type { Habit } from '@/modules/Habits/components/entities/habit.entity';
import type { HabitsState } from './state';

export default {
  todaysHabits: (state: HabitsState): Habit[] => {
    const today = new Date().getDay();
    return state.habits.filter((h) => h.weekDays.includes(today));
  },

  totalCompleted: (state: HabitsState, getters: any): number => getters.todaysHabits
    .filter((h: Habit) => h.completedToday).length,

  // Maior streak entre os hábitos de hoje — alimenta o card "Sequência" do
  // Dashboard. 0 quando não há hábitos hoje (evita Math.max(...[]) = -Infinity).
  bestStreak: (state: HabitsState, getters: any): number => {
    const streaks = getters.todaysHabits.map((h: Habit) => h.streak);
    return streaks.length ? Math.max(...streaks) : 0;
  },
};
