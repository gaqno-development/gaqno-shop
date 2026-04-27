import type { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly className?: string;
}

export function EditorialInput({
  label,
  value,
  onChange,
  className = "",
  ...rest
}: Props) {
  return (
    <label className={`group block ${className}`}>
      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-[var(--glass-border)] bg-transparent px-0 py-3 text-[0.95rem] text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--tenant-primary)] focus:outline-none"
      />
    </label>
  );
}
