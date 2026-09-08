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

  // `habit` já vem com completedToday/streak/lastCompletion calculados pelo
  // backend (PATCH /habits/{id}/toggle) — aqui só substitui o registro local.
  [Mutations.TOGGLE_HABIT](state: HabitsState, habit: Habit): void {
    const index = state.habits.findIndex((h) => h.id === habit.id);
    if (index !== -1) state.habits.splice(index, 1, habit);
  },

  [Mutations.REMOVE_HABIT](state: HabitsState, id: number): void {
    state.habits = state.habits.filter((h) => h.id !== id);
  },
};
