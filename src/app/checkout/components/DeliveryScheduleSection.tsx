import { SectionFrame } from "./SectionFrame";

interface Props {
  readonly deliveryDate: string;
  readonly deliveryTime: string;
  readonly isPickup: boolean;
  readonly minDate: string;
  readonly minLeadDays: number;
  readonly error: string | null;
  readonly onChangeDate: (v: string) => void;
  readonly onChangeTime: (v: string) => void;
  readonly onChangeIsPickup: (v: boolean) => void;
}

export function DeliveryScheduleSection({
  deliveryDate,
  deliveryTime,
  isPickup,
  minDate,
  minLeadDays,
  error,
  onChangeDate,
  onChangeTime,
  onChangeIsPickup,
}: Props) {
  return (
    <SectionFrame number="03" title="Data de entrega">
      {minLeadDays > 0 ? (
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Antecedência mínima: {minLeadDays}{" "}
          {minLeadDays === 1 ? "dia útil" : "dias úteis"}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Data
          </label>
          <input
            type="date"
            value={deliveryDate}
            min={minDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--glass-border)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--tenant-primary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Horário preferido
          </label>
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => onChangeTime(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--glass-border)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--tenant-primary)] focus:outline-none"
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]">
        <input
          type="checkbox"
          checked={isPickup}
          onChange={(e) => onChangeIsPickup(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--glass-border)]"
        />
        <span>Retirada no local</span>
      </label>

      {error ? (
        <p className="mt-3 text-xs text-red-600">{error}</p>
      ) : null}
    </SectionFrame>
  );
}
