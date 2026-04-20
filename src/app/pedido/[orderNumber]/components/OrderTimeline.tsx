import { CheckCircle, CreditCard, Package, Truck } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  TIMELINE_ACTIVE_STATUSES,
  TIMELINE_STATUSES,
  type OrderStatus,
} from "@/types/order";

const TIMELINE_ICONS: Record<OrderStatus, typeof CheckCircle> = {
  pending: CheckCircle,
  confirmed: CreditCard,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: CheckCircle,
  refunded: CheckCircle,
};

function isStepActive(currentStatus: string, step: OrderStatus): boolean {
  if (step === "pending" && currentStatus === "pending") return true;
  return TIMELINE_ACTIVE_STATUSES.includes(currentStatus);
}

interface Props {
  readonly currentStatus: string;
}

export function OrderTimeline({ currentStatus }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-8">
      <div className="flex items-center justify-between">
        {TIMELINE_STATUSES.map((step, index) => {
          const isActive = isStepActive(currentStatus, step);
          const isCurrent = currentStatus === step;
          const Icon = TIMELINE_ICONS[step];
          const isLast = index === TIMELINE_STATUSES.length - 1;

          return (
            <div key={step} className="flex items-center">
              <div className={`flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-300"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCurrent
                      ? "border-blue-600 bg-blue-50"
                      : isActive
                        ? "border-blue-600"
                        : "border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 hidden sm:block">
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isActive ? "bg-blue-600" : "bg-gray-300"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
