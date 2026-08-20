import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// NOTA: `vuetify/lib` é o build "tree-shakable" — só funciona se o
// `vuetify-loader` (plugin de webpack) estiver configurado no vue.config.js
// pra registrar sob demanda cada componente usado nos templates. Sem esse
// loader, `Vue.use(Vuetify)` a partir de `vuetify/lib` não registra nenhum
// componente e todo <v-*> vira elemento HTML desconhecido (foi exatamente
// o que quebrou o estilo da aplicação). Como o projeto não tem o loader
// configurado, importamos o build completo (`vuetify`), que já registra
// todos os componentes globalmente — mais simples e robusto, ao custo de
// um bundle um pouco maior (aceitável pro tamanho deste app).
Vue.use(Vuetify);

// Paleta customizada do app (não é o tema padrão do Vuetify). Como este é um
// projeto pessoal sem necessidade de white-label, as cores são fixadas
// diretamente aqui, com tokens nomeados semanticamente, em vez de
// parametrizadas por tenant/cliente.
export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#4ecdc4',
        error: '#ff6b6b',
        info: '#4ecdc4',
        success: '#4ecdc4',
        warning: '#e0a800',
        background: '#fdf6ec',
        surface: '#ffffff',
      },
      dark: {
        primary: '#ff8787',
        secondary: '#5eead4',
        accent: '#5eead4',
        error: '#ff8787',
        info: '#5eead4',
        success: '#5eead4',
        warning: '#ffe066',
        background: '#1a1a2e',
        surface: '#23233b',
      },
    },
  },
});
