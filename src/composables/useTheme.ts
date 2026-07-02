import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme'
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const theme = ref<'light' | 'dark'>(
  (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark') ?? (prefersDark ? 'dark' : 'light'),
)

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
