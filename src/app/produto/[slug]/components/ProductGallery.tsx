"use client";

import { motion, AnimatePresence } from "motion/react";
import { resolveAssetUrl } from "@/lib/api";

interface Props {
  readonly productName: string;
  readonly images: readonly string[];
  readonly selectedImage: number;
  readonly onSelect: (index: number) => void;
}

function toImageUrl(image: string | undefined): string {
  return resolveAssetUrl(image) ?? "/placeholder-product.png";
}

export function ProductGallery({
  productName,
  images,
  selectedImage,
  onSelect,
}: Props) {
  const current = images[selectedImage];

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div
        className="relative w-full overflow-hidden bg-[var(--mist)]/40 ring-1 ring-[var(--mist)]"
        style={{ aspectRatio: "4 / 5" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            referrerPolicy="no-referrer"
            src={toImageUrl(current)}
            alt={productName}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png";
            }}
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const active = selectedImage === index;
            return (
              <button
                key={index}
                onClick={() => onSelect(index)}
                aria-label={`Ver imagem ${index + 1}`}
                aria-current={active}
                className={`relative flex-shrink-0 overflow-hidden transition-all ${active ? "ring-1 ring-[var(--ink)]" : "ring-1 ring-[var(--mist)] opacity-70 hover:opacity-100"}`}
                style={{ width: 72, aspectRatio: "4 / 5" }}
              >
                <img
                  referrerPolicy="no-referrer"
                  src={toImageUrl(image)}
                  alt={`${productName} — ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
