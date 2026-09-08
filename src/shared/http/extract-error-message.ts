interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

// Formata o corpo de erro padrão do Laravel ({ message, errors }) numa
// string única, exibível direto num formulário. Cai no `fallback` pra
// qualquer coisa que não seja esse formato (rede fora do ar, etc).
export default function extractErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const data = (error as { response?: { data?: ApiErrorPayload } }).response?.data;

    if (data?.errors) {
      return Object.values(data.errors).flat().join(' ');
    }

    if (data?.message) return data.message;
  }

  return fallback;
}
