<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="sass">
.app
  max-width: 800px
  margin: 0 auto
  padding: 24px 16px
</style>
