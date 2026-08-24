<template>
  <v-app-bar app flat color="surface" class="nav-bar">
    <v-toolbar-title class="nav-bar__title">Minha Rotina</v-toolbar-title>
    <v-spacer />
    <v-btn text to="/dashboard" class="nav-bar__link">Início</v-btn>
    <v-btn text to="/" class="nav-bar__link">Tarefas</v-btn>
    <v-btn text to="/habitos" class="nav-bar__link">Hábitos</v-btn>
    <v-btn text to="/rotina" class="nav-bar__link">Rotina</v-btn>
    <v-btn icon :title="themeTitle" class="nav-bar__theme-btn" @click="toggleTheme">
      <v-icon>{{ themeIcon }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js';

@Component
export default class NavBarComponent extends Vue {
  private get theme(): string {
    return this.$store.getters['theme/theme'];
  }

  private get themeIcon(): string {
    return this.theme === 'dark' ? mdiWhiteBalanceSunny : mdiWeatherNight;
  }

  private get themeTitle(): string {
    return this.theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro';
  }

  private toggleTheme(): void {
    this.$store.dispatch('theme/toggleTheme');
  }
}
</script>

<style lang="sass" scoped>
.nav-bar
  &__title
    font-weight: 800

  &__link
    text-transform: none
</style>
