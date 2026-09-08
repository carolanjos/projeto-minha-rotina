import type { Task } from '@/modules/Tasks/components/entities/task.entity';

export interface TasksState {
  tasks: Task[];
}

// Populado via a action `fetchTasks` (ver actions.ts), disparada no
// created() da tela que precisa dos dados — não mais síncrono/localStorage.
export default (): TasksState => ({
  tasks: [],
});
