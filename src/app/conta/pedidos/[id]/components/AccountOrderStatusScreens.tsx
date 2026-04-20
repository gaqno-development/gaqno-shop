import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@gaqno-development/frontcore/components/ui/button";
import { useTenant } from "@/contexts/tenant-context";

export function AccountOrderLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export function AccountOrderNotFound() {
  const { tenant } = useTenant();
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
      <Link href="/conta/pedidos">
        <Button
          className="mt-4"
          style={{ backgroundColor: tenant?.primaryColor }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos pedidos
        </Button>
      </Link>
    </div>
  );
}
