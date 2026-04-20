import { RotateCcw, Shield, Truck, type LucideIcon } from "lucide-react";

interface Feature {
  readonly icon: LucideIcon;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly title: string;
  readonly description: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: Truck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Frete Grátis",
    description: "Para compras acima de R$ 199",
  },
  {
    icon: Shield,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Pagamento Seguro",
    description: "100% protegido",
  },
  {
    icon: RotateCcw,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "7 Dias para Devolução",
    description: "Satisfação garantida",
  },
];

export function HomeFeatures() {
  return (
    <section className="py-12 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { readonly feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="flex items-center gap-4">
      <div
        className={`h-12 w-12 ${feature.iconBg} rounded-full flex items-center justify-center`}
      >
        <Icon className={`h-6 w-6 ${feature.iconColor}`} />
      </div>
      <div>
        <h3 className="font-semibold">{feature.title}</h3>
        <p className="text-sm text-gray-500">{feature.description}</p>
      </div>
    </div>
  );
}
