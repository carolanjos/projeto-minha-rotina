<template>
  <v-card
    class="task-item"
    :class="[`task-item--priority-${task.priority}`, { 'task-item--completed': task.completed }]"
    flat
  >
    <v-card-text class="task-item__content">
      <v-checkbox
        class="task-item__checkbox"
        :input-value="task.completed"
        hide-details
        @change="toggle"
      />

      <div class="task-item__body">
        <v-text-field
          v-if="isEditing"
          ref="editInput"
          v-model="editText"
          dense
          hide-details
          class="task-item__edit"
          @keyup.enter="save"
          @keyup.esc="cancel"
          @blur="save"
        />
        <span
          v-else
          class="task-item__text"
          :class="{ 'task-item__text--completed': task.completed }"
        >{{ task.text }}</span>

        <div class="task-item__meta">
          <v-chip small :color="priorityColor" text-color="white" class="task-item__badge">
            {{ priorityLabel }}
          </v-chip>
          <v-chip small color="secondary" text-color="white" class="task-item__badge">
            {{ categoryLabel }}
          </v-chip>
          <v-chip
            v-if="task.weekDay !== null || task.time"
            small
            outlined
            class="task-item__badge"
          >
            {{ scheduleLabel }}
          </v-chip>
        </div>
      </div>

      <v-btn
        v-if="!isEditing"
        icon
        small
        title="Editar tarefa"
        class="task-item__edit-btn"
        @mousedown.prevent="startEdit"
      >
        <v-icon small>{{ mdiPencilIcon }}</v-icon>
      </v-btn>
      <v-btn icon small title="Remover tarefa" class="task-item__remove-btn" @click="remove">
        <v-icon small>{{ mdiCloseIcon }}</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mdiPencil, mdiClose } from '@mdi/js';
import type { TaskInterface, TaskPriority } from './interfaces/task.interface';

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'secondary',
  medium: 'warning',
  high: 'primary',
};

const CATEGORY_LABELS: Record<string, string> = {
  work: 'Trabalho',
  home: 'Casa',
  health: 'Saúde',
  study: 'Estudo',
  personal: 'Pessoal',
  other: 'Outro',
};

@Component
export default class TaskItemComponent extends Vue {
  @Prop({ required: true }) private task!: TaskInterface;

  private isEditing = false;

  private editText = '';

  private readonly mdiPencilIcon = mdiPencil;

  private readonly mdiCloseIcon = mdiClose;

  private get priorityLabel(): string {
    return PRIORITY_LABELS[this.task.priority] ?? this.task.priority;
  }

  private get priorityColor(): string {
    return PRIORITY_COLORS[this.task.priority] ?? 'primary';
  }

  private get categoryLabel(): string {
    return CATEGORY_LABELS[this.task.category] ?? this.task.category;
  }

  private get scheduleLabel(): string {
    const day = this.task.weekDay !== null ? DAY_NAMES[this.task.weekDay] : '';
    const time = this.task.time ?? '';
    return [day, time].filter(Boolean).join(' ');
  }

  private toggle(): void {
    this.$emit('toggle', this.task.id);
  }

  private remove(): void {
    this.$emit('remove', this.task.id);
  }

  private startEdit(): void {
    this.editText = this.task.text;
    this.isEditing = true;

    this.$nextTick(() => {
      const input = this.$refs.editInput as Vue & { focus?: () => void };
      if (input?.focus) input.focus();
    });
  }

  private save(): void {
    if (!this.isEditing) return;
    const text = this.editText.trim();
    if (text && text !== this.task.text) {
      this.$emit('edit', this.task.id, text);
    }
    this.isEditing = false;
  }

  private cancel(): void {
    this.isEditing = false;
  }
}
</script>

<style lang="sass" scoped>
.task-item
  margin-bottom: 10px
  border-left: 5px solid transparent

  &--priority-low
    border-left-color: var(--v-secondary-base)

  &--priority-medium
    border-left-color: var(--v-warning-base)

  &--priority-high
    border-left-color: var(--v-primary-base)

  &__content
    display: flex
    align-items: center
    gap: 12px

  &__checkbox
    flex-shrink: 0
    margin-top: 0
    padding-top: 0

  &__body
    flex: 1
    display: flex
    flex-direction: column
    gap: 6px
    min-width: 0

  &__text
    font-size: 15px

    &--completed
      text-decoration: line-through
      opacity: 0.5

  &__meta
    display: flex
    gap: 6px
    flex-wrap: wrap

  &__badge
    text-transform: capitalize
</style>
