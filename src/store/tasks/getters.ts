import type { Task } from '@/modules/Tasks/components/entities/task.entity';
import type { TaskPriority } from '@/modules/Tasks/components/interfaces/task.interface';
import type { TasksState } from './state';

const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysUntilOccurrence(task: Task, today: Date): number | null {
  if (task.date) {
    const [year, month, day] = task.date.split('-').map(Number) as [number, number, number];
    const target = new Date(year, month - 1, day);
    return Math.round((target.getTime() - startOfDay(today).getTime()) / 86_400_000);
  }

  if (task.weekDay !== null) {
    return (task.weekDay - today.getDay() + 7) % 7;
  }

  return null;
}

// Regra de negócio preservada byte-a-byte a partir de
// src/modules/Tasks/store/tasks.store.ts (antigo store Pinia): prioridade
// primeiro, depois urgência (data/dia da semana mais próximo), depois
// horário, depois ordem de criação.
function compareTasks(a: Task, b: Task, today: Date): number {
  const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priorityDiff !== 0) return priorityDiff;

  const urgencyA = daysUntilOccurrence(a, today);
  const urgencyB = daysUntilOccurrence(b, today);

  if (urgencyA !== null && urgencyB !== null) {
    if (urgencyA !== urgencyB) return urgencyA - urgencyB;
  } else if (urgencyA !== null) {
    return -1; // só a tem data/dia da semana → a primeiro
  } else if (urgencyB !== null) {
    return 1;
  }

  // mesma urgência (ou nenhuma das duas tem data/dia) → cai pro horário
  if (a.time && b.time) return a.time.localeCompare(b.time);
  if (a.time && !b.time) return -1;
  if (!a.time && b.time) return 1;

  return a.createdAt.getTime() - b.createdAt.getTime();
}

export default {
  total: (state: TasksState): number => state.tasks.length,

  completed: (state: TasksState): number => state.tasks.filter((t) => t.completed).length,

  pending: (state: TasksState): number => state.tasks.filter((t) => !t.completed).length,

  sortedTasks: (state: TasksState): Task[] => {
    const today = new Date();
    return [...state.tasks].sort((a, b) => compareTasks(a, b, today));
  },
};
