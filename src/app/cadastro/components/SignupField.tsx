import type { ReactNode } from "react";
import { Input } from "@gaqno-development/frontcore/components/ui/input";
import { Label } from "@gaqno-development/frontcore/components/ui/label";

interface Props {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly icon?: ReactNode;
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
}: Props) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={icon ? "pl-10" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
