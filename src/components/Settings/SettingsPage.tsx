import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { company } from '../../lib/company';
import {
  CogIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Εταιρικά Στοιχεία', icon: BuildingOfficeIcon },
    { id: 'stations', label: 'Σταθμοί', icon: MapPinIcon },
    { id: 'financial', label: 'Οικονομικά', icon: CurrencyEuroIcon },
    { id: 'documents', label: 'Έγγραφα', icon: DocumentTextIcon },
    { id: 'notifications', label: 'Ειδοποιήσεις', icon: BellIcon }
  ];

  const [companySettings, setCompanySettings] = useState({
    name: company.name,
    address: company.address,
    phone: company.phone,
    email: company.email,
    website: company.website,
    tax_number: company.taxNumber,
    registration_number: company.registrationNumber
  });

  const [stations, setStations] = useState([
    { id: '1', name: 'Πλατανιάς', name_en: 'Platanias', address: 'Πλατανιάς, Χανιά', active: true },
    { id: '2', name: 'Αγία Μαρίνα', name_en: 'Agia Marina', address: 'Αγία Μαρίνα, Χανιά', active: true },
    { id: '3', name: 'Αεροδρόμιο', name_en: 'Airport', address: 'Αεροδρόμιο Χανίων', active: true }
  ]);

  const [financialSettings, setFinancialSettings] = useState({
    currency: 'EUR',
    vat_rate: 24,
    late_return_fee: 10,
    cleaning_fee: 25,
    fuel_charge_per_liter: 1.5
  });

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Επωνυμία Εταιρείας
          </label>
          <input
            type="text"
            value={companySettings.name}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ΑΦΜ
          </label>
          <input
            type="text"
            value={companySettings.tax_number}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, tax_number: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Διεύθυνση
          </label>
          <input
            type="text"
            value={companySettings.address}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Τηλέφωνο
          </label>
          <input
            type="text"
            value={companySettings.phone}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={companySettings.email}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="text"
            value={companySettings.website}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Αριθμός Μητρώου
          </label>
          <input
            type="text"
            value={companySettings.registration_number}
            onChange={(e) => setCompanySettings(prev => ({ ...prev, registration_number: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStationsSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Σταθμοί Παραλαβής/Παράδοσης</h3>
        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Νέος Σταθμός
        </button>
      </div>
      
      <div className="space-y-4">
        {stations.map((station) => (
          <div key={station.id} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Όνομα (ΕΛ)
                </label>
                <input
                  type="text"
                  value={station.name}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Όνομα (EN)
                </label>
                <input
                  type="text"
                  value={station.name_en}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Διεύθυνση
                </label>
                <input
                  type="text"
                  value={station.address}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={station.active}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ενεργός</span>
                </label>
                <button className="text-red-600 hover:text-red-700">
                  Διαγραφή
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Νόμισμα
          </label>
          <select
            value={financialSettings.currency}
            onChange={(e) => setFinancialSettings(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">US Dollar ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ΦΠΑ (%)
          </label>
          <input
            type="number"
            value={financialSettings.vat_rate}
            onChange={(e) => setFinancialSettings(prev => ({ ...prev, vat_rate: parseFloat(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Χρέωση Καθυστέρησης (€/ώρα)
          </label>
          <input
            type="number"
            value={financialSettings.late_return_fee}
            onChange={(e) => setFinancialSettings(prev => ({ ...prev, late_return_fee: parseFloat(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Χρέωση Καθαρισμού (€)
          </label>
          <input
            type="number"
            value={financialSettings.cleaning_fee}
            onChange={(e) => setFinancialSettings(prev => ({ ...prev, cleaning_fee: parseFloat(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Χρέωση Καυσίμου (€/λίτρο)
          </label>
          <input
            type="number"
            step="0.01"
            value={financialSettings.fuel_charge_per_liter}
            onChange={(e) => setFinancialSettings(prev => ({ ...prev, fuel_charge_per_liter: parseFloat(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanySettings();
      case 'stations':
        return renderStationsSettings();
      case 'financial':
        return renderFinancialSettings();
      case 'documents':
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Ρυθμίσεις εγγράφων θα υλοποιηθούν σύντομα</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Ρυθμίσεις ειδοποιήσεων θα υλοποιηθούν σύντομα</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('settings')}</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <CogIcon className="h-4 w-4 mr-2" />
            Αποθήκευση Ρυθμίσεων
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;