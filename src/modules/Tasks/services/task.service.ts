import { Task } from '../entities/task.entity'
import type { TaskInterface, TaskPriority } from '../interfaces/task.interface'

const STORAGE_KEY = 'tasks'

class TaskService {
  public getAll(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed: TaskInterface[] = JSON.parse(data)
    return parsed.map((d) => new Task(d))
  }

  public save(tasks: Task[]): void {
    const payload = tasks.map((t) => t.formatPayload())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  public create(
    text: string,
    priority: TaskPriority,
    category: string,
    weekDay: number | null,
    time: string | null,
  ): Task {
    return new Task({ text, priority, category, weekDay, time })
  }
}

export default new TaskService()
