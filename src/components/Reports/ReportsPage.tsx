import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  ChartBarIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  TruckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { format, subDays, startOfDay } from 'date-fns';
import { el } from 'date-fns/locale';

const ReportsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });

  // Mock data for reports
  const dailySales = [
    { date: '2025-01-10', reservations: 8, revenue: 1240, avg_revenue: 155 },
    { date: '2025-01-11', reservations: 12, revenue: 1850, avg_revenue: 154 },
    { date: '2025-01-12', reservations: 6, revenue: 920, avg_revenue: 153 },
    { date: '2025-01-13', reservations: 15, revenue: 2100, avg_revenue: 140 },
    { date: '2025-01-14', reservations: 10, revenue: 1560, avg_revenue: 156 }
  ];

  const channelData = [
    { channel: 'walk-in', reservations: 25, revenue: 3850, percentage: 45 },
    { channel: 'phone', reservations: 18, revenue: 2940, percentage: 35 },
    { channel: 'instagram', reservations: 8, revenue: 1680, percentage: 20 }
  ];

  const occupancyData = [
    { date: '2025-01-15', category: 'A', total: 8, occupied: 6 },
    { date: '2025-01-15', category: 'B', total: 12, occupied: 9 },
    { date: '2025-01-15', category: 'C', total: 6, occupied: 4 },
    { date: '2025-01-15', category: 'SUV', total: 10, occupied: 8 },
    { date: '2025-01-15', category: '7-seater', total: 4, occupied: 2 }
  ];

  const stationActivity = [
    { station: 'Πλατανιάς', checkouts: 12, checkins: 8 },
    { station: 'Αγία Μαρίνα', checkouts: 6, checkins: 9 },
    { station: 'Αεροδρόμιο', checkouts: 15, checkins: 14 }
  ];

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'walk-in': return 'bg-blue-500';
      case 'phone': return 'bg-green-500';
      case 'instagram': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'walk-in': return 'Κατάστημα';
      case 'phone': return 'Τηλέφωνο';
      case 'instagram': return 'Instagram';
      default: return channel;
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    // Simple CSV export - in real app, use a proper CSV library
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('reports')}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">έως</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Daily Sales Report */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Ημερήσιες Πωλήσεις</h2>
            <button
              onClick={() => exportToCSV(dailySales, 'daily-sales')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Εξαγωγή CSV
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Ημερομηνία</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">Κρατήσεις</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">Έσοδα</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">Μέσο Έσοδο</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailySales.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {format(new Date(day.date), 'dd/MM/yyyy', { locale: language === 'el' ? el : undefined })}
                    </td>
                    <td className="text-center py-4">
                      <div className="inline-flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium">{day.reservations}</span>
                      </div>
                    </td>
                    <td className="text-center py-4">
                      <div className="inline-flex items-center">
                        <CurrencyEuroIcon className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-600">€{day.revenue}</span>
                      </div>
                    </td>
                    <td className="text-center py-4">
                      <span className="text-sm text-gray-600">€{day.avg_revenue}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Έσοδα ανά Κανάλι</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channelData.map((channel) => (
              <div key={channel.channel} className="text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 ${getChannelColor(channel.channel)} rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold`}>
                    {channel.percentage}%
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {getChannelLabel(channel.channel)}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {channel.reservations} κρατήσεις
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    €{channel.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet Occupancy */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Πληρότητα Στόλου - Σήμερα</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {occupancyData.map((item) => {
              const percentage = (item.occupied / item.total) * 100;
              return (
                <div key={item.category} className="text-center">
                  <div className="mb-3">
                    <TruckIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900">{item.category}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {item.occupied}/{item.total}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage < 50 ? 'bg-green-500' : 
                          percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{percentage.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Station Activity */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Δραστηριότητα Σταθμών - Σήμερα</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stationActivity.map((station) => (
              <div key={station.station} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4 text-center">{station.station}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{station.checkouts}</div>
                    <p className="text-sm text-gray-600">Check-outs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{station.checkins}</div>
                    <p className="text-sm text-gray-600">Check-ins</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;