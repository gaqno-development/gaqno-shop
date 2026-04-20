import { Truck } from "lucide-react";
import type { OrderAddress } from "@/types/order";

interface Props {
  readonly address: OrderAddress;
}

export function OrderShippingAddress({ address }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5" />
        Endereço de Entrega
      </h2>
      <div className="text-gray-700">
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.province} {address.zip}
        </p>
        <p>{address.country}</p>
      </div>
    </div>
  );
}
