interface Props {
  readonly notes: string | null;
}

export function OrderNotes({ notes }: Props) {
  if (!notes) return null;
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--mist)] pb-5">
        <span className="eyebrow">Observações</span>
      </div>
      <blockquote
        className="mt-8 border-l-2 border-[var(--ink)] pl-5 font-display text-[1.1rem] italic leading-relaxed text-[var(--ink)]/85"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        {notes}
      </blockquote>
    </section>
  );
}
