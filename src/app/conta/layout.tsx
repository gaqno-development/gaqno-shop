"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Award,
  LogOut,
  Loader2,
} from "lucide-react";

const MENU_ITEMS = [
  { href: "/conta", label: "Dashboard", icon: User, index: "01" },
  { href: "/conta/pedidos", label: "Pedidos", icon: Package, index: "02" },
  { href: "/conta/fidelidade", label: "Fidelidade", icon: Award, index: "03" },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin, index: "04" },
  {
    href: "/conta/lista-desejos",
    label: "Favoritos",
    icon: Heart,
    index: "05",
  },
] as const;

const EASE = [0.19, 1, 0.22, 1] as const;

export default function AccountLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const sessionResult = useSession() ?? {
    data: null,
    status: "loading" as const,
  };
  const session = sessionResult.data;
  const status = sessionResult.status;
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--paper)]">
        <Loader2
          className="h-6 w-6 animate-spin text-[var(--ink)]"
          aria-hidden
        />
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    router.push("/login?callbackUrl=" + encodeURIComponent(pathname));
    return null;
  }

  return (
    <section className="relative min-h-[calc(100vh-var(--header-height,0px))] overflow-hidden bg-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="eyebrow">Minha · conta</span>
            <h2
              className="mt-4 font-display text-[2rem] leading-[0.95] tracking-[-0.02em] text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
            >
              <em className="italic">Olá</em>.
            </h2>
            <p className="mt-3 break-all font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              {session.user?.email}
            </p>

            <nav className="mt-10 border-t border-[var(--mist)]">
              <ul className="divide-y divide-[var(--mist)]">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-4 py-4 transition-colors"
                      >
                        <span
                          className={`font-mono tabular text-[0.66rem] uppercase tracking-[0.24em] ${
                            isActive
                              ? "text-[var(--ink)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {item.index}
                        </span>
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? "text-[var(--ink)]"
                              : "text-[var(--muted)] group-hover:text-[var(--ink)]"
                          }`}
                          strokeWidth={1.5}
                        />
                        <span
                          className={`flex-1 font-display text-lg italic transition-colors ${
                            isActive
                              ? "text-[var(--ink)]"
                              : "text-[var(--muted)] group-hover:text-[var(--ink)]"
                          }`}
                        >
                          {item.label}
                        </span>
                        {isActive ? (
                          <motion.span
                            layoutId="account-active-indicator"
                            className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]"
                            aria-hidden
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="group flex w-full items-center gap-4 py-4 text-left transition-colors"
                  >
                    <span className="font-mono tabular text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                      ——
                    </span>
                    <LogOut
                      className="h-4 w-4 text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]"
                      strokeWidth={1.5}
                    />
                    <span className="font-display text-lg italic text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]">
                      Sair
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="min-w-0"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </section>
  );
}
