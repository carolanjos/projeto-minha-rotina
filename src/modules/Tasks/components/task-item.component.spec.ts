import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskItemComponent from './task-item.component.vue';
import type { TaskInterface } from './interfaces/task.interface';

// Padrão recomendado pela própria documentação do Vuetify para testes com
// @vue/test-utils (shallowMount + createLocalVue + `vuetify: new Vuetify()`).
// Um aviso benigno "Multiple instances of Vue detected" pode aparecer no
// console — é um artefato conhecido dessa combinação em ambiente Jest e não
// afeta o resultado dos testes.
const localVue = createLocalVue();
localVue.use(Vuetify);

function createTask(overrides: Partial<TaskInterface> = {}): TaskInterface {
  return {
    id: 1,
    text: 'Estudar Vue',
    completed: false,
    createdAt: new Date('2026-01-01T10:00:00'),
    priority: 'medium',
    category: 'study',
    weekDay: null,
    time: null,
    date: null,
    ...overrides,
  };
}

function createWrapper(task: TaskInterface = createTask()) {
  return shallowMount(TaskItemComponent, {
    localVue,
    vuetify: new Vuetify(),
    propsData: { task },
  });
}

describe('TaskItemComponent', () => {
  it('emits toggle with the task id', () => {
    const wrapper = createWrapper();
    (wrapper.vm as any).toggle();

    expect(wrapper.emitted('toggle')).toEqual([[1]]);
  });

  it('emits remove with the task id', () => {
    const wrapper = createWrapper();
    (wrapper.vm as any).remove();

    expect(wrapper.emitted('remove')).toEqual([[1]]);
  });

  it('emits edit only when the text actually changed', () => {
    const wrapper = createWrapper(createTask({ text: 'Original' }));
    const vm = wrapper.vm as any;

    vm.startEdit();
    vm.editText = 'Original';
    vm.save();
    expect(wrapper.emitted('edit')).toBeUndefined();

    vm.startEdit();
    vm.editText = 'Atualizado';
    vm.save();
    expect(wrapper.emitted('edit')).toEqual([[1, 'Atualizado']]);
  });

  it('does not emit edit for blank text', () => {
    const wrapper = createWrapper();
    const vm = wrapper.vm as any;

    vm.startEdit();
    vm.editText = '   ';
    vm.save();

    expect(wrapper.emitted('edit')).toBeUndefined();
  });
});
