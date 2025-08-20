"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UserIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  ShoppingCartIcon as ShoppingCartIconSolid, 
  UserIcon as UserIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Accueil',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    href: '/diagnostic',
    label: 'Diagnostic',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardDocumentListIconSolid,
  },
  {
    href: '/shop',
    label: 'Panier',
    icon: ShoppingCartIcon,
    iconSolid: ShoppingCartIconSolid,
  },
  {
    href: '/account',
    label: 'Compte',
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

const BottomNavigation = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/30">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const IconComponent = active ? item.iconSolid : item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center py-2 px-3 min-w-0 transition-all ${
                    active
                      ? 'text-afriquadis-600'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {active && (
                    <span className="absolute -top-2 h-1 w-8 rounded-full bg-gradient-to-r from-afriquadis-500 via-orange-500 to-darkBlue-600"></span>
                  )}
                  <IconComponent className="w-6 h-6 mb-1" />
                  <span className={`text-xs font-medium ${active ? 'text-afriquadis-600' : 'text-neutral-500'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;