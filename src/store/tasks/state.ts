import taskService from '@/modules/Tasks/services/task.service';
import type { Task } from '@/modules/Tasks/components/entities/task.entity';

export interface TasksState {
  tasks: Task[];
}

export default (): TasksState => ({
  tasks: taskService.getAll(),
});
