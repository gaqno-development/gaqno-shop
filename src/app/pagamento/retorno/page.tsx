"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MP_CHECKOUT_RETURN_EMAIL_KEY,
  MP_CHECKOUT_RETURN_ORDER_KEY,
  getPaymentStatus,
  setShopTenantSlug,
} from "@/lib/api";

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hint, setHint] = useState("Confirmando pagamento…");

  useEffect(() => {
    const order = searchParams.get("order") ?? "";
    const tenant = searchParams.get("tenant");
    if (tenant) {
      setShopTenantSlug(tenant);
    }
    let cancelled = false;

    async function run() {
      if (!order) {
        router.replace("/checkout");
        return;
      }
      const emailStored =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem(MP_CHECKOUT_RETURN_EMAIL_KEY)
          : null;
      for (let i = 0; i < 20; i += 1) {
        if (cancelled) return;
        try {
          const st = (await getPaymentStatus(order)) as { paymentStatus?: string };
          const s = String(st?.paymentStatus ?? "").toLowerCase();
          if (s === "approved" || s === "authorized") {
            setHint("Pagamento confirmado.");
            const email = emailStored ?? searchParams.get("email") ?? "";
            try {
              window.sessionStorage.removeItem(MP_CHECKOUT_RETURN_EMAIL_KEY);
              window.sessionStorage.removeItem(MP_CHECKOUT_RETURN_ORDER_KEY);
            } catch {}
            const q = email ? `?email=${encodeURIComponent(email)}` : "";
            router.replace(`/pedido/${encodeURIComponent(order)}${q}`);
            return;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 1200));
      }
      setHint("Processamento em andamento. Use o e-mail do pedido para consultar o status.");
      router.replace(`/pedido/${encodeURIComponent(order)}`);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center font-mono text-[0.72rem] uppercase tracking-[0.26em] text-[var(--muted)]">
      {hint}
    </div>
  );
}

export default function PagamentoRetornoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-6 py-24 text-center font-mono text-[0.72rem] uppercase tracking-[0.26em] text-[var(--muted)]">
          Carregando<span className="ml-1">…</span>
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
