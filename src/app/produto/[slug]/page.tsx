"use client";

import {
  BakeryProductOptions,
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

  const { product, pricing, stock, quantityControls, isBakery, bakeryOptions, decorations } = page;

  const decorationCatalog =
    product.allowsAdditionalDecorations === false ? [] : decorations;

  const bakerySlot = isBakery ? (
    <BakeryProductOptions
      options={bakeryOptions}
      decorations={decorationCatalog}
      leadDays={product.leadDays}
    />
  ) : null;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-16">
      <ProductBreadcrumb productName={product.name} category={product.category} />

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20 xl:gap-28">
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
          bakerySlot={bakerySlot}
        />
      </div>

      <ProductDescription description={product.description} />
      <RelatedProducts products={page.relatedProducts} />
    </div>
  );
}
