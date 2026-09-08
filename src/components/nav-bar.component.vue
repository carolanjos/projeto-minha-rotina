<template>
  <v-navigation-drawer app permanent class="nav-bar">
    <v-list-item class="nav-bar__title-item">
      <v-list-item-title class="nav-bar__title">Minha Rotina</v-list-item-title>
    </v-list-item>

    <v-divider />

    <v-list nav dense>
      <v-list-item to="/dashboard" class="nav-bar__link">
        <v-list-item-title>Início</v-list-item-title>
      </v-list-item>
      <v-list-item to="/" class="nav-bar__link">
        <v-list-item-title>Tarefas</v-list-item-title>
      </v-list-item>
      <v-list-item to="/habitos" class="nav-bar__link">
        <v-list-item-title>Hábitos</v-list-item-title>
      </v-list-item>
      <v-list-item to="/rotina" class="nav-bar__link">
        <v-list-item-title>Rotina</v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list-item :title="themeTitle" class="nav-bar__theme-btn" @click="toggleTheme">
        <v-icon>{{ themeIcon }}</v-icon>
        <v-list-item-title class="ml-2">{{ themeTitle }}</v-list-item-title>
      </v-list-item>
      <v-list-item title="Sair" class="nav-bar__logout-btn" @click="logout">
        <v-icon>{{ mdiLogoutIcon }}</v-icon>
        <v-list-item-title class="ml-2">Sair</v-list-item-title>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiWeatherNight, mdiWhiteBalanceSunny, mdiLogout } from '@mdi/js';

@Component
export default class NavBarComponent extends Vue {
  private readonly mdiLogoutIcon = mdiLogout;

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

  private async logout(): Promise<void> {
    await this.$store.dispatch('auth/logout');
    this.$router.push('/login');
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
