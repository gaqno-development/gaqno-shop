"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Truck, Shield, RotateCcw, Check, ShoppingCart } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { getProduct, getProducts } from "@/lib/api";
import { R2_PUBLIC_URL } from "@/lib/api";
import ProductCard from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string | null;
  quantity: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  weight: number | null;
  images: string[];
  isFeatured: boolean;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export default function ProductPage() {
  const params = useParams();
  const { tenant } = useTenant();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(slug);
        setProduct(data);
        
        // Load related products from same category
        if (data.categoryId) {
          const related = await getProducts({ 
            category: data.category.slug,
            limit: "4"
          });
          setRelatedProducts(related.items?.filter((p: Product) => p.id !== data.id) || []);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addItem(product, quantity);
      // Show success feedback (could add toast here)
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-8">O produto que você está procurando não existe.</p>
        <Link 
          href="/produtos"
          className="px-6 py-3 text-white rounded-lg"
          style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
        >
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice) : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  const isOutOfStock = product.trackInventory && product.quantity <= 0 && !product.allowBackorders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/produtos" className="hover:text-gray-900">Produtos</Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/produtos?category=${product.category.slug}`} className="hover:text-gray-900">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] ? `${R2_PUBLIC_URL}/${product.images[selectedImage]}` : "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.png";
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={image ? `${R2_PUBLIC_URL}/${image}` : "/placeholder-product.png"}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Link 
                href={`/produtos?category=${product.category.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span 
              className="text-3xl font-bold"
              style={{ color: tenant?.primaryColor || "#111827" }}
            >
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  R$ {compareAtPrice.toFixed(2).replace(".", ",")}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-gray-600">{product.shortDescription}</p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Fora de estoque</span>
            ) : product.trackInventory && product.quantity <= 5 ? (
              <span className="text-orange-600 font-medium">
                Apenas {product.quantity} unidades em estoque
              </span>
            ) : (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Check className="h-4 w-4" />
                Em estoque
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100"
                disabled={isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100"
                disabled={isOutOfStock || (product.trackInventory && quantity >= product.quantity)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className="flex-1 py-3 px-6 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAddingToCart ? "Adicionando..." : isOutOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-600">Entrega Rápida</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-600">Pagamento Seguro</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-600">7 Dias para Devolução</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Descrição</h2>
          <div className="prose max-w-none text-gray-600">
            {product.description}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
