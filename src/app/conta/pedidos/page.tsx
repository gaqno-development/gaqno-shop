"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2, Package } from "lucide-react";
import { formatBRL } from "@/lib/formatters";
import { useMyOrders, type MyOrderRow } from "./hooks/useMyOrders";

const EASE = [0.19, 1, 0.22, 1] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_TONE: Record<string, string> = {
  pending: "text-amber-700",
  confirmed: "text-[var(--ink)]",
  processing: "text-[var(--ink)]",
  shipped: "text-[var(--ink)]",
  delivered: "text-emerald-700",
  cancelled: "text-red-700",
  refunded: "text-red-700",
};

export default function OrdersPage() {
  const { orders, isLoading, error, pagination, setPage } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--ink)]" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <OrdersHeader total={pagination.total} />

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-[var(--mist)] bg-[var(--paper-soft)] px-4 py-3 text-sm text-[var(--muted)]"
        >
          {error}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <ul className="divide-y divide-[var(--mist)] border-y border-[var(--mist)]">
            <AnimatePresence initial={false}>
              {orders.map((order, index) => (
                <OrderRow key={order.id} order={order} delay={index * 0.04} />
              ))}
            </AnimatePresence>
          </ul>
          {pagination.totalPages > 1 ? (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={setPage}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function OrdersHeader({ total }: { readonly total: number }) {
  return (
    <header className="border-b border-[var(--mist)] pb-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Meus · pedidos</span>
          <h1
            className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
          >
            Seu <em className="italic">histórico</em>.
          </h1>
        </div>
        <span className="font-mono tabular text-sm text-[var(--muted)]">
          {total.toString().padStart(2, "0")}{" "}
          {total === 1 ? "pedido" : "pedidos"}
        </span>
      </div>
    </header>
  );
}

function OrderRow({
  order,
  delay,
}: {
  readonly order: MyOrderRow;
  readonly delay: number;
}) {
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const statusTone = STATUS_TONE[order.status] ?? "text-[var(--ink)]";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="py-8"
    >
      <Link
        href={`/conta/pedidos/${order.id}`}
        className="group grid grid-cols-1 items-start gap-6 md:grid-cols-[1.6fr_1fr_auto] md:items-center md:gap-10"
      >
        <div className="min-w-0">
          <div className="flex items-baseline gap-4">
            <span className="font-mono tabular text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)]">
              {order.orderNumber}
            </span>
            <span
              className={`font-mono text-[0.66rem] uppercase tracking-[0.22em] ${statusTone}`}
            >
              · {statusLabel}
            </span>
          </div>
          <p
            className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-[var(--ink)] transition-colors group-hover:text-[var(--tenant-primary)]"
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
          </p>
          <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            {order.items} {order.items === 1 ? "item" : "itens"}
          </p>
        </div>

        <div className="md:text-right">
          <span className="eyebrow">Total</span>
          <p className="mt-2 font-mono tabular text-xl text-[var(--ink)]">
            {formatBRL(Number.parseFloat(order.total))}
          </p>
        </div>

        <span className="link-underline font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--ink)]">
          Ver detalhes
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.li>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  readonly page: number;
  readonly totalPages: number;
  readonly onChange: (next: number) => void;
}) {
  return (
    <nav className="flex items-center justify-between border-t border-[var(--mist)] pt-8">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="link-underline font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="font-mono tabular text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)]">
        {page.toString().padStart(2, "0")} / {totalPages.toString().padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="link-underline font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima →
      </button>
    </nav>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-col items-center gap-6 px-6 py-20 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full ring-1 ring-[var(--mist)]">
        <Package className="h-6 w-6 text-[var(--muted)]" strokeWidth={1.2} />
      </div>
      <h3
        className="font-display text-3xl italic leading-tight tracking-[-0.02em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        Nenhum pedido ainda.
      </h3>
      <p className="max-w-sm text-[0.98rem] leading-relaxed text-[var(--muted)]">
        Quando você finalizar sua primeira compra, ela aparecerá aqui com todo
        o histórico e status.
      </p>
      <Link href="/produtos" className="btn-ink group mt-2">
        Começar a comprar
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
