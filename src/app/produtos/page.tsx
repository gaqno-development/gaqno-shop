"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { getProducts, getCategories } from "@/lib/api";
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
  categoryId: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

function ProductsContent() {
  const { tenant } = useTenant();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get initial values from URL
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "name";
    
    setSelectedCategory(category);
    setSearchQuery(search);
    setSortBy(sort);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    loadCategories();
  }, []);

  // Load products with filters
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
        if (sortBy) params.sort = sortBy;
        params.limit = "24";

        const data = await getProducts(params);
        setProducts(data.items || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: tenant?.primaryColor || "#111827" }}
        >
          {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
        </h1>
        <p className="text-gray-600">
          {isLoading ? "Carregando..." : `${products.length} produtos encontrados`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white p-6 rounded-lg border sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categorias</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory("")}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Todas</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.slug}
                      onChange={() => setSelectedCategory(category.slug)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Preço</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:inline">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                <option value="name">Nome</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="newest">Mais recentes</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Categoria: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Preço: R$ {priceRange.min || "0"} - R$ {priceRange.max || "∞"}
                  <button onClick={() => setPriceRange({ min: "", max: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Busca: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
              <p className="text-gray-400">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
