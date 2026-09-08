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

  // `task` já vem atualizada da API (PUT /tasks/{id}) — substitui o registro
  // local em vez de recalcular o campo aqui.
  [Mutations.TOGGLE_TASK](state: TasksState, task: Task): void {
    const index = state.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) state.tasks.splice(index, 1, task);
  },

  [Mutations.EDIT_TASK](state: TasksState, task: Task): void {
    const index = state.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) state.tasks.splice(index, 1, task);
  },

  [Mutations.REMOVE_TASK](state: TasksState, id: number): void {
    state.tasks = state.tasks.filter((t) => t.id !== id);
  },

  [Mutations.CLEAR_COMPLETED_TASKS](state: TasksState): void {
    state.tasks = state.tasks.filter((t) => !t.completed);
  },
};
