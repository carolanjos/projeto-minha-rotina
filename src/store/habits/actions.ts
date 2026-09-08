import habitService from '@/modules/Habits/services/habit.service';
import { Mutations } from '../mutations.enum';

interface AddHabitPayload {
  name: string;
  emoji: string;
  weekDays: number[];
}

export default {
  async fetchHabits({ commit }: any): Promise<void> {
    const habits = await habitService.getAll();
    commit(Mutations.SET_HABITS, habits);
  },

  async addHabit({ commit }: any, payload: AddHabitPayload): Promise<void> {
    const habit = await habitService.create(payload.name, payload.emoji, payload.weekDays);
    commit(Mutations.ADD_HABIT, habit);
  },

  async toggleHabit({ commit }: any, id: number): Promise<void> {
    const habit = await habitService.toggle(id);
    commit(Mutations.TOGGLE_HABIT, habit);
  },

  async removeHabit({ commit }: any, id: number): Promise<void> {
    await habitService.remove(id);
    commit(Mutations.REMOVE_HABIT, id);
  },
};
