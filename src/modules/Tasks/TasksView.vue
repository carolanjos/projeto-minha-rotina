<template>
  <div>
    <h1 class="title">Minha Rotina</h1>

    <div class="form-new">
      <input
        v-model="newTask"
        type="text"
        placeholder="O que você precisa fazer?"
        @keyup.enter="add"
      />
      <button @click="add">Adicionar</button>
    </div>

    <div class="form-extra">
      <select v-model="newPriority">
        <option value="low">Prioridade baixa</option>
        <option value="medium">Prioridade média</option>
        <option value="high">Prioridade alta</option>
      </select>

      <select v-model="newCategory">
        <option value="work">Trabalho</option>
        <option value="home">Casa</option>
        <option value="health">Saúde</option>
        <option value="study">Estudo</option>
        <option value="personal">Pessoal</option>
        <option value="other">Outro</option>
      </select>

      <select v-model="newWeekDay">
        <option :value="null">Qualquer dia</option>
        <option v-for="d in weekDays" :key="d.value" :value="d.value">{{ d.label }}</option>
      </select>

      <input v-model="newTime" type="time" />
    </div>

    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="list">
      <p v-if="filteredTasks.length === 0" class="empty">Nenhuma tarefa por aqui!</p>
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="store.toggleTask"
        @remove="store.removeTask"
        @edit="store.editTask"
      />
    </div>

    <div class="footer" v-if="store.total > 0">
      <span>{{ store.completed }} de {{ store.total }} concluídas</span>
      <button v-if="store.completed > 0" class="btn-clear" @click="store.clearCompleted">
        Limpar concluídas
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from './store/tasks.store'
import TaskItem from './components/task-item.component.vue'
import type { TaskPriority } from './interfaces/task.interface'

const store = useTasksStore()
const newTask = ref('')
const newPriority = ref<TaskPriority>('medium')
const newCategory = ref('other')
const newWeekDay = ref<number | null>(null)
const newTime = ref('')
const activeFilter = ref('all')

const weekDays = [
  { label: 'Domingo', value: 0 },
  { label: 'Segunda-feira', value: 1 },
  { label: 'Terça-feira', value: 2 },
  { label: 'Quarta-feira', value: 3 },
  { label: 'Quinta-feira', value: 4 },
  { label: 'Sexta-feira', value: 5 },
  { label: 'Sábado', value: 6 },
]

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'completed' },
]

const filteredTasks = computed(() => {
  if (activeFilter.value === 'pending') return store.tasks.filter((t) => !t.completed)
  if (activeFilter.value === 'completed') return store.tasks.filter((t) => t.completed)
  return store.tasks
})

function add() {
  const text = newTask.value.trim()
  if (!text) return
  store.addTask(text, newPriority.value, newCategory.value, newWeekDay.value, newTime.value || null)
  newTask.value = ''
}
</script>

<style scoped>
.title {
  font-size: 32px;
  margin-bottom: 24px;
  color: var(--color-primary);
  font-weight: 800;
}
.form-new {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.form-new input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 15px;
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s;
}
.form-new input:focus {
  border-color: var(--color-primary);
}
.form-new button {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.15s,
    background 0.2s;
}
.form-new button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
.form-extra {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.form-extra select,
.form-extra input[type='time'] {
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
}
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.filters button {
  padding: 8px 18px;
  border: 2px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.filters button.active {
  border-color: var(--color-secondary);
  background: var(--color-secondary);
  color: #123;
}
.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 40px;
  font-size: 16px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: var(--color-text-muted);
  font-size: 14px;
}
.btn-clear {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
}
</style>
