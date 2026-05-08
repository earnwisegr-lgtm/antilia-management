import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

console.log('%cSTEP3 LOADED', 'background:#0b0;color:#000');

interface Pricing {
  days: number;
  rate: number;
  dailyTotal: number;
  insuranceTotal: number;
  extrasTotal: number;
  grandTotal: number;
}

interface BookingStep3Props {
  data: any;
  pricing: Pricing;
  updateData: (data: any) => void;
}

const BookingStep3: React.FC<BookingStep3Props> = ({ data, pricing, updateData }) => {
  const { t } = useLanguage();

  console.log('S3 data:', data.pickupDate, data.returnDate, data.dailyRate);

  const extrasDef = {
    childSeat: { nameEl: 'Παιδικό Κάθισμα', nameEn: 'Child Seat', price: 5, type: 'daily' as const },
    additionalDriver: { nameEl: 'Δεύτερος Οδηγός', nameEn: 'Additional Driver', price: 25, type: 'one-time' as const }
  };

  const updateCustomer = (field: string, value: string) => {
    updateData({
      customer: {
        ...data.customer,
        [field]: value
      }
    });
  };

  const updateExtra = (key: string, quantity: number) => {
    updateData({
      extras: {
        ...data.extras,
        [key]: quantity
      }
    });
  };

  const updateInsurance = (type: 'basic' | 'full') => {
    updateData({
      insuranceType: type,
      insuranceRate: type === 'full' ? 15 : 0
    });
  };

  return (
    <div className="space-y-8">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('customerInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('name')}
            value={data.customer?.name || ''}
            onChange={(e) => updateCustomer('name', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder={t('phone')}
            value={data.customer?.phone || ''}
            onChange={(e) => updateCustomer('phone', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder={t('email')}
            value={data.customer?.email || ''}
            onChange={(e) => updateCustomer('email', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder={t('country')}
            value={data.customer?.country || ''}
            onChange={(e) => updateCustomer('country', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder={t('licenseNumber')}
            value={data.customer?.licenseNumber || ''}
            onChange={(e) => updateCustomer('licenseNumber', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder={t('birthDate')}
            value={data.customer?.birthDate || ''}
            onChange={(e) => updateCustomer('birthDate', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={data.customer?.source || 'walk-in'}
            onChange={(e) => updateCustomer('source', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="walk-in">{t('walkIn')}</option>
            <option value="phone">{t('telephone')}</option>
            <option value="instagram">{t('instagram')}</option>
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('pricingSection')}</h3>

        <div className="bg-yellow-100 border border-yellow-400 rounded p-2 mb-3 text-xs font-mono text-yellow-900">
          DEBUG — pickupDate: <b>{data.pickupDate}</b> | returnDate: <b>{data.returnDate}</b> | dailyRate: <b>{data.dailyRate}</b> | pricing.days: <b>{pricing.days}</b> | pricing.rate: <b>{pricing.rate}</b> | pricing.grandTotal: <b>{pricing.grandTotal}</b>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex justify-between">
            <span>{t('dailyRate')} ({pricing.days} {t('days')})</span>
            <span>€{pricing.dailyTotal.toFixed(2)}</span>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>{t('insurance')}</span>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="insurance"
                    value="basic"
                    checked={data.insuranceType === 'basic'}
                    onChange={() => updateInsurance('basic')}
                    className="mr-1"
                  />
                  {t('basic')} (€0)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="insurance"
                    value="full"
                    checked={data.insuranceType === 'full'}
                    onChange={() => updateInsurance('full')}
                    className="mr-1"
                  />
                  {t('full')} (€15/ημέρα)
                </label>
              </div>
            </div>
            {data.insuranceType === 'full' && (
              <div className="flex justify-between text-sm">
                <span>Πλήρης Ασφάλεια ({pricing.days} ημέρες)</span>
                <span>€{pricing.insuranceTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t('extras')}</h4>
            {Object.entries(extrasDef).map(([key, extra]) => (
              <div key={key} className="flex items-center justify-between mb-2">
                <span>{extra.nameEl}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={data.extras?.[key] || 0}
                    onChange={(e) => updateExtra(key, parseInt(e.target.value) || 0)}
                    className="w-16 border border-gray-300 rounded px-2 py-1"
                  />
                  <span className="text-sm text-gray-600">
                    €{extra.price}/{extra.type === 'daily' ? 'ημέρα' : 'εφάπαξ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>{t('total')}</span>
              <span>€{pricing.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('notes')}
        </label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => updateData({ notes: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Επιπλέον σημειώσεις..."
        />
      </div>
    </div>
  );
};

export default BookingStep3;