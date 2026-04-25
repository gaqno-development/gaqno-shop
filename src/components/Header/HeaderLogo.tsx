import Link from "next/link";
import { DEFAULT_STORE_BRAND_LABEL } from "@/lib/brand-defaults";

interface HeaderLogoProps {
  readonly name?: string | null;
  readonly logoUrl?: string | null;
  readonly primaryColor?: string | null;
  readonly compact?: boolean;
  readonly isBrandLoading?: boolean;
}

export function HeaderLogo({ name, logoUrl, compact, isBrandLoading }: HeaderLogoProps) {
  const label = name?.trim() || DEFAULT_STORE_BRAND_LABEL;
  const height = compact ? "h-8" : "h-10";
  const showSkeleton = Boolean(isBrandLoading && !logoUrl && !name?.trim());

  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-busy={showSkeleton}
      aria-label={
        showSkeleton
          ? "Carregando identidade da loja — voltar para a página inicial"
          : `${label} — voltar para a página inicial`
      }
    >
      {logoUrl ? (
        <img
          referrerPolicy="no-referrer"
          src={logoUrl}
          alt={label}
          className={`${height} w-auto transition-all`}
        />
      ) : showSkeleton ? (
        <span
          className={`block rounded-md bg-[var(--mist)] ${compact ? "h-7 w-28" : "h-9 w-36"} animate-pulse`}
          aria-hidden
        />
      ) : (
        <span
          className="font-display text-[1.6rem] leading-none tracking-[-0.02em] text-[var(--ink)] transition-all group-hover:text-[var(--tenant-primary)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          <em className="italic font-[450]">{label}</em>
        </span>
      )}
    </Link>
  );
}
