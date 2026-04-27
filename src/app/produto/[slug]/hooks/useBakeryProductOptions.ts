"use client";

import { useMemo, useState } from "react";
import { uploadStorefrontReferenceImage } from "@/lib/api";
import type { BakeryDecoration, OrderItemBakeryMeta } from "@/types/bakery";

const DEFAULT_SIZES = ["P", "M", "G"] as const;

interface UseBakeryProductOptionsArgs {
  readonly allowsReferenceImage: boolean;
  readonly availableDecorations: readonly BakeryDecoration[];
}

export function useBakeryProductOptions({
  allowsReferenceImage,
  availableDecorations,
}: UseBakeryProductOptionsArgs) {
  const [size, setSize] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [decorationQuantities, setDecorationQuantities] = useState<
    Record<string, number>
  >({});

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await uploadStorefrontReferenceImage(file);
      setReferenceImageUrl(res.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha no upload";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const setDecorationSelected = (id: string, selected: boolean) => {
    setDecorationQuantities((prev) => {
      const next = { ...prev };
      if (selected) next[id] = 1;
      else delete next[id];
      return next;
    });
  };

  const selectedDecorations = useMemo(() => {
    return Object.entries(decorationQuantities)
      .map(([id, qty]) => {
        const dec = availableDecorations.find((d) => d.id === id);
        if (!dec) return null;
        return {
          decorationId: id,
          quantity: qty,
          priceAdjustment: dec.priceAdjustment,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [decorationQuantities, availableDecorations]);

  const decorationsExtraCost = useMemo(() => {
    return selectedDecorations.reduce((acc, d) => {
      const adj = Number.parseFloat(d.priceAdjustment);
      if (Number.isFinite(adj)) return acc + adj * d.quantity;
      return acc;
    }, 0);
  }, [selectedDecorations]);

  const buildMeta = (): OrderItemBakeryMeta => ({
    size: size || undefined,
    notes: notes || undefined,
    referenceImageUrl: referenceImageUrl || undefined,
    decorations:
      selectedDecorations.length > 0 ? selectedDecorations : undefined,
  });

  return {
    sizes: DEFAULT_SIZES,
    size,
    setSize,
    notes,
    setNotes,
    allowsReferenceImage,
    referenceImageUrl,
    uploadImage,
    isUploading,
    uploadError,
    decorationQuantities,
    setDecorationSelected,
    selectedDecorations,
    decorationsExtraCost,
    buildMeta,
  };
}

export type UseBakeryProductOptionsReturn = ReturnType<
  typeof useBakeryProductOptions
>;
