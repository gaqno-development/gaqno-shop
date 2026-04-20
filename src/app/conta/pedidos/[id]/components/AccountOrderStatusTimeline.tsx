import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle,
  Clock,
  Package,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui/card";
import { useTenant } from "@/contexts/tenant-context";
import type { AccountOrderStatusHistoryEntry } from "../types";

const STATUS_ICONS: Record<string, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Package,
  delivered: CheckCircle,
};

function resolveIcon(status: string): LucideIcon {
  return STATUS_ICONS[status] ?? Clock;
}

interface Props {
  readonly history: readonly AccountOrderStatusHistoryEntry[];
}

export function AccountOrderStatusTimeline({ history }: Props) {
  const { tenant } = useTenant();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {history.map((entry, index) => (
              <TimelineEntry
                key={index}
                entry={entry}
                primaryColor={tenant?.primaryColor}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EntryProps {
  readonly entry: AccountOrderStatusHistoryEntry;
  readonly primaryColor: string | undefined;
}

function TimelineEntry({ entry, primaryColor }: EntryProps) {
  const Icon = resolveIcon(entry.status);
  return (
    <div className="relative flex items-start gap-4">
      <div
        className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-medium capitalize">{entry.status}</p>
        <p className="text-sm text-gray-500">
          {format(new Date(entry.createdAt), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
        {entry.notes && (
          <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
        )}
      </div>
    </div>
  );
}
