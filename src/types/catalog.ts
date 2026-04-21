export interface ProductCategoryRef {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

export interface ProductSummary {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly shortDescription: string | null;
  readonly price: string;
  readonly compareAtPrice: string | null;
  readonly images: readonly string[];
  readonly isFeatured?: boolean;
  readonly categoryId?: string | null;
}

export interface Product extends ProductSummary {
  readonly sku: string | null;
  readonly quantity: number;
  readonly trackInventory: boolean;
  readonly allowBackorders: boolean;
  readonly weight: number | null;
  readonly category: ProductCategoryRef | null;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
  readonly allowsReferenceImage?: boolean;
  readonly leadDays?: number | null;
  readonly recipeId?: string | null;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly parentId?: string | null;
  readonly imageUrl?: string | null;
  readonly description?: string | null;
}
