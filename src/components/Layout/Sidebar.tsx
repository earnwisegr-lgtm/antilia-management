import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  TruckIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: HomeIcon },
    { id: 'bookings', label: t('bookings'), icon: CalendarDaysIcon },
    { id: 'customers', label: t('customers'), icon: UsersIcon },
    { id: 'fleet', label: t('fleet'), icon: TruckIcon },
    { id: 'pricing', label: t('pricing'), icon: CurrencyEuroIcon },
    { id: 'reports', label: t('reports'), icon: ChartBarIcon },
    { id: 'users', label: t('users'), icon: UserGroupIcon },
    { id: 'settings', label: t('settings'), icon: CogIcon },
  ];

  return (
    <div className="w-64 bg-gray-50 min-h-screen border-r border-gray-200">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${
                  activeTab === item.id
                    ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;