"use client";

import Link from "next/link";
import { Store, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useAuthNav } from "@/hooks/useAuthNav";

const DEFAULT_BRAND_COLOR = "#fff";

export function Footer() {
  const { tenant } = useTenant();
  const { showOrdersLink, ordersHref } = useAuthNav();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Store
                className="h-6 w-6"
                style={{ color: tenant?.primaryColor ?? DEFAULT_BRAND_COLOR }}
              />
              <h3 className="text-lg font-bold">
                {tenant?.name ?? "Gaqno Shop"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              {tenant?.description ??
                "Sua loja online com os melhores produtos."}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos"
                  className="hover:text-white transition-colors"
                >
                  Produtos
                </Link>
              </li>
              {showOrdersLink && (
                <li>
                  <Link
                    href={ordersHref}
                    className="hover:text-white transition-colors"
                  >
                    Meus Pedidos
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contato@{tenant?.slug ?? "loja"}.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                São Paulo, SP
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} {tenant?.name ?? "Gaqno Shop"}. Todos
            os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
