<template>
  <div class="habits">
    <h1 class="habits__title">Hábitos de Hoje</h1>

    <div class="habits__progress">
      <v-progress-linear
        :value="percentage"
        height="10"
        rounded
        color="secondary"
        class="habits__progress-bar"
      />
      <span class="habits__progress-label">{{ totalCompleted }} / {{ todaysHabits.length }}</span>
    </div>

    <div class="habits__list">
      <p v-if="todaysHabits.length === 0" class="habits__empty">
        Nenhum hábito para hoje. Adicione um abaixo!
      </p>

      <v-card
        v-for="habit in todaysHabits"
        :key="habit.id"
        class="habits__card"
        :class="{ 'habits__card--completed': habit.completedToday }"
        flat
        @click="toggleHabit(habit.id)"
      >
        <v-card-text class="habits__card-content">
          <span class="habits__emoji">{{ habit.emoji }}</span>
          <span class="habits__name">{{ habit.name }}</span>
          <span v-if="habit.streak > 0" class="habits__streak">🔥 {{ habit.streak }}</span>
          <v-icon v-if="habit.completedToday" color="secondary">{{ mdiCheckIcon }}</v-icon>
        </v-card-text>
      </v-card>
    </div>

    <v-btn v-if="!showForm" outlined block class="habits__add-btn" @click="showForm = true">
      + Novo hábito
    </v-btn>

    <v-card v-else class="habits__form" flat>
      <v-card-text>
        <v-text-field
          v-model="newName"
          label="Nome do hábito"
          dense
          hide-details
          class="habits__field"
        />
        <v-text-field
          v-model="newEmoji"
          label="Emoji (ex: 💧)"
          maxlength="2"
          dense
          hide-details
          class="habits__field"
        />

        <v-chip-group v-model="selectedDays" multiple column class="habits__days">
          <v-chip v-for="day in weekDayOptions" :key="day.value" :value="day.value" small filter>
            {{ day.label }}
          </v-chip>
        </v-chip-group>

        <div class="habits__form-actions">
          <v-btn text @click="showForm = false">Cancelar</v-btn>
          <v-btn color="secondary" @click="save">Salvar</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiCheck } from '@mdi/js';
import type { HabitInterface } from './components/interfaces/habit.interface';

@Component
export default class Habits extends Vue {
  private showForm = false;

  private newName = '';

  private newEmoji = '';

  private selectedDays: number[] = [1, 2, 3, 4, 5];

  private readonly mdiCheckIcon = mdiCheck;

  private readonly weekDayOptions = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
  ];

  private get todaysHabits(): HabitInterface[] {
    return this.$store.getters['habits/todaysHabits'];
  }

  private get totalCompleted(): number {
    return this.$store.getters['habits/totalCompleted'];
  }

  private get percentage(): number {
    if (this.todaysHabits.length === 0) return 0;
    return Math.round((this.totalCompleted / this.todaysHabits.length) * 100);
  }

  private toggleHabit(id: number): void {
    this.$store.dispatch('habits/toggleHabit', id);
  }

  private save(): void {
    const name = this.newName.trim();
    if (!name) return;

    this.$store.dispatch('habits/addHabit', {
      name,
      emoji: this.newEmoji || '⭐',
      weekDays: this.selectedDays,
    });

    this.newName = '';
    this.newEmoji = '';
    this.showForm = false;
  }
}
</script>

<style lang="sass" scoped>
.habits
  &__title
    font-size: 28px
    margin-bottom: 20px

  &__progress
    display: flex
    align-items: center
    gap: 12px
    margin-bottom: 20px

  &__progress-bar
    flex: 1

  &__card
    margin-bottom: 8px
    cursor: pointer
    transition: opacity 0.2s

    &--completed
      opacity: 0.6

  &__card-content
    display: flex
    align-items: center
    gap: 12px

  &__emoji
    font-size: 22px

  &__name
    flex: 1
    font-size: 15px

  &__streak
    font-size: 13px
    color: var(--v-warning-base)

  &__empty
    text-align: center
    padding: 32px
    opacity: 0.6

  &__add-btn
    margin-top: 8px

  &__form
    margin-top: 8px

  &__field
    margin-bottom: 12px

  &__form-actions
    display: flex
    gap: 8px
    justify-content: flex-end
</style>
