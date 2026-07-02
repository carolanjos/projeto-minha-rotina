<template>
  <div>
    <h1 class="title">Hábitos de Hoje</h1>

    <div class="progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
      </div>
      <span>{{ store.totalCompleted }} / {{ store.todaysHabits.length }}</span>
    </div>

    <div class="list">
      <p v-if="store.todaysHabits.length === 0" class="empty">
        Nenhum hábito para hoje. Adicione um abaixo!
      </p>
      <div
        v-for="habit in store.todaysHabits"
        :key="habit.id"
        class="habit-card"
        :class="{ completed: habit.completedToday }"
        @click="store.toggleHabit(habit.id)"
      >
        <span class="emoji">{{ habit.emoji }}</span>
        <span class="name">{{ habit.name }}</span>
        <span class="streak" v-if="habit.streak > 0">🔥 {{ habit.streak }}</span>
        <span class="check">{{ habit.completedToday ? '✓' : '' }}</span>
      </div>
    </div>

    <div class="form-new" v-if="!showForm">
      <button class="btn-add" @click="showForm = true">+ Novo hábito</button>
    </div>

    <div class="form-card" v-else>
      <input v-model="newName" placeholder="Nome do hábito" />
      <input v-model="newEmoji" placeholder="Emoji (ex: 💧)" maxlength="2" />
      <div class="days">
        <button
          v-for="day in weekDays"
          :key="day.value"
          :class="{ selected: selectedDays.includes(day.value) }"
          @click="toggleDay(day.value)"
        >
          {{ day.label }}
        </button>
      </div>
      <div class="form-actions">
        <button @click="showForm = false">Cancelar</button>
        <button class="btn-save" @click="save">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHabitsStore } from './Habits/store/habits.store'

const store = useHabitsStore()
const showForm = ref(false)
const newName = ref('')
const newEmoji = ref('')
const selectedDays = ref<number[]>([1, 2, 3, 4, 5])

const weekDays = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
]

const percentage = computed(() => {
  if (store.todaysHabits.length === 0) return 0
  return Math.round((store.totalCompleted / store.todaysHabits.length) * 100)
})

function toggleDay(day: number) {
  const idx = selectedDays.value.indexOf(day)
  if (idx === -1) selectedDays.value.push(day)
  else selectedDays.value.splice(idx, 1)
}

function save() {
  if (!newName.value.trim()) return
  store.addHabit(newName.value.trim(), newEmoji.value || '⭐', selectedDays.value)
  newName.value = ''
  newEmoji.value = ''
  showForm.value = false
}
</script>

<style scoped>
.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #2c3e50;
}
.progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #42b883;
  border-radius: 4px;
  transition: width 0.4s ease;
}
.habit-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.habit-card:hover {
  transform: translateY(-1px);
}
.habit-card.completed {
  opacity: 0.6;
  background: #f0faf5;
}
.emoji {
  font-size: 22px;
}
.name {
  flex: 1;
  font-size: 15px;
}
.streak {
  font-size: 13px;
  color: #e67e22;
}
.check {
  width: 24px;
  height: 24px;
  background: #42b883;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.btn-add {
  width: 100%;
  padding: 12px;
  background: none;
  border: 2px dashed #ddd;
  border-radius: 10px;
  font-size: 15px;
  color: #999;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}
.btn-add:hover {
  border-color: #42b883;
  color: #42b883;
}
.form-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form-card input {
  padding: 10px 14px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.form-card input:focus {
  border-color: #42b883;
}
.days {
  display: flex;
  gap: 6px;
}
.days button {
  width: 34px;
  height: 34px;
  border: 2px solid #eee;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s;
}
.days button.selected {
  background: #42b883;
  border-color: #42b883;
  color: white;
}
.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.form-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #eee;
  background: white;
  cursor: pointer;
  font-size: 14px;
}
.btn-save {
  background: #42b883 !important;
  border-color: #42b883 !important;
  color: white !important;
}
.empty {
  text-align: center;
  color: #999;
  padding: 32px;
}
</style>
