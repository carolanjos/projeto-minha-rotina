<template>
  <v-card
    class="schedule-block-card"
    :class="{ 'schedule-block-card--current': isCurrent }"
    flat
  >
    <v-card-text class="schedule-block-card__content">
      <span class="schedule-block-card__time">{{ block.startTime }}</span>
      <v-icon class="schedule-block-card__icon">{{ icon }}</v-icon>
      <div class="schedule-block-card__body">
        <span class="schedule-block-card__name">{{ block.name }}</span>
        <span class="schedule-block-card__meta">
          {{ block.durationMinutes }} min · {{ categoryLabel }}
        </span>
      </div>
      <v-icon class="schedule-block-card__grip" small @click.stop>{{ mdiDragVerticalIcon }}</v-icon>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mdiDragVertical } from '@mdi/js';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/shared/categories';
import type { ScheduleBlockInterface } from './interfaces/schedule-block.interface';

@Component
export default class ScheduleBlockCardComponent extends Vue {
  @Prop({ required: true }) private block!: ScheduleBlockInterface;

  @Prop({ default: false }) private isCurrent!: boolean;

  private readonly mdiDragVerticalIcon = mdiDragVertical;

  private get icon(): string {
    return CATEGORY_ICONS[this.block.category] ?? CATEGORY_ICONS.other;
  }

  private get categoryLabel(): string {
    return CATEGORY_LABELS[this.block.category] ?? this.block.category;
  }
}
</script>

<style lang="sass" scoped>
.schedule-block-card
  margin-bottom: 8px
  border-left: 2px solid transparent
  cursor: pointer

  &--current
    border-left-color: var(--v-primary-base)

  &__content
    display: flex
    align-items: center
    gap: 12px

  &__time
    width: 44px
    flex-shrink: 0
    font-size: 12px
    opacity: 0.7

  &__body
    flex: 1
    display: flex
    flex-direction: column
    gap: 2px
    min-width: 0

  &__name
    font-size: 14px
    font-weight: 500

  &__meta
    font-size: 12px
    opacity: 0.7

  &__grip
    cursor: grab
    opacity: 0.5
</style>
