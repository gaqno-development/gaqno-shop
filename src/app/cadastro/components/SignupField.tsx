import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly icon?: ReactNode;
  readonly autoComplete?: string;
}

export function SignupField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  icon,
  autoComplete,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]"
      >
        {label}
      </label>
      <div className="relative mt-3 flex items-center border-b border-[var(--mist)] pb-3 transition-colors duration-300 focus-within:border-[var(--ink)]">
        {icon ? (
          <span
            aria-hidden
            className="mr-3 inline-flex h-5 w-5 items-center justify-center text-[var(--muted)]"
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border-0 bg-transparent font-display text-xl italic text-[var(--ink)] placeholder:text-[var(--muted)]/60 outline-none"
        />
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-red-700"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
