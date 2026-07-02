import { Habit } from '../entities/habit.entity'
import type { HabitInterface } from '../interfaces/habit.interface'

const STORAGE_KEY = 'habits'

class HabitService {
  public getAll(): Habit[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed: HabitInterface[] = JSON.parse(data)
    return parsed.map((d) => new Habit(d))
  }

  public save(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits.map((h) => h.formatPayload())))
  }

  public create(name: string, emoji: string, weekDays: number[]): Habit {
    return new Habit({ name, emoji, weekDays })
  }
}

export default new HabitService()
