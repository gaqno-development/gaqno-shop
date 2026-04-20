export function clampQuantityIncrement(current: number, max?: number): number {
  return max !== undefined ? Math.min(max, current + 1) : current + 1;
}

export function clampQuantityDecrement(current: number): number {
  return Math.max(1, current - 1);
}

export function canIncrementQuantity(current: number, max?: number): boolean {
  return max === undefined || current < max;
}
