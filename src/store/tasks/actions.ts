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
  addTask({ commit, state }: any, payload: AddTaskPayload): void {
    const task = taskService.create(
      payload.text,
      payload.priority ?? 'medium',
      payload.category ?? 'other',
      payload.weekDay ?? null,
      payload.time ?? null,
      payload.date ?? null,
    );
    commit(Mutations.ADD_TASK, task);
    taskService.save((state as TasksState).tasks);
  },

  toggleTask({ commit, state }: any, id: number): void {
    commit(Mutations.TOGGLE_TASK, id);
    taskService.save((state as TasksState).tasks);
  },

  editTask({ commit, state }: any, payload: { id: number; text: string }): void {
    commit(Mutations.EDIT_TASK, payload);
    taskService.save((state as TasksState).tasks);
  },

  removeTask({ commit, state }: any, id: number): void {
    commit(Mutations.REMOVE_TASK, id);
    taskService.save((state as TasksState).tasks);
  },

  clearCompleted({ commit, state }: any): void {
    commit(Mutations.CLEAR_COMPLETED_TASKS);
    taskService.save((state as TasksState).tasks);
  },
};
