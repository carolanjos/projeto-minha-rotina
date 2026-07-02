<template>
  <div class="task" :class="[`priority-${task.priority}`, { completed: task.completed }]">
    <input type="checkbox" :checked="task.completed" @change="$emit('toggle', task.id)" />

    <div class="content">
      <input
        v-if="isEditing"
        v-model="editText"
        v-focus
        class="edit-input"
        type="text"
        @keyup.enter="save"
        @keyup.esc="cancel"
        @blur="save"
      />
      <span v-else class="text">{{ task.text }}</span>

      <div class="meta">
        <span class="badge" :class="`badge-${task.priority}`">{{ priorityLabel }}</span>
        <span class="badge badge-category">{{ categoryLabel }}</span>
        <span v-if="task.weekDay !== null || task.time" class="badge badge-schedule">
          {{ scheduleLabel }}
        </span>
      </div>
    </div>

    <button v-if="!isEditing" class="btn-edit" title="Editar tarefa" @mousedown.prevent="startEdit">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path :d="mdiPencil" fill="currentColor" />
      </svg>
    </button>
    <button class="btn-remove" @click="$emit('remove', task.id)">✕</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mdiPencil } from '@mdi/js'
import type { TaskInterface } from '../interfaces/task.interface'

const props = defineProps<{ task: TaskInterface }>()
const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
  edit: [id: number, text: string]
}>()

const isEditing = ref(false)
const editText = ref('')

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const priorityLabels: Record<TaskInterface['priority'], string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

const categoryLabels: Record<string, string> = {
  work: 'Trabalho',
  home: 'Casa',
  health: 'Saúde',
  study: 'Estudo',
  personal: 'Pessoal',
  other: 'Outro',
}

const scheduleLabel = computed(() => {
  const day = props.task.weekDay !== null ? dayNames[props.task.weekDay] : ''
  const time = props.task.time ?? ''
  return [day, time].filter(Boolean).join(' ')
})

const priorityLabel = computed(() => priorityLabels[props.task.priority] ?? props.task.priority)
const categoryLabel = computed(() => categoryLabels[props.task.category] ?? props.task.category)

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
}

function startEdit() {
  editText.value = props.task.text
  isEditing.value = true
}

function save() {
  if (!isEditing.value) return
  const text = editText.value.trim()
  if (text && text !== props.task.text) {
    emit('edit', props.task.id, text)
  }
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}
</script>

<style scoped>
.task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--color-surface);
  border-radius: var(--radius);
  border-left: 5px solid transparent;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition:
    transform 0.15s,
    opacity 0.2s;
}
.task:hover {
  transform: translateY(-2px);
}
.task.priority-low {
  border-left-color: var(--priority-low);
}
.task.priority-medium {
  border-left-color: var(--priority-medium);
}
.task.priority-high {
  border-left-color: var(--priority-high);
}
.task.completed .text {
  text-decoration: line-through;
  opacity: 0.5;
}
input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: var(--color-primary);
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.text {
  font-size: 15px;
  color: var(--color-text);
}
.edit-input {
  font-size: 15px;
  padding: 6px 10px;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
}
.meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
  text-transform: capitalize;
}
.badge-low {
  background: color-mix(in srgb, var(--priority-low) 20%, transparent);
  color: var(--priority-low);
}
.badge-medium {
  background: color-mix(in srgb, var(--priority-medium) 20%, transparent);
  color: var(--priority-medium);
}
.badge-high {
  background: color-mix(in srgb, var(--priority-high) 20%, transparent);
  color: var(--priority-high);
}
.badge-category {
  background: color-mix(in srgb, var(--color-secondary) 20%, transparent);
  color: var(--color-secondary);
}
.badge-schedule {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}
.btn-edit {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}
.btn-edit:hover {
  background: color-mix(in srgb, var(--color-secondary) 20%, transparent);
  color: var(--color-secondary);
}
.btn-remove {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 16px;
  padding: 6px 10px;
  border-radius: 8px;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}
.btn-remove:hover {
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  color: var(--color-primary);
}
</style>
