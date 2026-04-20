import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";
import { Button } from "@gaqno-development/frontcore/components/ui/button";

interface Props {
  readonly email: string;
}

export function SignupSuccessScreen({ email }: Props) {
  const { tenant } = useTenant();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Conta criada com sucesso!</h1>
        <p className="text-gray-600 mb-6">
          Enviamos um email de verificação para {email}. Por favor, verifique
          sua caixa de entrada.
        </p>
        <Link href="/login">
          <Button style={{ backgroundColor: tenant?.primaryColor }}>
            Ir para o login
          </Button>
        </Link>
      </div>
    </div>
  );
}
