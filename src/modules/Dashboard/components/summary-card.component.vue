<template>
  <v-card class="summary-card" flat>
    <v-card-text class="summary-card__content">
      <v-icon class="summary-card__icon" color="secondary">{{ icon }}</v-icon>
      <div class="summary-card__body">
        <span class="summary-card__value">{{ value }}</span>
        <span class="summary-card__label">{{ label }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SummaryCardComponent extends Vue {
  @Prop({ required: true }) private label!: string;

  @Prop({ required: true }) private value!: string;

  @Prop({ required: true }) private icon!: string;
}
</script>

<style lang="sass" scoped>
.summary-card
  background: var(--v-background-base)

  &__content
    display: flex
    flex-direction: column
    gap: 8px
    padding: 12px

  &__icon
    align-self: flex-start

  &__body
    display: flex
    flex-direction: column

  &__value
    font-size: 24px
    font-weight: 500

  &__label
    font-size: 13px
    opacity: 0.7
</style>
