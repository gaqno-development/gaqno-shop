import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ORDER_STATUS_LABELS, type OrderDetail } from "@/types/order";

interface Props {
  readonly order: OrderDetail;
  readonly email: string;
}

export function OrderHeader({ order, email }: Props) {
  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;
  const backHref = email
    ? `/pedidos?email=${encodeURIComponent(email)}`
    : "/";
  return (
    <header className="border-b border-[var(--glass-border)] pb-10">
      <Link
        href={backHref}
        className="link-underline inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Voltar
      </Link>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Pedido · {order.orderNumber}</span>
          <h1
            className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
          >
            <em className="italic">
              {format(new Date(order.createdAt), "dd 'de' MMMM", {
                locale: ptBR,
              })}
            </em>
            <span className="ml-2 text-[var(--muted)]">
              · {format(new Date(order.createdAt), "yyyy")}
            </span>
          </h1>
          <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            {format(new Date(order.createdAt), "HH:mm")} · {order.items.length}{" "}
            {order.items.length === 1 ? "item" : "itens"}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 border border-[var(--glass-border)] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--tenant-primary)]" aria-hidden />
          {statusLabel}
        </span>
      </div>
    </header>
  );
}
