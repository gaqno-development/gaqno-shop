'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTenant } from '@/contexts/tenant-context';
import { Button } from '@gaqno-development/frontcore/components/ui/button';
import { Badge } from '@gaqno-development/frontcore/components/ui/badge';
import { Loader2, Package, Eye } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  items: number;
}

const statusLabels: Record<string, { label: string; variant: any }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  processing: { label: 'Em Processamento', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'default' },
  delivered: { label: 'Entregue', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'destructive' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { tenant } = useTenant();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/conta/pedidos');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, pagination.page]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders?page=${pagination.page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'X-Tenant-Slug': process.env.NEXT_PUBLIC_TENANT_SLUG || 'default',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.items);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <p className="text-gray-500">
          Total: {pagination.total} pedido{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
          <p className="text-gray-500 mt-2">Você ainda não fez nenhum pedido.</p>
          <Link href="/produtos">
            <Button className="mt-4" style={{ backgroundColor: tenant?.primaryColor }}>
              Começar a comprar
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    <Badge variant={statusLabels[order.status]?.variant || 'secondary'}>
                      {statusLabels[order.status]?.label || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.items} item{order.items !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    R$ {parseFloat(order.total).toFixed(2)}
                  </p>
                  <Link href={`/conta/pedidos/${order.id}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
