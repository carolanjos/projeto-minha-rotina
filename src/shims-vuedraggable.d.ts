// `vuedraggable` (wrapper Vue2 do SortableJS) não publica `.d.ts` próprio e
// não há `@types/vuedraggable` mantido — sem este shim o type-check do
// `vue-cli-service` (fork-ts-checker) falha com TS2307 ao importar o pacote.
declare module 'vuedraggable';
