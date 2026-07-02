import type { TaskInterface, TaskPriority } from '../interfaces/task.interface'

export class Task implements TaskInterface {
  public id: number = 0
  public text: string = ''
  public completed: boolean = false
  public createdAt: Date = new Date()
  public priority: TaskPriority = 'medium'
  public category: string = 'other'
  public weekDay: number | null = null
  public time: string | null = null

  constructor(data: Partial<TaskInterface> = {}) {
    this.id = data.id ?? Date.now()
    this.text = data.text ?? ''
    this.completed = data.completed ?? false
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
    this.priority = data.priority ?? 'medium'
    this.category = data.category ?? 'other'
    this.weekDay = data.weekDay ?? null
    this.time = data.time ?? null
  }

  public formatPayload(): TaskInterface {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      createdAt: this.createdAt,
      priority: this.priority,
      category: this.category,
      weekDay: this.weekDay,
      time: this.time,
    }
  }
}
