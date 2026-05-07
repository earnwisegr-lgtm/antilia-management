import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  TruckIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  category: 'A' | 'B' | 'C' | 'SUV' | '7-seater';
  year: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel';
  status: 'available' | 'reserved' | 'service';
  insurance_expiry?: string;
  inspection_expiry?: string;
  last_service?: string;
}

const FleetManagement: React.FC = () => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Mock data - in real app, this would come from Supabase
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      plate: 'XAN-1234',
      brand: 'Toyota',
      model: 'Aygo',
      category: 'A',
      year: 2022,
      transmission: 'manual',
      fuel_type: 'petrol',
      status: 'available',
      insurance_expiry: '2025-06-15',
      inspection_expiry: '2025-03-20',
      last_service: '2024-12-01'
    },
    {
      id: '2',
      plate: 'XAN-5678',
      brand: 'Nissan',
      model: 'Qashqai',
      category: 'SUV',
      year: 2023,
      transmission: 'automatic',
      fuel_type: 'petrol',
      status: 'reserved',
      insurance_expiry: '2025-08-10',
      inspection_expiry: '2025-05-15',
      last_service: '2024-11-15'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('fleet')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Προσθήκη Οχήματος
        </button>
      </div>

      {/* Fleet Grid */}
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
                    {t(vehicle.status)}
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
                    onClick={() => setEditingVehicle(vehicle)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Επεξεργασία
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
    </div>
  );
};

export default FleetManagement;