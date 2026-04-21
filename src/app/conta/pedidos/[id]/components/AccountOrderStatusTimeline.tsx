import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AccountOrderStatusHistoryEntry } from "../types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

interface Props {
  readonly history: readonly AccountOrderStatusHistoryEntry[];
}

export function AccountOrderStatusTimeline({ history }: Props) {
  if (history.length === 0) return null;
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--mist)] pb-5">
        <span className="eyebrow">Status · histórico</span>
      </div>

      <ol className="relative mt-8 space-y-8 pl-6">
        <span
          aria-hidden
          className="absolute left-[3px] top-2 bottom-2 w-px"
          style={{
            background:
              "repeating-linear-gradient(180deg, var(--ink) 0 3px, transparent 3px 8px)",
            opacity: 0.35,
          }}
        />
        {history.map((entry, index) => (
          <TimelineEntry key={index} entry={entry} isLatest={index === 0} />
        ))}
      </ol>
    </section>
  );
}

function TimelineEntry({
  entry,
  isLatest,
}: {
  readonly entry: AccountOrderStatusHistoryEntry;
  readonly isLatest: boolean;
}) {
  const label = STATUS_LABELS[entry.status] ?? entry.status;
  return (
    <li className="relative">
      <span
        aria-hidden
        className={`absolute left-[-26px] top-1.5 inline-block h-2 w-2 rounded-full ${
          isLatest ? "bg-[var(--ink)]" : "bg-[var(--mist)] ring-1 ring-[var(--ink)]/30"
        }`}
      />
      <div className="flex items-baseline justify-between gap-4">
        <span
          className="font-display text-[1.1rem] italic leading-tight text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          {label}
        </span>
        <span className="font-mono tabular text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          {format(new Date(entry.createdAt), "dd MMM · HH:mm", {
            locale: ptBR,
          })}
        </span>
      </div>
      {entry.notes ? (
        <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--ink)]/70">
          {entry.notes}
        </p>
      ) : null}
    </li>
  );
}
