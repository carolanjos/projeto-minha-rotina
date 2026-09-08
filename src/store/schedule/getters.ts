import type { ScheduleBlock } from '@/modules/Schedule/components/entities/schedule-block.entity';
import type { SchedulePeriod } from '@/modules/Schedule/components/interfaces/schedule-block.interface';
import type { ScheduleState } from './state';

// Período é DERIVADO do horário, nunca armazenado — mesma lógica aplicada ao
// ícone (derivado da categoria, ver src/shared/categories.ts) pra não
// duplicar conceito e evitar um bloco com period/startTime inconsistentes
// entre si. Faixas: madrugada conta como manhã (não há blocos cruzando
// meia-noite neste domínio).
export function periodFromTime(startTime: string): SchedulePeriod {
  const [hours] = startTime.split(':').map(Number);
  if (hours < 12) return 'morning';
  if (hours < 18) return 'afternoon';
  return 'evening';
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function sortByOrder(blocks: ScheduleBlock[]): ScheduleBlock[] {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export default {
  // Timeline do Dashboard: todos os blocos, ordenados cronologicamente
  // (independente do `order` manual de cada período).
  timeline: (state: ScheduleState): ScheduleBlock[] => [...state.blocks].sort(
    (a, b) => a.startTime.localeCompare(b.startTime),
  ),

  // Blocos do período ativo na tela de Rotina, ordenados pelo `order`
  // manual (resultado do drag-and-drop), não pelo horário.
  blocksByPeriod: (state: ScheduleState) => (
    period: SchedulePeriod,
  ): ScheduleBlock[] => sortByOrder(
    state.blocks.filter((block) => periodFromTime(block.startTime) === period),
  ),

  // Id do bloco "atual": o intervalo [startTime, startTime + duração)
  // contém o horário agora. Se dois blocos se sobrepõem, vence o primeiro
  // encontrado (dado de entrada não deveria ter overlaps, mas não
  // validamos isso aqui).
  currentBlockId: (state: ScheduleState): number | null => {
    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    const current = state.blocks.find((block) => {
      const start = toMinutes(block.startTime);
      const end = start + block.durationMinutes;
      return minutesNow >= start && minutesNow < end;
    });

    return current ? current.id : null;
  },
};
