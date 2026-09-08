import type { Habit } from '@/modules/Habits/components/entities/habit.entity';

export interface HabitsState {
  habits: Habit[];
}

// Populado via a action `fetchHabits` (ver actions.ts), disparada no
// created() da tela que precisa dos dados — não mais síncrono/localStorage.
export default (): HabitsState => ({
  habits: [],
});
