import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { customerService } from '../../lib/database';
import type { Customer } from '../../types';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CustomerManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError('Αποτυχία φόρτωσης πελατών.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'walk-in': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'walk-in': return 'Κατάστημα';
      case 'phone': return 'Τηλέφωνο';
      case 'instagram': return 'Instagram';
      default: return source || '-';
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-600">Φόρτωση πελατών...</span>
      </div>
    );
  }

  if (error && customers.length === 0) {
    return (
      <div className="text-center py-12">
        <XMarkIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Δοκιμή ξανά
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs font-mono text-yellow-800">
        CUSTOMERS SOURCE: DATABASE | count: {customers.length}
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('customers')}</h1>
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

      {/* Empty state */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {customers.length === 0
              ? 'Δεν υπάρχουν πελάτες ακόμα. Θα εμφανιστούν εδώ μετά την πρώτη κράτηση.'
              : 'Δεν βρέθηκαν πελάτες με αυτή την αναζήτηση.'}
          </p>
        </div>
      )}

      {/* Customers Grid */}
      {filteredCustomers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.country || '-'}</p>
                    </div>
                  </div>
                  {customer.source && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(customer.source)}`}>
                      {getSourceLabel(customer.source)}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {customer.phone || '-'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {customer.email || '-'}
                  </div>
                  {customer.license_number && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Άδεια:</span> {customer.license_number}
                    </div>
                  )}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setSelectedCustomer(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto z-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Στοιχεία Πελάτη</h2>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Όνομα</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Χώρα</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.country || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Τηλέφωνο</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Αρ. Άδειας</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.license_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ημ. Γέννησης</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.birth_date || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Πηγή</p>
                    <p className="text-sm text-gray-900">{getSourceLabel(selectedCustomer.source)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Εγγραφή</p>
                    <p className="text-sm text-gray-900">{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString('el-GR') : '-'}</p>
                  </div>
                </div>
                {selectedCustomer.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Σημειώσεις</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Κλείσιμο
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
