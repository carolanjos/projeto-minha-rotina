export interface HabitInterface {
  id: number
  name: string
  emoji: string
  weekDays: number[]
  completedToday: boolean
  streak: number
  lastCompletion: string | null
}