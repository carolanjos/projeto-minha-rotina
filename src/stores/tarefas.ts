import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Tarefa } from '../types/tarefa'

export const useTarefasStore = defineStore('tarefas', () => {
  // Carrega do localStorage ou começa com lista vazia
  const tarefas = ref<Tarefa[]>(carregarDoStorage())

  // Computed
  const total = computed(() => tarefas.value.length)
  const concluidas = computed(() => tarefas.value.filter((t) => t.concluida).length)
  const pendentes = computed(() => tarefas.value.filter((t) => !t.concluida).length)

  // Salva no localStorage sempre que tarefas mudar
  watch(tarefas, salvarNoStorage, { deep: true })

  // Funções
  function adicionarTarefa(texto: string) {
    tarefas.value.push({
      id: Date.now(),
      texto,
      concluida: false,
      criadaEm: new Date(),
    })
  }

  function alternarTarefa(id: number) {
    const tarefa = tarefas.value.find((t) => t.id === id)
    if (tarefa) tarefa.concluida = !tarefa.concluida
  }

  function removerTarefa(id: number) {
    tarefas.value = tarefas.value.filter((t) => t.id !== id)
  }

  function limparConcluidas() {
    tarefas.value = tarefas.value.filter((t) => !t.concluida)
  }

  // Funções de localStorage
  function salvarNoStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas.value))
  }

  function carregarDoStorage(): Tarefa[] {
    const dados = localStorage.getItem('tarefas')
    if (!dados) return []

    // Precisamos converter a data de string para Date
    const parsed = JSON.parse(dados)
    return parsed.map((t: any) => ({
      ...t,
      criadaEm: new Date(t.criadaEm),
    }))
  }

  return {
    tarefas,
    total,
    concluidas,
    pendentes,
    adicionarTarefa,
    alternarTarefa,
    removerTarefa,
    limparConcluidas,
  }
})
