'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/contexts/tenant-context';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Award,
  LogOut
} from 'lucide-react';

const menuItems = [
  { href: '/conta', label: 'Dashboard', icon: User },
  { href: '/conta/pedidos', label: 'Meus Pedidos', icon: Package },
  { href: '/conta/fidelidade', label: 'Fidelidade', icon: Award },
  { href: '/conta/enderecos', label: 'Endereços', icon: MapPin },
  { href: '/conta/lista-desejos', label: 'Lista de Desejos', icon: Heart },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = useSession() ?? { data: null, status: 'loading' as const };
  const session = sessionResult.data;
  const status: 'loading' | 'authenticated' | 'unauthenticated' = sessionResult.status;
  const router = useRouter();
  const pathname = usePathname();
  const { tenant } = useTenant();

  if (!session || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: tenant?.primaryColor }}></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=' + encodeURIComponent(pathname));
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Minha Conta</h2>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ 
                        backgroundColor: isActive ? tenant?.primaryColor : undefined 
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    // Sign out logic
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
