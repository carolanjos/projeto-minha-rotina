module.exports = {
  transpileDependencies: true,
  css: {
    loaderOptions: {
      // NOTA: o guia usa `prependData`, nome da opção nas versões antigas do
      // sass-loader (<= 10). Este projeto usa @vue/cli-service ^5, que traz
      // sass-loader ^12, onde a mesma opção foi renomeada para
      // `additionalData` (prependData foi removida do schema). Divergência
      // documentada; o efeito (importar as variáveis globais em todo
      // .sass/.vue) é idêntico.
      sass: {
        additionalData: '@import "~@/assets/style/global/variables.sass"\n',
      },
    },
  },
};
