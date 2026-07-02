import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { Task } from '../entities/task.entity'
import taskService from '../services/task.service'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(taskService.getAll())

  const total = computed(() => tasks.value.length)
  const completed = computed(() => tasks.value.filter((t) => t.completed).length)
  const pending = computed(() => tasks.value.filter((t) => !t.completed).length)

  watch(tasks, () => taskService.save(tasks.value), { deep: true })

  function addTask(
    text: string,
    priority: TaskPriority = 'medium',
    category: string = 'other',
    weekDay: number | null = null,
    time: string | null = null,
  ) {
    tasks.value.push(taskService.create(text, priority, category, weekDay, time))
  }

  function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.completed = !task.completed
  }

  function editTask(id: number, text: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return

    task.text = text
    taskService.save(tasks.value)
  }

  function removeTask(id: number) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter((t) => !t.completed)
  }

  return {
    tasks,
    total,
    completed,
    pending,
    addTask,
    toggleTask,
    editTask,
    removeTask,
    clearCompleted,
  }
})
