<template>
  <div class="schedule">
    <header class="schedule__header">
      <h1 class="schedule__title">Rotina de hoje</h1>
      <div class="schedule__nav">
        <v-btn icon @click="previousPeriod">
          <v-icon>{{ mdiChevronLeftIcon }}</v-icon>
        </v-btn>
        <v-btn color="primary" @click="openCreateDialog">+ Novo bloco</v-btn>
        <v-btn icon @click="nextPeriod">
          <v-icon>{{ mdiChevronRightIcon }}</v-icon>
        </v-btn>
      </div>
    </header>

    <v-btn-toggle v-model="activePeriod" mandatory dense class="schedule__periods">
      <v-btn v-for="p in periodOptions" :key="p.value" :value="p.value">{{ p.label }}</v-btn>
    </v-btn-toggle>

    <draggable
      v-model="draftBlocks"
      class="schedule__list"
      handle=".schedule-block-card__grip"
      @end="onReorder"
    >
      <schedule-block-card
        v-for="block in draftBlocks"
        :key="block.id"
        :block="block"
        :is-current="block.id === currentBlockId"
        @click.native="openEditDialog(block)"
      />
    </draggable>

    <p v-if="draftBlocks.length === 0" class="schedule__empty">
      + Horário livre — arraste um bloco aqui
    </p>

    <schedule-block-form-dialog
      v-model="showDialog"
      :block="editingBlock"
      @save="onSave"
      @remove="onRemove"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import ScheduleBlockCard from './components/schedule-block-card.component.vue';
import ScheduleBlockFormDialog from './components/schedule-block-form-dialog.component.vue';
import type {
  ScheduleBlockInterface,
  SchedulePeriod,
} from './components/interfaces/schedule-block.interface';

interface SaveBlockPayload {
  id: number | null;
  name: string;
  category: string;
  startTime: string;
  durationMinutes: number;
}

const PERIODS: SchedulePeriod[] = ['morning', 'afternoon', 'evening'];

@Component({
  components: { draggable, ScheduleBlockCard, ScheduleBlockFormDialog },
})
export default class Schedule extends Vue {
  private activePeriod: SchedulePeriod = 'morning';

  // Cópia local mutável exigida pelo v-model do vuedraggable — a ordem só é
  // persistida na store (e no localStorage) quando o usuário solta o item
  // (@end -> onReorder), não a cada re-render.
  private draftBlocks: ScheduleBlockInterface[] = [];

  private showDialog = false;

  private editingBlock: ScheduleBlockInterface | null = null;

  private readonly mdiChevronLeftIcon = mdiChevronLeft;

  private readonly mdiChevronRightIcon = mdiChevronRight;

  private readonly periodOptions: { label: string; value: SchedulePeriod }[] = [
    { label: 'Manhã', value: 'morning' },
    { label: 'Tarde', value: 'afternoon' },
    { label: 'Noite', value: 'evening' },
  ];

  private get blocksFromStore(): ScheduleBlockInterface[] {
    return this.$store.getters['schedule/blocksByPeriod'](this.activePeriod);
  }

  private get currentBlockId(): number | null {
    return this.$store.getters['schedule/currentBlockId'];
  }

  @Watch('activePeriod', { immediate: true })
  @Watch('blocksFromStore')
  private syncDraftBlocks(): void {
    this.draftBlocks = [...this.blocksFromStore];
  }

  private previousPeriod(): void {
    const index = PERIODS.indexOf(this.activePeriod);
    this.activePeriod = PERIODS[(index - 1 + PERIODS.length) % PERIODS.length];
  }

  private nextPeriod(): void {
    const index = PERIODS.indexOf(this.activePeriod);
    this.activePeriod = PERIODS[(index + 1) % PERIODS.length];
  }

  private onReorder(): void {
    this.$store.dispatch('schedule/reorderBlocks', this.draftBlocks.map((b) => b.id));
  }

  private openCreateDialog(): void {
    this.editingBlock = null;
    this.showDialog = true;
  }

  private openEditDialog(block: ScheduleBlockInterface): void {
    this.editingBlock = block;
    this.showDialog = true;
  }

  private onSave(payload: SaveBlockPayload): void {
    if (payload.id === null) {
      this.$store.dispatch('schedule/addBlock', payload);
    } else {
      this.$store.dispatch('schedule/updateBlock', payload);
    }
  }

  private onRemove(id: number): void {
    this.$store.dispatch('schedule/removeBlock', id);
  }
}
</script>

<style lang="sass" scoped>
.schedule
  max-width: 680px
  margin: 0 auto

  &__header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 16px

  &__title
    font-size: 22px
    font-weight: 500
    margin: 0

  &__nav
    display: flex
    align-items: center
    gap: 8px

  &__periods
    margin-bottom: 16px

  &__list
    min-height: 8px

  &__empty
    text-align: center
    opacity: 0.5
    border: 1px dashed var(--v-anchor-base)
    border-radius: $radius
    padding: 24px
    font-size: 14px
</style>
