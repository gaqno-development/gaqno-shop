export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function formatFreightOrFree(value: number): string {
  return value === 0 ? "Grátis" : formatBRL(value);
}
