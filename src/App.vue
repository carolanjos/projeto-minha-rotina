<template>
  <v-app>
    <nav-bar v-if="showNav" />
    <v-main>
      <v-container class="app__container" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import NavBar from './components/nav-bar.component.vue';

@Component({
  components: { NavBar },
})
export default class App extends Vue {
  // Telas de login/cadastro (meta.guest, ver router/index.ts) não têm menu.
  private get showNav(): boolean {
    return !this.$route.meta?.guest;
  }

  private get isDark(): boolean {
    return this.$store.getters['theme/isDark'];
  }

  @Watch('isDark', { immediate: true })
  private onIsDarkChange(value: boolean): void {
    this.$vuetify.theme.dark = value;
  }
}
</script>

<style lang="sass" scoped>
.app
  &__container
    max-width: 1200px
    margin: 0
</style>
