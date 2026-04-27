"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useAuthNav } from "@/hooks/useAuthNav";
import { DEFAULT_STORE_BRAND_LABEL } from "@/lib/brand-defaults";

const FOOTER_SECTIONS = [
  {
    eyebrow: "Catálogo",
    links: [
      { href: "/", label: "Início" },
      { href: "/produtos", label: "Todos os produtos" },
      { href: "/produtos?ordering=new", label: "Novidades" },
    ],
  },
  {
    eyebrow: "Ajuda",
    links: [
      { href: "/conta", label: "Minha conta" },
      { href: "/conta/pedidos", label: "Pedidos" },
      { href: "/produtos", label: "Política de trocas" },
    ],
  },
] as const;

export function Footer() {
  const { tenant } = useTenant();
  const { showOrdersLink, ordersHref } = useAuthNav();
  const brand = tenant?.name?.trim() || DEFAULT_STORE_BRAND_LABEL;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[var(--paper)] text-[var(--ink)] border-t border-[var(--glass-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-[0.25]"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--glass-surface)] backdrop-blur-sm"
      />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <span className="eyebrow text-[var(--muted)]">Boutique desde {year}</span>
            <h3
              className="font-display text-5xl leading-[0.95] tracking-[-0.03em]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              <em className="italic font-[420]">{brand}.</em>
            </h3>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-[var(--ink)]/60">
              {tenant?.description ??
                "Curadoria cuidadosa, atendimento por quem acredita no detalhe."}
            </p>
            {showOrdersLink && (
              <Link
                href={ordersHref}
                className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink)]/70 hover:text-[var(--tenant-primary)]"
              >
                Acompanhar pedido
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.eyebrow} className="space-y-5">
              <span className="eyebrow text-[var(--muted)]">{section.eyebrow}</span>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[0.95rem] text-[var(--ink)]/70 transition-colors hover:text-[var(--tenant-primary)]"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5">
            <span className="eyebrow text-[var(--muted)]">Redes</span>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--ink)]/70 transition-all hover:border-[var(--tenant-primary)] hover:bg-[var(--glass-highlight)] hover:text-[var(--tenant-primary)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              contato@{tenant?.slug ?? "loja"}.com.br
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-[var(--glass-border)] pt-6 text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">
            © {year} {brand}
          </span>
          <span className="font-mono">Feito com cuidado · São Paulo</span>
        </div>
      </div>
    </footer>
  );
}
