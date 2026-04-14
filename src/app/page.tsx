"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { getProducts, getFeaturedProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
}

export default function Home() {
  const { tenant, isLoading: tenantLoading, error } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, featuredData, categoriesData] = await Promise.all([
          getProducts({ limit: "8" }),
          getFeaturedProducts(4),
          getCategories(),
        ]);

        setProducts(productsData.items || []);
        setFeaturedProducts(featuredData || []);
        setCategories(categoriesData?.slice(0, 4) || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!tenantLoading) {
      loadData();
    }
  }, [tenantLoading]);

  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 lg:py-32"
        style={{ backgroundColor: tenant?.secondaryColor || "#f3f4f6" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: tenant?.primaryColor || "#111827" }}
              >
                Bem-vindo à {tenant?.name || "nossa loja"}
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                {tenant?.description || "Encontre os melhores produtos com preços incríveis. Qualidade garantida e entrega rápida para todo o Brasil."}
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
                  style={{ borderColor: tenant?.primaryColor || "#111827", color: tenant?.primaryColor || "#111827" }}
                >
                  Ofertas
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-3xl transform rotate-3"
                  style={{ backgroundColor: tenant?.primaryColor || "#111827", opacity: 0.1 }}
                />
                <img
                  src="/hero-image.jpg"
                  alt="Produtos em destaque"
                  className="relative rounded-3xl shadow-2xl w-full object-cover aspect-square"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
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
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Frete Grátis</h3>
                <p className="text-sm text-gray-500">Para compras acima de R$ 199</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Pagamento Seguro</h3>
                <p className="text-sm text-gray-500">100% protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">7 Dias para Devolução</h3>
                <p className="text-sm text-gray-500">Satisfação garantida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Categorias</h2>
              <Link 
                href="/produtos"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/produtos?category=${category.slug}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden"
                >
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl">{category.name}</h3>
                    {category.description && (
                      <p className="text-white/80 text-sm mt-1">{category.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
              <Link 
                href="/produtos"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Todos os Produtos</h2>
            <Link 
              href="/produtos"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-gray-400 mb-8">
            Cadastre-se para receber ofertas exclusivas e novidades em primeira mão.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900"
            />
            <button
              type="submit"
              className="px-8 py-4 font-medium rounded-lg transition-colors"
              style={{ backgroundColor: tenant?.primaryColor || "#3b82f6" }}
            >
              Cadastrar
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
