<template>
  <div class="tasks">
    <h1 class="tasks__title">Minha Rotina</h1>

    <v-card class="tasks__form" flat>
      <v-card-text>
        <div class="tasks__form-main">
          <v-text-field
            v-model="newTask"
            placeholder="O que você precisa fazer?"
            hide-details
            dense
            class="tasks__input"
            @keyup.enter="add"
          />
          <v-btn color="primary" class="tasks__add-btn" @click="add">Adicionar</v-btn>
        </div>

        <div class="tasks__form-extra">
          <v-select
            v-model="newPriority"
            :items="priorityOptions"
            label="Prioridade"
            dense
            hide-details
            class="tasks__field"
          />
          <v-select
            v-model="newCategory"
            :items="categoryOptions"
            label="Categoria"
            dense
            hide-details
            class="tasks__field"
          />
          <v-select
            v-model="newWeekDay"
            :items="weekDayOptions"
            label="Dia da semana"
            clearable
            dense
            hide-details
            class="tasks__field"
          />
          <v-text-field
            v-model="newTime"
            type="time"
            label="Horário"
            dense
            hide-details
            class="tasks__field"
          />
          <v-text-field
            v-model="newDate"
            type="date"
            label="Data"
            dense
            hide-details
            class="tasks__field"
          />
        </div>
      </v-card-text>
    </v-card>

    <v-btn-toggle v-model="activeFilter" mandatory dense class="tasks__filters">
      <v-btn v-for="f in filters" :key="f.value" :value="f.value">{{ f.label }}</v-btn>
    </v-btn-toggle>

    <div class="tasks__list">
      <p v-if="filteredTasks.length === 0" class="tasks__empty">Nenhuma tarefa por aqui!</p>
      <task-item
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="onToggle"
        @remove="onRemove"
        @edit="onEdit"
      />
    </div>

    <div v-if="total > 0" class="tasks__footer">
      <span>{{ completed }} de {{ total }} concluídas</span>
      <v-btn
        v-if="completed > 0"
        text
        color="primary"
        class="tasks__clear-btn"
        @click="clearCompleted"
      >
        Limpar concluídas
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CATEGORY_OPTIONS } from '@/shared/categories';
import TaskItem from './components/task-item.component.vue';
import type { TaskInterface, TaskPriority } from './components/interfaces/task.interface';

@Component({
  components: { TaskItem },
})
export default class Tasks extends Vue {
  private newTask = '';

  private newPriority: TaskPriority = 'medium';

  private newCategory = 'other';

  private newWeekDay: number | null = null;

  private newTime = '';

  private newDate: string | null = null;

  private activeFilter = 'all';

  private readonly weekDayOptions = [
    { text: 'Domingo', value: 0 },
    { text: 'Segunda-feira', value: 1 },
    { text: 'Terça-feira', value: 2 },
    { text: 'Quarta-feira', value: 3 },
    { text: 'Quinta-feira', value: 4 },
    { text: 'Sexta-feira', value: 5 },
    { text: 'Sábado', value: 6 },
  ];

  private readonly priorityOptions = [
    { text: 'Prioridade baixa', value: 'low' },
    { text: 'Prioridade média', value: 'medium' },
    { text: 'Prioridade alta', value: 'high' },
  ];

  private readonly categoryOptions = CATEGORY_OPTIONS;

  private readonly filters = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Concluídas', value: 'completed' },
  ];

  private get sortedTasks(): TaskInterface[] {
    return this.$store.getters['tasks/sortedTasks'];
  }

  private get total(): number {
    return this.$store.getters['tasks/total'];
  }

  private get completed(): number {
    return this.$store.getters['tasks/completed'];
  }

  private get filteredTasks(): TaskInterface[] {
    if (this.activeFilter === 'pending') return this.sortedTasks.filter((t) => !t.completed);
    if (this.activeFilter === 'completed') return this.sortedTasks.filter((t) => t.completed);
    return this.sortedTasks;
  }

  private add(): void {
    const text = this.newTask.trim();
    if (!text) return;

    this.$store.dispatch('tasks/addTask', {
      text,
      priority: this.newPriority,
      category: this.newCategory,
      weekDay: this.newWeekDay,
      time: this.newTime || null,
      date: this.newDate || null,
    });

    this.newTask = '';
  }

  private onToggle(id: number): void {
    this.$store.dispatch('tasks/toggleTask', id);
  }

  private onRemove(id: number): void {
    this.$store.dispatch('tasks/removeTask', id);
  }

  private onEdit(id: number, text: string): void {
    this.$store.dispatch('tasks/editTask', { id, text });
  }

  private clearCompleted(): void {
    this.$store.dispatch('tasks/clearCompleted');
  }
}
</script>

<style lang="sass" scoped>
.tasks
  &__title
    font-size: 32px
    margin-bottom: 24px
    color: var(--v-primary-base)
    font-weight: 800

  &__form
    margin-bottom: 20px

  &__form-main
    display: flex
    gap: 8px
    margin-bottom: 12px
    align-items: center

  &__input
    flex: 1

  &__form-extra
    display: flex
    gap: 12px
    flex-wrap: wrap

  &__field
    max-width: 180px

  &__filters
    margin-bottom: 24px

  &__empty
    text-align: center
    opacity: 0.6
    padding: 40px
    font-size: 16px

  &__footer
    display: flex
    justify-content: space-between
    align-items: center
    margin-top: 20px
    font-size: 14px
</style>
