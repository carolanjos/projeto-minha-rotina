<template>
  <div class="tarefa" :class="{ concluida: tarefa.concluida }">
    <input type="checkbox" :checked="tarefa.concluida" @change="$emit('alternar', tarefa.id)" />
    <span class="texto">{{ tarefa.texto }}</span>
    <button class="btn-remover" @click="$emit('remover', tarefa.id)">✕</button>
  </div>
</template>

<script setup lang="ts">
import type { Tarefa } from '../types/tarefa.interface'

defineProps<{
  tarefa: Tarefa
}>()

defineEmits<{
  alternar: [id: number]
  remover: [id: number]
}>()
</script>

<style scoped>
.tarefa {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
}

.tarefa.concluida .texto {
  text-decoration: line-through;
  opacity: 0.5;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.texto {
  flex: 1;
  font-size: 15px;
}

.btn-remover {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-remover:hover {
  background: #fee;
  color: #e55;
}
</style>
