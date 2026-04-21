import Link from "next/link";

interface HeaderLogoProps {
  readonly name?: string | null;
  readonly logoUrl?: string | null;
  readonly primaryColor?: string | null;
  readonly compact?: boolean;
}

export function HeaderLogo({ name, logoUrl, compact }: HeaderLogoProps) {
  const label = name ?? "Gaqno Shop";
  const height = compact ? "h-8" : "h-10";

  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={`${label} — voltar para a página inicial`}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={label} className={`${height} w-auto transition-all`} />
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
