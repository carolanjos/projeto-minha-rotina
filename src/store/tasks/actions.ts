import taskService from '@/modules/Tasks/services/task.service';
import type { TaskPriority } from '@/modules/Tasks/components/interfaces/task.interface';
import { Mutations } from '../mutations.enum';
import type { TasksState } from './state';

interface AddTaskPayload {
  text: string;
  priority?: TaskPriority;
  category?: string;
  weekDay?: number | null;
  time?: string | null;
  date?: string | null;
}

export default {
  async fetchTasks({ commit }: any): Promise<void> {
    const tasks = await taskService.getAll();
    commit(Mutations.SET_TASKS, tasks);
  },

  async addTask({ commit }: any, payload: AddTaskPayload): Promise<void> {
    const task = await taskService.create(
      payload.text,
      payload.priority ?? 'medium',
      payload.category ?? 'other',
      payload.weekDay ?? null,
      payload.time ?? null,
      payload.date ?? null,
    );
    commit(Mutations.ADD_TASK, task);
  },

  async toggleTask({ commit, state }: any, id: number): Promise<void> {
    const current = (state as TasksState).tasks.find((t) => t.id === id);
    const task = await taskService.update(id, { completed: !current?.completed });
    commit(Mutations.TOGGLE_TASK, task);
  },

  async editTask({ commit }: any, payload: { id: number; text: string }): Promise<void> {
    const task = await taskService.update(payload.id, { text: payload.text });
    commit(Mutations.EDIT_TASK, task);
  },

  async removeTask({ commit }: any, id: number): Promise<void> {
    await taskService.remove(id);
    commit(Mutations.REMOVE_TASK, id);
  },

  async clearCompleted({ commit, state }: any): Promise<void> {
    const completedIds = (state as TasksState).tasks.filter((t) => t.completed).map((t) => t.id);
    await Promise.all(completedIds.map((id) => taskService.remove(id)));
    commit(Mutations.CLEAR_COMPLETED_TASKS);
  },
};
