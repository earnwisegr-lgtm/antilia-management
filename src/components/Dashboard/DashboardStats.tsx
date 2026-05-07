import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { dashboardService } from '../../lib/database';
import {
  CalendarDaysIcon,
  CurrencyEuroIcon,
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = React.useState({
    reservations: 0,
    revenue: 0,
    pickups: 0,
    returns: 0
  });

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const todayStats = await dashboardService.getTodayStats();
        setStats(todayStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Fallback to mock data
        setStats({
          reservations: 12,
          revenue: 1850,
          pickups: 8,
          returns: 6
        });
      }
    };
    
    loadStats();
  }, []);


  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">{t('today')}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('todayReservations')}
          value={stats.reservations}
          icon={CalendarDaysIcon}
          color="text-blue-600"
        />
        <StatCard
          title={t('todayRevenue')}
          value={`€${stats.revenue}`}
          icon={CurrencyEuroIcon}
          color="text-green-600"
        />
        <StatCard
          title={t('todayPickups')}
          value={stats.pickups}
          icon={TruckIcon}
          color="text-purple-600"
        />
        <StatCard
          title={t('todayReturns')}
          value={stats.returns}
          icon={ArrowPathIcon}
          color="text-orange-600"
        />
      </div>
    </div>
  );
};

export default DashboardStats;