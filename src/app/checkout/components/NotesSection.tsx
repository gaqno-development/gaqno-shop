import { SectionFrame } from "./SectionFrame";

interface Props {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function NotesSection({ value, onChange }: Props) {
  return (
    <SectionFrame number="04" title="Observações" description="Algo que precisamos saber? (opcional)">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Bilhete, preferência de entrega, presente…"
        className="w-full resize-none border border-[var(--mist)] bg-transparent px-5 py-4 text-[0.95rem] text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--ink)] focus:outline-none"
      />
    </SectionFrame>
  );
}
