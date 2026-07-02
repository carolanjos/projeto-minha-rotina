import type { HabitInterface } from '../interfaces/habit.interface'

export class Habit implements HabitInterface {
  public id: number = 0
  public name: string = ''
  public emoji: string = '⭐'
  public weekDays: number[] = []
  public completedToday: boolean = false
  public streak: number = 0
  public lastCompletion: string | null = null

  constructor(data: Partial<HabitInterface> = {}) {
    this.id = data.id ?? Date.now()
    this.name = data.name ?? ''
    this.emoji = data.emoji ?? '⭐'
    this.weekDays = data.weekDays ?? []
    this.completedToday = data.completedToday ?? false
    this.streak = data.streak ?? 0
    this.lastCompletion = data.lastCompletion ?? null
  }

  public formatPayload(): HabitInterface {
    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      weekDays: this.weekDays,
      completedToday: this.completedToday,
      streak: this.streak,
      lastCompletion: this.lastCompletion,
    }
  }
}
