import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  CurrencyEuroIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  multiplier: number;
}

interface Pricing {
  id: string;
  category: string;
  daily_rate: number;
  season_id: string;
}

interface Extra {
  id: string;
  name: string;
  name_en: string;
  type: 'daily' | 'one-time';
  price: number;
}

const PricingManagement: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock data
  const [seasons] = useState<Season[]>([
    { id: '1', name: 'Low Season', start_date: '2025-11-01', end_date: '2025-03-31', multiplier: 1.0 },
    { id: '2', name: 'Mid Season', start_date: '2025-04-01', end_date: '2025-05-31', multiplier: 1.3 },
    { id: '3', name: 'High Season', start_date: '2025-06-01', end_date: '2025-09-30', multiplier: 1.8 }
  ]);

  const [pricing] = useState<Pricing[]>([
    { id: '1', category: 'A', daily_rate: 25, season_id: '1' },
    { id: '2', category: 'B', daily_rate: 35, season_id: '1' },
    { id: '3', category: 'C', daily_rate: 45, season_id: '1' },
    { id: '4', category: 'SUV', daily_rate: 65, season_id: '1' },
    { id: '5', category: '7-seater', daily_rate: 85, season_id: '1' }
  ]);

  const [extras] = useState<Extra[]>([
    { id: '1', name: 'Παιδικό Κάθισμα', name_en: 'Child Seat', type: 'daily', price: 5 },
    { id: '2', name: 'Δεύτερος Οδηγός', name_en: 'Additional Driver', type: 'one-time', price: 25 },
    { id: '3', name: 'GPS', name_en: 'GPS Navigation', type: 'daily', price: 8 },
    { id: '4', name: 'Φορτιστής Κινητού', name_en: 'Phone Charger', type: 'daily', price: 3 }
  ]);

  const categories = ['A', 'B', 'C', 'SUV', '7-seater'];

  const getPriceForCategorySeason = (category: string, seasonId: string) => {
    const basePrice = pricing.find(p => p.category === category && p.season_id === '1')?.daily_rate || 0;
    const season = seasons.find(s => s.id === seasonId);
    return basePrice * (season?.multiplier || 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('pricing')}</h1>
      </div>

      {/* Seasons */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Σεζόν</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-1" />
              Νέα Σεζόν
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {seasons.map((season) => (
              <div key={season.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{season.name}</h3>
                  <span className="text-sm font-medium text-blue-600">x{season.multiplier}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  {new Date(season.start_date).toLocaleDateString('el-GR')} - {new Date(season.end_date).toLocaleDateString('el-GR')}
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    <PencilIcon className="h-3 w-3 mr-1" />
                    Επεξεργασία
                  </button>
                  <button className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50">
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Τιμές ανά Κατηγορία & Σεζόν</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Κατηγορία</th>
                  {seasons.map((season) => (
                    <th key={season.id} className="text-center py-3 text-sm font-medium text-gray-500">
                      {season.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category}>
                    <td className="py-4 text-sm font-medium text-gray-900">{category}</td>
                    {seasons.map((season) => (
                      <td key={season.id} className="text-center py-4">
                        <div className="inline-flex items-center">
                          <CurrencyEuroIcon className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {getPriceForCategorySeason(category, season.id).toFixed(0)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/ημέρα</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insurance Rates */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Ασφάλεια</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-1" />
              Νέα Ασφάλεια
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Βασική Ασφάλεια</h3>
              <p className="text-sm text-gray-600 mb-3">Περιλαμβάνεται στην τιμή</p>
              <div className="text-2xl font-bold text-green-600">€0/ημέρα</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Πλήρης Ασφάλεια</h3>
              <p className="text-sm text-gray-600 mb-3">Χωρίς απαλλαγή</p>
              <div className="text-2xl font-bold text-blue-600">€15/ημέρα</div>
            </div>
          </div>
        </div>
      </div>

      {/* Extras */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Έξτρα</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-1" />
              Νέο Έξτρα
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extras.map((extra) => (
              <div key={extra.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{extra.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    extra.type === 'daily' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {extra.type === 'daily' ? 'Ημερήσιο' : 'Εφάπαξ'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{extra.name_en}</p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-green-600">
                    €{extra.price}/{extra.type === 'daily' ? 'ημέρα' : 'εφάπαξ'}
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Επεξεργασία
                    </button>
                    <button className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50">
                      <TrashIcon className="h-3 w-3" />
                    </button>
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

export default PricingManagement;