import type { BakeryDecoration } from "@/types/bakery";

export function filterBakeryDecorationsForProduct(
  allDecorations: readonly BakeryDecoration[],
  enabledCustomizationTypeIds: readonly string[] | undefined | null,
): readonly BakeryDecoration[] {
  if (
    enabledCustomizationTypeIds === undefined ||
    enabledCustomizationTypeIds === null ||
    enabledCustomizationTypeIds.length === 0
  ) {
    return allDecorations;
  }
  return allDecorations.filter(
    (d) =>
      d.customizationTypeId !== null &&
      enabledCustomizationTypeIds.includes(d.customizationTypeId),
  );
}
