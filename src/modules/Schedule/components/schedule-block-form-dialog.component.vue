<template>
  <v-dialog :value="value" max-width="420" @input="$emit('input', $event)">
    <v-card class="schedule-block-form-dialog">
      <v-card-title>{{ isEditing ? 'Editar bloco' : 'Novo bloco' }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Nome"
          dense
          hide-details
          class="schedule-block-form-dialog__field"
        />
        <v-select
          v-model="category"
          :items="categoryOptions"
          label="Categoria"
          dense
          hide-details
          class="schedule-block-form-dialog__field"
        />
        <v-text-field
          v-model="startTime"
          type="time"
          label="Horário"
          dense
          hide-details
          class="schedule-block-form-dialog__field"
        />
        <v-text-field
          v-model.number="durationMinutes"
          type="number"
          label="Duração (min)"
          dense
          hide-details
          class="schedule-block-form-dialog__field"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="isEditing" text color="error" @click="onRemove">Remover</v-btn>
        <v-spacer />
        <v-btn text @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="onSave">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { CATEGORY_OPTIONS } from '@/shared/categories';
import type { ScheduleBlockInterface } from './interfaces/schedule-block.interface';

interface SaveBlockPayload {
  id: number | null;
  name: string;
  category: string;
  startTime: string;
  durationMinutes: number;
}

@Component
export default class ScheduleBlockFormDialogComponent extends Vue {
  @Prop({ required: true }) private value!: boolean;

  @Prop({ default: null }) private block!: ScheduleBlockInterface | null;

  private name = '';

  private category = 'other';

  private startTime = '08:00';

  private durationMinutes = 30;

  private readonly categoryOptions = CATEGORY_OPTIONS;

  private get isEditing(): boolean {
    return this.block !== null;
  }

  // Repovoa os campos locais toda vez que o diálogo abre — tanto pra criar
  // (block === null → defaults) quanto pra editar (block preenchido).
  @Watch('value')
  private onOpenChange(isOpen: boolean): void {
    if (!isOpen) return;

    this.name = this.block?.name ?? '';
    this.category = this.block?.category ?? 'other';
    this.startTime = this.block?.startTime ?? '08:00';
    this.durationMinutes = this.block?.durationMinutes ?? 30;
  }

  private close(): void {
    this.$emit('input', false);
  }

  private onSave(): void {
    const name = this.name.trim();
    if (!name) return;

    const payload: SaveBlockPayload = {
      id: this.block?.id ?? null,
      name,
      category: this.category,
      startTime: this.startTime,
      durationMinutes: this.durationMinutes,
    };
    this.$emit('save', payload);
    this.close();
  }

  private onRemove(): void {
    if (this.block) this.$emit('remove', this.block.id);
    this.close();
  }
}
</script>

<style lang="sass" scoped>
.schedule-block-form-dialog
  &__field
    margin-bottom: 16px
</style>
