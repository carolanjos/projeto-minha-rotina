<template>
  <div>
    <h1 class="titulo">Minha Rotina</h1>

    <!-- Formulário -->
    <div class="form-nova">
      <input
        v-model="novaTarefa"
        type="text"
        placeholder="O que você precisa fazer?"
        @keyup.enter="adicionar"
      />
      <button @click="adicionar">Adicionar</button>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <button
        v-for="f in filtros"
        :key="f.valor"
        :class="{ ativo: filtroAtivo === f.valor }"
        @click="filtroAtivo = f.valor"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Lista -->
    <div class="lista">
      <p v-if="tarefasFiltradas.length === 0" class="vazia">Nenhuma tarefa aqui!</p>

      <TarefaItem
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @alternar="store.alternarTarefa"
        @remover="store.removerTarefa"
      />
    </div>

    <!-- Rodapé -->
    <div class="rodape" v-if="store.total > 0">
      <span>{{ store.concluidas }} de {{ store.total }} concluídas</span>
      <button v-if="store.concluidas > 0" class="btn-limpar" @click="store.limparConcluidas">
        Limpar concluídas
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TarefaItem from '../components/TarefaItem.vue'
import { useTarefasStore } from '../stores/tarefas'

const store = useTarefasStore()
const novaTarefa = ref('')
const filtroAtivo = ref('todas')

const filtros = [
  { label: 'Todas', valor: 'todas' },
  { label: 'Pendentes', valor: 'pendentes' },
  { label: 'Concluídas', valor: 'concluidas' },
]

const tarefasFiltradas = computed(() => {
  if (filtroAtivo.value === 'pendentes') return store.tarefas.filter((t) => !t.concluida)
  if (filtroAtivo.value === 'concluidas') return store.tarefas.filter((t) => t.concluida)
  return store.tarefas
})

function adicionar() {
  const texto = novaTarefa.value.trim()
  if (!texto) return
  store.adicionarTarefa(texto)
  novaTarefa.value = ''
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
  margin-bottom: 16px;
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

.filtros {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filtros button {
  padding: 6px 16px;
  border: 2px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filtros button.ativo {
  border-color: #42b883;
  background: #42b883;
  color: white;
}

.vazia {
  text-align: center;
  color: #999;
  padding: 32px;
}

.rodape {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.btn-limpar {
  background: none;
  border: none;
  color: #e55;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}
</style>
