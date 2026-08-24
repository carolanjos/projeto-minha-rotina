import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import ScheduleBlockCardComponent from './schedule-block-card.component.vue';
import type { ScheduleBlockInterface } from '../interfaces/schedule-block.interface';

const localVue = createLocalVue();
localVue.use(Vuetify);

function createBlock(overrides: Partial<ScheduleBlockInterface> = {}): ScheduleBlockInterface {
  return {
    id: 1,
    name: 'Corrida matinal',
    category: 'health',
    startTime: '07:00',
    durationMinutes: 30,
    order: 0,
    ...overrides,
  };
}

function createWrapper(propsData: Record<string, unknown>) {
  return shallowMount(ScheduleBlockCardComponent, {
    localVue,
    vuetify: new Vuetify(),
    propsData,
  });
}

describe('ScheduleBlockCardComponent', () => {
  it('renders the block name, time and duration/category meta', () => {
    const wrapper = createWrapper({ block: createBlock(), isCurrent: false });

    expect(wrapper.text()).toContain('Corrida matinal');
    expect(wrapper.text()).toContain('07:00');
    expect(wrapper.text()).toContain('30 min');
    expect(wrapper.text()).toContain('Saúde');
  });

  it('applies the --current modifier class when isCurrent is true', () => {
    const wrapper = createWrapper({ block: createBlock(), isCurrent: true });

    expect(wrapper.classes()).toContain('schedule-block-card--current');
  });

  it('falls back to the "other" icon/label for an unknown category', () => {
    const wrapper = createWrapper({ block: createBlock({ category: 'unknown' }), isCurrent: false });

    expect(wrapper.text()).toContain('unknown');
  });
});
