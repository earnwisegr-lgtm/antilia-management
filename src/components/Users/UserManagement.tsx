import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { company } from '../../lib/company';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'agent' | 'manager' | 'admin';
  active: boolean;
  last_login?: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const users: User[] = [
    {
      id: '1',
      email: `admin@${company.email.split('@')[1]}`,
      name: 'Διαχειριστής Συστήματος',
      role: 'admin',
      active: true,
      last_login: '2025-01-15T10:30:00',
      created_at: '2024-01-01T00:00:00'
    },
    {
      id: '2',
      email: `manager@${company.email.split('@')[1]}`,
      name: 'Μάνατζερ Καταστήματος',
      role: 'manager',
      active: true,
      last_login: '2025-01-15T09:15:00',
      created_at: '2024-02-15T00:00:00'
    },
    {
      id: '3',
      email: `agent1@${company.email.split('@')[1]}`,
      name: 'Πράκτορας 1',
      role: 'agent',
      active: true,
      last_login: '2025-01-14T16:45:00',
      created_at: '2024-03-01T00:00:00'
    },
    {
      id: '4',
      email: `agent2@${company.email.split('@')[1]}`,
      name: 'Πράκτορας 2',
      role: 'agent',
      active: false,
      created_at: '2024-06-01T00:00:00'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Διαχειριστής';
      case 'manager': return 'Μάνατζερ';
      case 'agent': return 'Πράκτορας';
      default: return role;
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return ['Πλήρη δικαιώματα', 'Διαχείριση χρηστών', 'Ρυθμίσεις συστήματος'];
      case 'manager':
        return ['Κρατήσεις', 'Αναφορές', 'Τιμές & Σεζόν', 'Στόλος'];
      case 'agent':
        return ['Κρατήσεις', 'Check-in/out', 'Πελάτες'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('users')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Νέος Χρήστης
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {getRoleLabel(user.role)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Ενεργός' : 'Ανενεργός'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Δικαιώματα:</h4>
                <div className="flex flex-wrap gap-1">
                  {getRolePermissions(user.role).map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Δημιουργήθηκε:</span>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('el-GR')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Τελευταία σύνδεση:</span>
                  <p className="font-medium">
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString('el-GR')
                      : 'Ποτέ'
                    }
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Προβολή
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Επεξεργασία
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Descriptions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Περιγραφή Ρόλων</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="font-medium text-red-800">Διαχειριστής (Admin)</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Πλήρη πρόσβαση σε όλες τις λειτουργίες</li>
                <li>• Διαχείριση χρηστών και ρόλων</li>
                <li>• Ρυθμίσεις συστήματος</li>
                <li>• Audit logs</li>
              </ul>
            </div>
            
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Μάνατζερ (Manager)</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Όλες οι λειτουργίες Agent</li>
                <li>• Αναφορές και στατιστικά</li>
                <li>• Διαχείριση τιμών και σεζόν</li>
                <li>• Διαχείριση στόλου</li>
              </ul>
            </div>
            
            <div className="border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-medium text-green-800">Πράκτορας (Agent)</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Δημιουργία κρατήσεων</li>
                <li>• Check-in/Check-out</li>
                <li>• Διαχείριση πελατών</li>
                <li>• Έκδοση συμβολαίων</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;