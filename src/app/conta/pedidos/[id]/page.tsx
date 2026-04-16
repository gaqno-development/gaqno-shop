'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTenant } from '@/contexts/tenant-context';
import { Button } from '@gaqno-development/frontcore/components/ui/button';
import { Badge } from '@gaqno-development/frontcore/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui/card';
import { Loader2, ArrowLeft, Package, CheckCircle, Clock } from 'lucide-react';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: string;
  shippingAmount: string;
  discountAmount: string;
  total: string;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  shippingAddress: any;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
    imageUrl: string | null;
  }>;
  statusHistory: Array<{
    status: string;
    notes: string | null;
    createdAt: string;
  }>;
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Package,
  delivered: CheckCircle,
};

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { tenant } = useTenant();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchOrderDetail();
    }
  }, [status, params.id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'X-Tenant-Slug': process.env.NEXT_PUBLIC_TENANT_SLUG || 'default',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch order');

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
        <Link href="/conta/pedidos">
          <Button className="mt-4" style={{ backgroundColor: tenant?.primaryColor }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos pedidos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/conta/pedidos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mt-2">{order.orderNumber}</h1>
          <p className="text-gray-500">
            {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          {order.status}
        </Badge>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {order.statusHistory.map((history, index) => {
                const Icon = statusIcons[history.status] || Clock;
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: tenant?.primaryColor }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{history.status}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(history.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  R$ {parseFloat(item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>R$ {parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Frete</span>
              <span>R$ {parseFloat(order.shippingAmount).toFixed(2)}</span>
            </div>
            {parseFloat(order.discountAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Desconto</span>
                <span className="text-green-600">-R$ {parseFloat(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>R$ {parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
