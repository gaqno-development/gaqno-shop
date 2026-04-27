import { useMemo } from "react";
import { ArrowRight, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from "../types";
import type { SignupFormData, SignupFormErrors } from "../types";
import { SignupField } from "./SignupField";

interface Props {
  readonly data: SignupFormData;
  readonly errors: SignupFormErrors;
  readonly isLoading: boolean;
  readonly onChange: (partial: Partial<SignupFormData>) => void;
  readonly onSubmit: (event: React.FormEvent) => void;
}

interface Section {
  readonly index: string;
  readonly title: string;
  readonly completed: boolean;
}

function useProgress(data: SignupFormData): {
  readonly percent: number;
  readonly sections: readonly Section[];
} {
  return useMemo(() => {
    const nameFilled = data.firstName.trim().length > 0 && data.lastName.trim().length > 0;
    const emailFilled = EMAIL_PATTERN.test(data.email);
    const passFilled =
      data.password.length >= MIN_PASSWORD_LENGTH &&
      data.confirmPassword === data.password;

    const sections: readonly Section[] = [
      { index: "01", title: "Identidade", completed: nameFilled },
      { index: "02", title: "Contato", completed: emailFilled },
      { index: "03", title: "Segurança", completed: passFilled },
    ];

    const completedCount = sections.filter((section) => section.completed).length;
    const percent = Math.round((completedCount / sections.length) * 100);

    return { percent, sections };
  }, [data]);
}

export function SignupForm({
  data,
  errors,
  isLoading,
  onChange,
  onSubmit,
}: Props) {
  const { percent, sections } = useProgress(data);

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
      onSubmit={onSubmit}
      noValidate
      className="relative glass-card p-8"
    >
      <ProgressHint percent={percent} sections={sections} />

      <section className="mt-10 space-y-8">
        <SectionHeader index="01" title="Identidade" hint="Como devemos te chamar" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SignupField
            id="firstName"
            label="Nome"
            placeholder="João"
            autoComplete="given-name"
            icon={<User className="h-4 w-4" strokeWidth={1.5} />}
            value={data.firstName}
            onChange={(firstName) => onChange({ firstName })}
            error={errors.firstName}
          />
          <SignupField
            id="lastName"
            label="Sobrenome"
            placeholder="Silva"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(lastName) => onChange({ lastName })}
            error={errors.lastName}
          />
        </div>
      </section>

      <Divider />

      <section className="space-y-8">
        <SectionHeader
          index="02"
          title="Contato"
          hint="Para confirmação e atualizações"
        />
        <div className="space-y-6">
          <SignupField
            id="email"
            label="Email"
            type="email"
            placeholder="voce@dominio.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
            value={data.email}
            onChange={(email) => onChange({ email })}
            error={errors.email}
          />
          <SignupField
            id="phone"
            label="Telefone (opcional)"
            type="tel"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
            value={data.phone}
            onChange={(phone) => onChange({ phone })}
          />
        </div>
      </section>

      <Divider />

      <section className="space-y-8">
        <SectionHeader
          index="03"
          title="Segurança"
          hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
        />
        <div className="space-y-6">
          <SignupField
            id="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
            value={data.password}
            onChange={(password) => onChange({ password })}
            error={errors.password}
          />
          <SignupField
            id="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" strokeWidth={1.5} />}
            value={data.confirmPassword}
            onChange={(confirmPassword) => onChange({ confirmPassword })}
            error={errors.confirmPassword}
          />
        </div>
      </section>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileTap={{ scale: 0.98 }}
        className="btn-ink group mt-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Criando conta
          </>
        ) : (
          <>
            Criar conta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>

      <p className="mt-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        Ao criar sua conta você concorda com nossos termos
      </p>
    </motion.form>
  );
}

function SectionHeader({
  index,
  title,
  hint,
}: {
  readonly index: string;
  readonly title: string;
  readonly hint: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-mono tabular text-[0.68rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          {index}
        </span>
        <h3
          className="font-display text-[1.6rem] leading-none tracking-[-0.02em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          <em className="italic">{title}</em>
        </h3>
      </div>
      <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)] sm:inline">
        {hint}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="my-10 h-px w-full"
      style={{
        background:
          "repeating-linear-gradient(90deg, var(--ink) 0 4px, transparent 4px 10px)",
        opacity: 0.35,
      }}
    />
  );
}

function ProgressHint({
  percent,
  sections,
}: {
  readonly percent: number;
  readonly sections: readonly Section[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="eyebrow">Progresso</span>
        <motion.span
          key={percent}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono tabular text-[0.7rem] uppercase tracking-[0.24em] text-[var(--ink)]"
        >
          {percent.toString().padStart(2, "0")}%
        </motion.span>
      </div>
      <div className="mt-3 h-px w-full bg-[var(--glass-border)]">
        <motion.div
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="h-px bg-[var(--tenant-primary)]"
        />
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        <AnimatePresence initial={false}>
          {sections.map((section) => (
            <motion.li
              key={section.index}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: section.completed ? 1 : 0.6 }}
              className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.22em]"
            >
              <span
                aria-hidden
                className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                  section.completed ? "bg-[var(--tenant-primary)]" : "bg-[var(--glass-border)]"
                }`}
              />
              <span className="tabular text-[var(--muted)]">{section.index}</span>
              <span className="text-[var(--ink)]/80">{section.title}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
