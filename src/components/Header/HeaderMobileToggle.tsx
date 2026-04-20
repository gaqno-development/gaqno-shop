import { Menu, X } from "lucide-react";

interface HeaderMobileToggleProps {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function HeaderMobileToggle({ open, onToggle }: HeaderMobileToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 text-gray-700"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
    >
      {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}
