import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";

export function SignupHeader() {
  const { tenant } = useTenant();
  return (
    <div className="text-center">
      <h1
        className="text-3xl font-bold"
        style={{ color: tenant?.primaryColor }}
      >
        Criar Conta
      </h1>
      <p className="mt-2 text-gray-600">Junte-se à {tenant?.name}</p>
    </div>
  );
}

export function SignupFooter() {
  const { tenant } = useTenant();
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium hover:underline"
          style={{ color: tenant?.primaryColor }}
        >
          Faça login
        </Link>
      </p>
    </div>
  );
}

export function SignupErrorBanner({ message }: { readonly message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {message}
    </div>
  );
}
