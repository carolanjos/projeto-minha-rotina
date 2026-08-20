import type { Habit } from '@/modules/Habits/components/entities/habit.entity';
import { Mutations } from '../mutations.enum';
import type { HabitsState } from './state';

export default {
  [Mutations.SET_HABITS](state: HabitsState, habits: Habit[]): void {
    state.habits = habits;
  },

  [Mutations.ADD_HABIT](state: HabitsState, habit: Habit): void {
    state.habits.push(habit);
  },

  // Regra de streak preservada byte-a-byte a partir de
  // src/modules/Habits/Habits/store/habits.store.ts (antigo store Pinia):
  // incrementa se a última conclusão foi ontem, senão reseta pra 1;
  // decrementa (sem passar de 0) ao desmarcar.
  [Mutations.TOGGLE_HABIT](state: HabitsState, id: number): void {
    const habit = state.habits.find((h) => h.id === id);
    if (!habit) return;

    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      habit.streak = habit.lastCompletion === yesterday ? habit.streak + 1 : 1;
      habit.lastCompletion = today;
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }
  },

  [Mutations.REMOVE_HABIT](state: HabitsState, id: number): void {
    state.habits = state.habits.filter((h) => h.id !== id);
  },
};
