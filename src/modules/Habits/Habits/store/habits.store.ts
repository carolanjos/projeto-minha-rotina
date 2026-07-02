import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Habit } from '../entities/habit.entity'
import habitService from '../services/habit.service'

export const useHabitsStore = defineStore('habits', () => {
  const habits = ref<Habit[]>(habitService.getAll())

  const todaysHabits = computed(() => {
    const today = new Date().getDay()
    return habits.value.filter((h) => h.weekDays.includes(today))
  })

  const totalCompleted = computed(() => todaysHabits.value.filter((h) => h.completedToday).length)

  function addHabit(name: string, emoji: string, weekDays: number[]) {
    habits.value.push(habitService.create(name, emoji, weekDays))
    habitService.save(habits.value)
  }

  function toggleHabit(id: number) {
    const habit = habits.value.find((h) => h.id === id)
    if (!habit) return

    habit.completedToday = !habit.completedToday

    if (habit.completedToday) {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      habit.streak = habit.lastCompletion === yesterday ? habit.streak + 1 : 1
      habit.lastCompletion = today
    } else {
      habit.streak = Math.max(0, habit.streak - 1)
    }

    habitService.save(habits.value)
  }

  function removeHabit(id: number) {
    habits.value = habits.value.filter((h) => h.id !== id)
    habitService.save(habits.value)
  }

  return { habits, todaysHabits, totalCompleted, addHabit, toggleHabit, removeHabit }
})
