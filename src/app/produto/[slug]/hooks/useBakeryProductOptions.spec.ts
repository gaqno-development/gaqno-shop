import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useBakeryProductOptions } from "./useBakeryProductOptions";
import type { BakeryDecoration } from "@/types/bakery";

vi.mock("@/lib/api", () => ({
  uploadBakeryReferenceImage: vi.fn(async (_file: File) => ({
    url: "https://cdn.test/uploaded.jpg",
  })),
}));

const decorations: BakeryDecoration[] = [
  {
    id: "d1",
    name: "Flor",
    type: "flower",
    description: null,
    priceAdjustment: "10.00",
    imageUrl: null,
    isActive: true,
  },
  {
    id: "d2",
    name: "Topo",
    type: "topper",
    description: null,
    priceAdjustment: "25.50",
    imageUrl: null,
    isActive: true,
  },
];

describe("useBakeryProductOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks size, notes and reference image", () => {
    const { result } = renderHook(() =>
      useBakeryProductOptions({
        allowsReferenceImage: true,
        availableDecorations: decorations,
      }),
    );

    act(() => {
      result.current.setSize("M");
      result.current.setNotes("sem lactose");
    });

    expect(result.current.size).toBe("M");
    expect(result.current.notes).toBe("sem lactose");
    const meta = result.current.buildMeta();
    expect(meta.size).toBe("M");
    expect(meta.notes).toBe("sem lactose");
  });

  it("selects decorations with toggle semantics and calculates extra cost", () => {
    const { result } = renderHook(() =>
      useBakeryProductOptions({
        allowsReferenceImage: false,
        availableDecorations: decorations,
      }),
    );

    act(() => {
      result.current.setDecorationSelected("d1", true);
      result.current.setDecorationSelected("d1", true);
      result.current.setDecorationSelected("d2", true);
    });

    expect(result.current.selectedDecorations).toHaveLength(2);
    expect(result.current.decorationsExtraCost).toBeCloseTo(10 + 25.5);

    act(() => {
      result.current.setDecorationSelected("d1", false);
    });
    expect(result.current.selectedDecorations).toHaveLength(1);
    expect(result.current.decorationsExtraCost).toBeCloseTo(25.5);
  });

  it("uploads reference image and stores the returned url", async () => {
    const { result } = renderHook(() =>
      useBakeryProductOptions({
        allowsReferenceImage: true,
        availableDecorations: [],
      }),
    );

    const file = new File(["x"], "cake.jpg", { type: "image/jpeg" });
    await act(async () => {
      await result.current.uploadImage(file);
    });

    expect(result.current.referenceImageUrl).toBe(
      "https://cdn.test/uploaded.jpg",
    );
    expect(result.current.uploadError).toBeNull();
  });
});
