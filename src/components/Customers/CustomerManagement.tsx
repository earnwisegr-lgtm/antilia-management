import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  UsersIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  license_number: string;
  birth_date: string;
  notes?: string;
  source: 'walk-in' | 'phone' | 'instagram';
  created_at: string;
  total_rentals: number;
  total_spent: number;
}

const CustomerManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      phone: '+30 6912345678',
      email: 'giannis@example.com',
      country: 'Ελλάδα',
      license_number: 'ΑΜ123456',
      birth_date: '1985-03-15',
      source: 'walk-in',
      created_at: '2024-01-15',
      total_rentals: 5,
      total_spent: 850,
      notes: 'Τακτικός πελάτης, προτιμά SUV'
    },
    {
      id: '2',
      name: 'Maria Johnson',
      phone: '+44 7123456789',
      email: 'maria@example.com',
      country: 'United Kingdom',
      license_number: 'UK987654',
      birth_date: '1990-07-22',
      source: 'instagram',
      created_at: '2024-02-10',
      total_rentals: 2,
      total_spent: 320
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'walk-in': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'instagram': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'walk-in': return 'Κατάστημα';
      case 'phone': return 'Τηλέφωνο';
      case 'instagram': return 'Instagram';
      default: return source;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('customers')}</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <PlusIcon className="h-4 w-4 mr-2" />
          Νέος Πελάτης
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση πελάτη..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.country}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(customer.source)}`}>
                  {getSourceLabel(customer.source)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {customer.email}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Άδεια:</span> {customer.license_number}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{customer.total_rentals}</p>
                  <p className="text-blue-600">Ενοικιάσεις</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">€{customer.total_spent}</p>
                  <p className="text-green-600">Σύνολο</p>
                </div>
              </div>

              {customer.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{customer.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Προβολή
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Επεξεργασία
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;