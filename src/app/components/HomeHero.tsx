import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";

export function HomeHero() {
  const { tenant } = useTenant();
  return (
    <section
      className="relative py-20 lg:py-32"
      style={{ backgroundColor: tenant?.secondaryColor || "#f3f4f6" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <HeroCopy />
          <HeroArt />
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  const { tenant } = useTenant();
  return (
    <div>
      <h1
        className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
        style={{ color: tenant?.primaryColor || "#111827" }}
      >
        Bem-vindo à {tenant?.name || "nossa loja"}
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg">
        {tenant?.description ||
          "Encontre os melhores produtos com preços incríveis. Qualidade garantida e entrega rápida para todo o Brasil."}
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
        >
          Ver Produtos
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 font-medium rounded-lg transition-colors hover:bg-gray-100"
          style={{
            borderColor: tenant?.primaryColor || "#111827",
            color: tenant?.primaryColor || "#111827",
          }}
        >
          Ofertas
        </Link>
      </div>
    </div>
  );
}

function HeroArt() {
  const { tenant } = useTenant();
  return (
    <div className="hidden lg:block">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-3xl transform rotate-3"
          style={{
            backgroundColor: tenant?.primaryColor || "#111827",
            opacity: 0.1,
          }}
        />
        <img
          src="/hero-image.jpg"
          alt="Produtos em destaque"
          className="relative rounded-3xl shadow-2xl w-full object-cover aspect-square"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-2xl">4.9</p>
              <p className="text-sm text-gray-500">Avaliação dos clientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
