<template>
  <div class="timeline-item">
    <span class="timeline-item__time">{{ block.startTime }}</span>
    <v-icon class="timeline-item__icon" small>{{ icon }}</v-icon>
    <span class="timeline-item__name">{{ block.name }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CATEGORY_ICONS } from '@/shared/categories';
import type { ScheduleBlockInterface } from '@/modules/Schedule/components/interfaces/schedule-block.interface';

@Component
export default class TimelineItemComponent extends Vue {
  @Prop({ required: true }) private block!: ScheduleBlockInterface;

  private get icon(): string {
    return CATEGORY_ICONS[this.block.category] ?? CATEGORY_ICONS.other;
  }
}
</script>

<style lang="sass" scoped>
.timeline-item
  display: flex
  align-items: center
  gap: 10px
  padding: 8px 4px
  border-top: 0.5px solid var(--v-anchor-base)

  &:first-child
    border-top: none

  &__time
    width: 52px
    flex-shrink: 0
    font-size: 13px
    opacity: 0.7

  &__name
    font-size: 14px
</style>
