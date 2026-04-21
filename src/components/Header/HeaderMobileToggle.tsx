import { Menu, X } from "lucide-react";

interface HeaderMobileToggleProps {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function HeaderMobileToggle({ open, onToggle }: HeaderMobileToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-[var(--mist)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
