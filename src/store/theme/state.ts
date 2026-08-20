export type ThemeName = 'light' | 'dark';

export interface ThemeState {
  theme: ThemeName;
}

const STORAGE_KEY = 'theme';

function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);

  let theme: ThemeName;
  if (stored === 'light' || stored === 'dark') {
    theme = stored;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  // Aplica o atributo assim que o store é criado, reproduzindo o
  // comportamento do antigo composable useTheme (watchEffect síncrono
  // no import), para evitar flash de tema incorreto.
  document.documentElement.setAttribute('data-theme', theme);

  return theme;
}

export default (): ThemeState => ({
  theme: getInitialTheme(),
});
