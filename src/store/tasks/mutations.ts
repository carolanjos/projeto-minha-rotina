import type { Task } from '@/modules/Tasks/components/entities/task.entity';
import { Mutations } from '../mutations.enum';
import type { TasksState } from './state';

export default {
  [Mutations.SET_TASKS](state: TasksState, tasks: Task[]): void {
    state.tasks = tasks;
  },

  [Mutations.ADD_TASK](state: TasksState, task: Task): void {
    state.tasks.push(task);
  },

  [Mutations.TOGGLE_TASK](state: TasksState, id: number): void {
    const task = state.tasks.find((t) => t.id === id);
    if (task) task.completed = !task.completed;
  },

  [Mutations.EDIT_TASK](state: TasksState, payload: { id: number; text: string }): void {
    const task = state.tasks.find((t) => t.id === payload.id);
    if (task) task.text = payload.text;
  },

  [Mutations.REMOVE_TASK](state: TasksState, id: number): void {
    state.tasks = state.tasks.filter((t) => t.id !== id);
  },

  [Mutations.CLEAR_COMPLETED_TASKS](state: TasksState): void {
    state.tasks = state.tasks.filter((t) => !t.completed);
  },
};
