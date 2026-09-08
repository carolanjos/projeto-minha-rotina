// Chave usada no localStorage pra persistir o token do Sanctum. Em módulo
// próprio (sem importar o axios) pra que quem só precisa da constante — ex.:
// store/auth/state.ts — não arraste a dependência inteira junto, o que
// quebra os testes que mockam o service mas não o api-client (axios não
// transforma bem sob Jest, ver node_modules/axios ser ESM-only).
export const TOKEN_STORAGE_KEY = 'auth_token';
