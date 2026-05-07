import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { format, addDays, startOfDay } from 'date-fns';
import { el } from 'date-fns/locale';

const FleetOccupancy: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Mock data for next 7 days
  const generateOccupancyData = () => {
    const data = [];
    const categories = ['A', 'B', 'C', 'SUV', '7-seater'];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(startOfDay(new Date()), i);
      const dayData = {
        date,
        categories: categories.map(category => ({
          category,
          total: Math.floor(Math.random() * 10) + 5,
          occupied: Math.floor(Math.random() * 8) + 1
        }))
      };
      data.push(dayData);
    }
    return data;
  };

  const occupancyData = generateOccupancyData();

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{t('fleetOccupancy')}</h3>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-500">
                  {t('date')}
                </th>
                <th className="text-center py-2 text-sm font-medium text-gray-500">A</th>
                <th className="text-center py-2 text-sm font-medium text-gray-500">B</th>
                <th className="text-center py-2 text-sm font-medium text-gray-500">C</th>
                <th className="text-center py-2 text-sm font-medium text-gray-500">SUV</th>
                <th className="text-center py-2 text-sm font-medium text-gray-500">7-seater</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {occupancyData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {format(day.date, 'dd/MM', { locale: language === 'el' ? el : undefined })}
                  </td>
                  {day.categories.map((cat) => {
                    const percentage = (cat.occupied / cat.total) * 100;
                    return (
                      <td key={cat.category} className="text-center py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm text-gray-900">
                            {cat.occupied}/{cat.total}
                          </span>
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getOccupancyColor(percentage)} transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FleetOccupancy;