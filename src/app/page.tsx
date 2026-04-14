"use client";

import { useEffect, useState } from "react";
import { useTenant } from "@/contexts/tenant-context";
import { getProducts, getFeaturedProducts } from "@/lib/api";
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

export default function Home() {
  const { tenant, isLoading: tenantLoading, error } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const [productsData, featuredData] = await Promise.all([
          getProducts({ limit: "12" }),
          getFeaturedProducts(4),
        ]);

        setProducts(productsData.items || []);
        setFeaturedProducts(featuredData || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!tenantLoading) {
      loadProducts();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="shadow-sm"
        style={{ backgroundColor: tenant?.bgColor || "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {tenant?.logoUrl ? (
                <img 
                  src={tenant.logoUrl} 
                  alt={tenant.name}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: tenant?.primaryColor || "#111827" }}
                >
                  {tenant?.name || "Gaqno Shop"}
                </h1>
              )}
            </div>
            <nav className="flex gap-6">
              <a 
                href="/" 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Início
              </a>
              <a 
                href="/produtos" 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Produtos
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-16"
        style={{ backgroundColor: tenant?.secondaryColor || "#f3f4f6" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: tenant?.primaryColor || "#111827" }}
          >
            Bem-vindo à {tenant?.name || "nossa loja"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tenant?.description || "Encontre os melhores produtos com preços incríveis."}
          </p>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Destaques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Todos os Produtos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {tenant?.name || "Gaqno Shop"}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
