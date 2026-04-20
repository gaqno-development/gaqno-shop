"use client";

import {
  ProductBreadcrumb,
  ProductDescription,
  ProductGallery,
  ProductInfo,
  ProductLoadingSkeleton,
  ProductNotFound,
  RelatedProducts,
} from "./components";
import { useProductPage } from "./hooks/useProductPage";

export default function ProductPage() {
  const page = useProductPage();

  if (page.isLoading) {
    return <ProductLoadingSkeleton />;
  }

  if (!page.product || !page.pricing || !page.stock) {
    return <ProductNotFound />;
  }

  const { product, pricing, stock, quantityControls } = page;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductBreadcrumb productName={product.name} category={product.category} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery
          productName={product.name}
          images={product.images}
          selectedImage={page.selectedImage}
          onSelect={page.setSelectedImage}
        />
        <ProductInfo
          product={product}
          pricing={pricing}
          quantity={quantityControls.quantity}
          onDecrement={quantityControls.decrement}
          onIncrement={quantityControls.increment}
          canIncrement={stock.canIncrement}
          isOutOfStock={stock.isOutOfStock}
          isLowStock={stock.isLowStock}
          isAddingToCart={page.isAddingToCart}
          onAddToCart={page.handleAddToCart}
        />
      </div>

      <ProductDescription description={product.description} />
      <RelatedProducts products={page.relatedProducts} />
    </div>
  );
}
