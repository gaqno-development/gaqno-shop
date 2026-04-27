import {
  ORDER_STATUS_LABELS,
  TIMELINE_ACTIVE_STATUSES,
  TIMELINE_STATUSES,
  type OrderStatus,
} from "@/types/order";

function isStepReached(currentStatus: string, step: OrderStatus): boolean {
  if (step === "pending") return true;
  const currentIndex = TIMELINE_STATUSES.indexOf(currentStatus as OrderStatus);
  const stepIndex = TIMELINE_STATUSES.indexOf(step);
  if (currentIndex === -1) {
    return TIMELINE_ACTIVE_STATUSES.includes(currentStatus) && stepIndex <= 1;
  }
  return stepIndex <= currentIndex;
}

interface Props {
  readonly currentStatus: string;
}

export function OrderTimeline({ currentStatus }: Props) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between border-b border-[var(--glass-border)] pb-5">
        <span className="eyebrow">Progresso · entrega</span>
        <span className="font-mono tabular text-[0.66rem] uppercase tracking-[0.22em] text-[var(--ink)]">
          {ORDER_STATUS_LABELS[currentStatus] ?? currentStatus}
        </span>
      </div>

      <ol className="mt-10 grid grid-cols-5 gap-3">
        {TIMELINE_STATUSES.map((step, index) => {
          const reached = isStepReached(currentStatus, step);
          const isCurrent = currentStatus === step;
          return (
            <li key={step} className="relative flex flex-col gap-4">
              <div className="flex items-center">
                <span
                  aria-hidden
                  className={`inline-block h-2 w-2 rounded-full transition-colors ${
                    isCurrent
                      ? "ring-2 ring-[var(--tenant-primary)] ring-offset-2 ring-offset-[var(--paper)] bg-[var(--tenant-primary)]"
                      : reached
                        ? "bg-[var(--tenant-primary)]"
                        : "bg-[var(--glass-border)]"
                  }`}
                />
                {index < TIMELINE_STATUSES.length - 1 ? (
                  <span
                    aria-hidden
                    className="ml-2 h-px flex-1"
                    style={{
                      background: reached
                        ? "var(--tenant-primary)"
                        : "var(--glass-border)",
                      opacity: reached ? 0.35 : 1,
                    }}
                  />
                ) : null}
              </div>
              <div>
                <span className="font-mono tabular text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <p
                  className={`mt-1 font-display text-[0.95rem] italic leading-tight ${
                    reached
                      ? "text-[var(--ink)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {ORDER_STATUS_LABELS[step]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
