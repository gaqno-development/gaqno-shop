import { Loader2, Lock, Mail, Phone } from "lucide-react";
import { Button } from "@gaqno-development/frontcore/components/ui/button";
import { useTenant } from "@/contexts/tenant-context";
import type { SignupFormData, SignupFormErrors } from "../types";
import { SignupField } from "./SignupField";

interface Props {
  readonly data: SignupFormData;
  readonly errors: SignupFormErrors;
  readonly isLoading: boolean;
  readonly onChange: (partial: Partial<SignupFormData>) => void;
  readonly onSubmit: (event: React.FormEvent) => void;
}

export function SignupForm({
  data,
  errors,
  isLoading,
  onChange,
  onSubmit,
}: Props) {
  const { tenant } = useTenant();
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SignupField
            id="firstName"
            label="Nome"
            placeholder="João"
            value={data.firstName}
            onChange={(firstName) => onChange({ firstName })}
            error={errors.firstName}
          />
          <SignupField
            id="lastName"
            label="Sobrenome"
            placeholder="Silva"
            value={data.lastName}
            onChange={(lastName) => onChange({ lastName })}
            error={errors.lastName}
          />
        </div>
        <SignupField
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="h-5 w-5" />}
          value={data.email}
          onChange={(email) => onChange({ email })}
          error={errors.email}
        />
        <SignupField
          id="phone"
          label="Telefone (opcional)"
          type="tel"
          placeholder="(11) 99999-9999"
          icon={<Phone className="h-5 w-5" />}
          value={data.phone}
          onChange={(phone) => onChange({ phone })}
        />
        <SignupField
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5" />}
          value={data.password}
          onChange={(password) => onChange({ password })}
          error={errors.password}
        />
        <SignupField
          id="confirmPassword"
          label="Confirmar Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5" />}
          value={data.confirmPassword}
          onChange={(confirmPassword) => onChange({ confirmPassword })}
          error={errors.confirmPassword}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        style={{ backgroundColor: tenant?.primaryColor }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  );
}
