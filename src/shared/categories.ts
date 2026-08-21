import {
  mdiBriefcaseOutline,
  mdiHomeOutline,
  mdiHeartPulse,
  mdiBookOpenVariant,
  mdiAccountOutline,
  mdiDotsHorizontal,
} from '@mdi/js';

// Taxonomia de categoria compartilhada entre Tasks e Schedule — antes vivia
// duplicada em Tasks.vue (`categoryOptions`) e em task-item.component.vue
// (`CATEGORY_LABELS`), cada uma com os mesmos 6 valores digitados à mão.
export interface CategoryOption {
  text: string;
  value: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { text: 'Trabalho', value: 'work' },
  { text: 'Casa', value: 'home' },
  { text: 'Saúde', value: 'health' },
  { text: 'Estudo', value: 'study' },
  { text: 'Pessoal', value: 'personal' },
  { text: 'Outro', value: 'other' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  work: 'Trabalho',
  home: 'Casa',
  health: 'Saúde',
  study: 'Estudo',
  personal: 'Pessoal',
  other: 'Outro',
};

// Ícone derivado da categoria — evita um campo `icon` redundante em
// ScheduleBlock (ou em Task) que pudesse divergir da própria categoria.
export const CATEGORY_ICONS: Record<string, string> = {
  work: mdiBriefcaseOutline,
  home: mdiHomeOutline,
  health: mdiHeartPulse,
  study: mdiBookOpenVariant,
  personal: mdiAccountOutline,
  other: mdiDotsHorizontal,
};
