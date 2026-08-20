import habitService from '@/modules/Habits/services/habit.service';
import { Mutations } from '../mutations.enum';
import type { HabitsState } from './state';

interface AddHabitPayload {
  name: string;
  emoji: string;
  weekDays: number[];
}

export default {
  addHabit({ commit, state }: any, payload: AddHabitPayload): void {
    const habit = habitService.create(payload.name, payload.emoji, payload.weekDays);
    commit(Mutations.ADD_HABIT, habit);
    habitService.save((state as HabitsState).habits);
  },

  toggleHabit({ commit, state }: any, id: number): void {
    commit(Mutations.TOGGLE_HABIT, id);
    habitService.save((state as HabitsState).habits);
  },

  removeHabit({ commit, state }: any, id: number): void {
    commit(Mutations.REMOVE_HABIT, id);
    habitService.save((state as HabitsState).habits);
  },
};
