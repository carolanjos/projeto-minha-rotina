// Enum global de nomes de mutation — uma entrada por mutation em QUALQUER
// módulo Vuex do projeto (ver src/store/<dominio>/mutations.ts).
export enum Mutations {
  // tasks
  SET_TASKS = 'set-tasks',
  ADD_TASK = 'add-task',
  TOGGLE_TASK = 'toggle-task',
  EDIT_TASK = 'edit-task',
  REMOVE_TASK = 'remove-task',
  CLEAR_COMPLETED_TASKS = 'clear-completed-tasks',

  // habits
  SET_HABITS = 'set-habits',
  ADD_HABIT = 'add-habit',
  TOGGLE_HABIT = 'toggle-habit',
  REMOVE_HABIT = 'remove-habit',

  // theme
  SET_THEME = 'set-theme',
}
