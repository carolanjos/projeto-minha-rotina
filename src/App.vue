<template>
  <div class="app">
    <button
      class="theme-toggle"
      :title="theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'"
      @click="toggleTheme"
    >
      {{ theme === 'dark' ? '☀️' : '🌙' }}
    </button>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from './composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  position: relative;
}
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px var(--color-shadow);
}
</style>
