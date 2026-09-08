<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <div class="dashboard__greeting">
        <h1 class="dashboard__hello">Olá, {{ userName }}</h1>
        <span class="dashboard__date">{{ todayLabel }}</span>
      </div>
      <div class="dashboard__avatar">{{ initials }}</div>
    </header>

    <div class="dashboard__summary">
      <summary-card
        label="Tarefas"
        :value="`${tasksCompleted}/${tasksTotal}`"
        :icon="mdiCheckboxMarkedOutlineIcon"
      />
      <summary-card
        label="Hábitos"
        :value="`${habitsCompleted}/${habitsTotal}`"
        :icon="mdiCheckIcon"
      />
      <summary-card label="Sequência" :value="`${bestStreak} dias`" :icon="mdiFireIcon" />
    </div>

    <section class="dashboard__section">
      <h2 class="dashboard__section-title">Linha do tempo</h2>
      <p v-if="timeline.length === 0" class="dashboard__empty">
        Nenhum bloco cadastrado ainda — crie um na Rotina diária.
      </p>
      <timeline-item v-for="block in timeline" :key="block.id" :block="block" />
    </section>

    <section class="dashboard__section">
      <h2 class="dashboard__section-title">Hábitos de hoje</h2>
      <p v-if="todaysHabits.length === 0" class="dashboard__empty">
        Nenhum hábito para hoje.
      </p>
      <habit-checklist-grid v-else :habits="todaysHabits" @toggle="onToggleHabit" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiCheckboxMarkedOutline, mdiCheck, mdiFire } from '@mdi/js';
import SummaryCard from './components/summary-card.component.vue';
import TimelineItem from './components/timeline-item.component.vue';
import HabitChecklistGrid from './components/habit-checklist-grid.component.vue';
import type { HabitInterface } from '../Habits/components/interfaces/habit.interface';
import type { ScheduleBlockInterface } from '../Schedule/components/interfaces/schedule-block.interface';

@Component({
  components: { SummaryCard, TimelineItem, HabitChecklistGrid },
})
export default class Dashboard extends Vue {
  private readonly mdiCheckboxMarkedOutlineIcon = mdiCheckboxMarkedOutline;

  private readonly mdiCheckIcon = mdiCheck;

  private readonly mdiFireIcon = mdiFire;

  private created(): void {
    this.$store.dispatch('tasks/fetchTasks');
    this.$store.dispatch('habits/fetchHabits');
    this.$store.dispatch('schedule/fetchBlocks');
  }

  private get userName(): string {
    return this.$store.getters['auth/currentUser']?.name ?? '';
  }

  private get initials(): string {
    return this.userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private get todayLabel(): string {
    const label = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  private get tasksTotal(): number {
    return this.$store.getters['tasks/total'];
  }

  private get tasksCompleted(): number {
    return this.$store.getters['tasks/completed'];
  }

  private get todaysHabits(): HabitInterface[] {
    return this.$store.getters['habits/todaysHabits'];
  }

  private get habitsTotal(): number {
    return this.todaysHabits.length;
  }

  private get habitsCompleted(): number {
    return this.$store.getters['habits/totalCompleted'];
  }

  private get bestStreak(): number {
    return this.$store.getters['habits/bestStreak'];
  }

  private get timeline(): ScheduleBlockInterface[] {
    return this.$store.getters['schedule/timeline'];
  }

  private onToggleHabit(id: number): void {
    this.$store.dispatch('habits/toggleHabit', id);
  }
}
</script>

<style lang="sass" scoped>
.dashboard
  max-width: 680px
  margin: 0 auto

  &__header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px

  &__hello
    font-size: 18px
    font-weight: 500
    margin: 0

  &__date
    font-size: 13px
    opacity: 0.6

  &__avatar
    width: 40px
    height: 40px
    border-radius: 50%
    background: var(--v-accent-base)
    color: white
    display: flex
    align-items: center
    justify-content: center
    font-weight: 600
    flex-shrink: 0

  &__summary
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: 12px
    margin-bottom: 24px

  &__section
    margin-bottom: 24px

  &__section-title
    font-size: 16px
    font-weight: 500
    margin-bottom: 8px

  &__empty
    opacity: 0.6
    font-size: 14px
    padding: 12px 0
</style>
