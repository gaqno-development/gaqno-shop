import { R2_PUBLIC_URL } from "@/lib/api";

interface Props {
  readonly productName: string;
  readonly images: readonly string[];
  readonly selectedImage: number;
  readonly onSelect: (index: number) => void;
}

function toImageUrl(image: string | undefined): string {
  return image ? `${R2_PUBLIC_URL}/${image}` : "/placeholder-product.png";
}

export function ProductGallery({
  productName,
  images,
  selectedImage,
  onSelect,
}: Props) {
  const current = images[selectedImage];
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={toImageUrl(current)}
          alt={productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={toImageUrl(image)}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
