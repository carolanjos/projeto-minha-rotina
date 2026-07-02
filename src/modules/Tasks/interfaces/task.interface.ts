export type TaskPriority = 'low' | 'medium' | 'high'

export interface TaskInterface {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  priority: TaskPriority
  category: string
  weekDay: number | null
  time: string | null
}
