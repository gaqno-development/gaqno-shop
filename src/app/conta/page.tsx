'use client';

import { Package, Heart, Award, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AccountDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Pedidos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <p className="text-sm text-gray-600">Lista de Desejos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Pontos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhuma atividade recente</p>
          <p className="text-sm text-gray-500 mt-1">
            Seus pedidos e atividades aparecerão aqui
          </p>
        </div>
      </div>
    </div>
  );
}
