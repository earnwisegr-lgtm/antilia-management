import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { vehicleService } from '../../lib/database';
import type { Vehicle } from '../../types';
import {
  TruckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import VehicleReservationsModal from './VehicleReservationsModal';

const FleetManagement: React.FC = () => {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
      setError('Αποτυχία φόρτωσης οχημάτων.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Διαθέσιμο';
      case 'reserved': return 'Κρατημένο';
      case 'service': return 'Συντήρηση';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircleIcon;
      case 'reserved': return ClockIcon;
      case 'service': return ExclamationTriangleIcon;
      default: return TruckIcon;
    }
  };

  const isDocumentExpiring = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-600">Φόρτωση στόλου...</span>
      </div>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <TruckIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchVehicles}
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
        FLEET SOURCE: DATABASE | count: {vehicles.length}
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('fleet')}</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Προσθήκη Οχήματος
        </button>
      </div>

      {/* Empty state */}
      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Δεν υπάρχουν οχήματα ακόμα. Προσθέστε το πρώτο όχημα του στόλου σας.
          </p>
        </div>
      )}

      {/* Vehicle Reservations Modal */}
      {selectedVehicle && (
        <VehicleReservationsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {/* Fleet Grid */}
      {vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const StatusIcon = getStatusIcon(vehicle.status);
            return (
              <div key={vehicle.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TruckIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{vehicle.plate}</h3>
                        <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {getStatusLabel(vehicle.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Κατηγορία:</span>
                      <p className="font-medium">{vehicle.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Έτος:</span>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Κιβώτιο:</span>
                      <p className="font-medium">{vehicle.transmission === 'manual' ? 'Χειροκίνητο' : 'Αυτόματο'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Καύσιμο:</span>
                      <p className="font-medium">{vehicle.fuel_type === 'petrol' ? 'Βενζίνη' : 'Πετρέλαιο'}</p>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="space-y-2 mb-4">
                    {vehicle.insurance_expiry && (
                      <div className={`flex items-center justify-between text-xs p-2 rounded ${
                        isDocumentExpiring(vehicle.insurance_expiry) ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        <span>Ασφάλεια:</span>
                        <span>{new Date(vehicle.insurance_expiry).toLocaleDateString('el-GR')}</span>
                      </div>
                    )}
                    {vehicle.inspection_expiry && (
                      <div className={`flex items-center justify-between text-xs p-2 rounded ${
                        isDocumentExpiring(vehicle.inspection_expiry) ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        <span>ΚΤΕΟ:</span>
                        <span>{new Date(vehicle.inspection_expiry).toLocaleDateString('el-GR')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      Κρατήσεις
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
