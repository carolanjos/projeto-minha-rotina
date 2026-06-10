<template>
  <div>
    <h1 class="titulo">Minha Rotina</h1>

    <div class="form-nova">
      <input
        v-model="novaTarefa"
        type="text"
        placeholder="O que você precisa fazer?"
        @keyup.enter="adicionarTarefa"
      />
      <button @click="adicionarTarefa">Adicionar</button>
    </div>

    <div class="lista">
      <p v-if="tarefas.length === 0" class="vazia">Nenhuma tarefa ainda. Adicione uma acima!</p>

      <TarefaItem
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @alternar="alternarTarefa"
        @remover="removerTarefa"
      />
    </div>

    <p class="contador" v-if="tarefas.length > 0">
      {{ tarefasConcluidas }} de {{ tarefas.length }} concluídas
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TarefaItem from '../components/TarefaItem.vue'
import { Tarefa } from '../types/tarefa.interface'

const novaTarefa = ref('')
const tarefas = ref<Tarefa[]>([])

const tarefasConcluidas = computed(() => tarefas.value.filter((t) => t.concluida).length)

function adicionarTarefa() {
  const texto = novaTarefa.value.trim()
  if (!texto) return

  tarefas.value.push({
    id: Date.now(),
    texto,
    concluida: false,
    criadaEm: new Date(),
  })

  novaTarefa.value = ''
}

function alternarTarefa(id: number) {
  const tarefa = tarefas.value.find((t) => t.id === id)
  if (tarefa) tarefa.concluida = !tarefa.concluida
}

function removerTarefa(id: number) {
  tarefas.value = tarefas.value.filter((t) => t.id !== id)
}
</script>

<style scoped>
.titulo {
  font-size: 28px;
  margin-bottom: 24px;
  color: #2c3e50;
}

.form-nova {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.form-nova input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-nova input:focus {
  border-color: #42b883;
}

.form-nova button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.form-nova button:hover {
  background: #369870;
}

.vazia {
  text-align: center;
  color: #999;
  padding: 32px;
}

.contador {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  text-align: right;
}
</style>
