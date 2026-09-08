<template>
  <div class="habit-checklist-grid">
    <v-card
      v-for="habit in habits"
      :key="habit.id"
      class="habit-checklist-grid__item"
      :class="{ 'habit-checklist-grid__item--completed': habit.completedToday }"
      flat
      @click="$emit('toggle', habit.id)"
    >
      <v-icon
        class="habit-checklist-grid__icon"
        :color="habit.completedToday ? 'secondary' : undefined"
      >
        {{ habit.completedToday ? mdiCheckIcon : mdiClockOutlineIcon }}
      </v-icon>
      <span
        class="habit-checklist-grid__name"
        :class="{ 'habit-checklist-grid__name--completed': habit.completedToday }"
      >{{ habit.name }}</span>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mdiCheck, mdiClockOutline } from '@mdi/js';
import type { HabitInterface } from '@/modules/Habits/components/interfaces/habit.interface';

@Component
export default class HabitChecklistGridComponent extends Vue {
  @Prop({ required: true }) private habits!: HabitInterface[];

  private readonly mdiCheckIcon = mdiCheck;

  private readonly mdiClockOutlineIcon = mdiClockOutline;
}
</script>

<style lang="sass" scoped>
.habit-checklist-grid
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: 8px

  &__item
    display: flex
    flex-direction: column
    align-items: center
    gap: 6px
    padding: 12px 4px
    text-align: center
    cursor: pointer
    background: var(--v-background-base)
    opacity: 0.6

    &--completed
      background: color-mix(in srgb, var(--v-secondary-base) 18%, transparent)
      opacity: 1

  &__name
    font-size: 12px

    &--completed
      color: var(--v-secondary-base)
      font-weight: 600
</style>
