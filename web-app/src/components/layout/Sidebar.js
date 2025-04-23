import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  BellIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  DocumentTextIcon, 
  TruckIcon,
  WalletIcon,
  DocumentDuplicateIcon,
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Главная', href: '/', icon: HomeIcon },
  { name: 'Панель управления', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Поставки', href: '/supplier/shipments', icon: TruckIcon },
  { name: 'Транзакции', href: '/blockchain/transactions', icon: WalletIcon },
  { name: 'Профиль', href: '/profile', icon: UserIcon },
  { name: 'Настройки', href: '/settings', icon: CogIcon },
];

const additionalLinks = [
  { name: 'О платформе', href: '/about', icon: InformationCircleIcon },
  { name: 'Контакты', href: '/contact', icon: PhoneIcon },
  { name: 'Условия', href: '/terms', icon: DocumentIcon },
  { name: 'Конфиденциальность', href: '/privacy', icon: LockClosedIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-gray-800 w-64">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-white text-xl font-bold">SupplyChain Finance</span>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 ${
                    isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-white">Дополнительно</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 pb-4 space-y-1">
        {additionalLinks.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${
                  isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 