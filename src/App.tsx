import React from 'react';
import { useState } from 'react';
import ReservationsList from './components/Reservations/ReservationsList';
import BookingWizard from './components/Booking/BookingWizard';
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  TruckIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [reservationRefresh, setReservationRefresh] = useState(0);

  // Mock data
  const todayStats = {
    reservations: 12,
    revenue: 1850,
    pickups: 8,
    returns: 6
  };

  const customers = [
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      phone: '+30 6912345678',
      email: 'giannis@example.com',
      country: 'Ελλάδα',
      license_number: 'ΑΜ123456',
      birth_date: '1985-03-15',
      source: 'walk-in',
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
      total_rentals: 2,
      total_spent: 320
    }
  ];

  const vehicles = [
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
  ];

  const users = [
    {
      id: '1',
      email: 'admin@antilia.com',
      name: 'Διαχειριστής Συστήματος',
      role: 'admin',
      active: true,
      last_login: '2025-01-15T10:30:00',
      created_at: '2024-01-01T00:00:00'
    },
    {
      id: '2',
      email: 'manager@antilia.com',
      name: 'Μάνατζερ Καταστήματος',
      role: 'manager',
      active: true,
      last_login: '2025-01-15T09:15:00',
      created_at: '2024-02-15T00:00:00'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Κεντρικό Ταμπλό', icon: HomeIcon },
    { id: 'bookings', label: 'Κρατήσεις', icon: CalendarDaysIcon },
    { id: 'customers', label: 'Πελάτες', icon: UsersIcon },
    { id: 'fleet', label: 'Στόλος', icon: TruckIcon },
    { id: 'pricing', label: 'Τιμές & Σεζόν', icon: CurrencyEuroIcon },
    { id: 'reports', label: 'Αναφορές', icon: ChartBarIcon },
    { id: 'users', label: 'Χρήστες', icon: UserGroupIcon },
    { id: 'settings', label: 'Ρυθμίσεις', icon: CogIcon },
  ];

  const availableVehicles = {
    'A': { vehicles: ['Toyota Aygo', 'Peugeot 108'], dailyRate: 25, count: 3 },
    'B': { vehicles: ['Nissan Micra', 'Ford Fiesta'], dailyRate: 35, count: 5 },
    'C': { vehicles: ['VW Golf', 'Toyota Corolla'], dailyRate: 45, count: 2 },
    'SUV': { vehicles: ['Nissan Qashqai', 'Peugeot 3008'], dailyRate: 65, count: 4 },
    '7-seater': { vehicles: ['Ford Galaxy'], dailyRate: 85, count: 1 }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'walk-in': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'instagram': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Antilia Rent a Car
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Σύστημα Διαχείρισης Κρατήσεων
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  defaultValue="demo@antilia.com"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  type="password"
                  defaultValue="demo123"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Κωδικός πρόσβασης"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Σύνδεση
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Demo: demo@antilia.com / demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Wizard
  if (showBookingWizard) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Antilia Rent a Car</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Demo User</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Αποσύνδεση
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="py-8">
          <BookingWizard
            onComplete={() => {
              setShowBookingWizard(false);
              setActiveTab('bookings');
              setReservationRefresh(prev => prev + 1);
            }}
          />
          <div className="max-w-4xl mx-auto mt-4">
            <button
              onClick={() => setShowBookingWizard(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              ← Επιστροφή στις κρατήσεις
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check-out Form
  if (showCheckOut) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Antilia Rent a Car</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Demo User</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Αποσύνδεση
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Check-out Οχήματος</h2>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Επίπεδο Καυσίμου (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="100"
                      className="w-full"
                    />
                    <p className="text-center mt-2 font-medium">100%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Χιλιόμετρα
                    </label>
                    <input
                      type="number"
                      defaultValue="45000"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Φωτογραφίες Οχήματος
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <CameraIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Μπροστά</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <CameraIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Πίσω</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <CameraIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Αριστερά</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <CameraIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Δεξιά</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Αξεσουάρ που Δόθηκαν
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Παιδικό Κάθισμα', 'GPS', 'Φορτιστής Κινητού', 'Αλυσίδες Χιονιού', 'Τρίγωνο', 'Φαρμακείο'].map((accessory) => (
                      <label key={accessory} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{accessory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCheckOut(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={() => {
                    alert('Check-out ολοκληρώθηκε επιτυχώς!');
                    setShowCheckOut(false);
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Ολοκλήρωση Check-out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check-in Form
  if (showCheckIn) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Antilia Rent a Car</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Demo User</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Αποσύνδεση
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Check-in Οχήματος</h2>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Επίπεδο Καυσίμου Επιστροφής (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full"
                    />
                    <p className="text-center mt-2 font-medium">75%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Χιλιόμετρα Επιστροφής
                    </label>
                    <input
                      type="number"
                      defaultValue="45350"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Επιπλέον Χρεώσεις
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Καύσιμο (25% έλλειψη)</span>
                        <p className="text-xs text-gray-600">25 λίτρα x €1.50</p>
                      </div>
                      <span className="text-sm font-semibold text-red-600">€37.50</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Σύνολο Επιπλέον Χρεώσεων:</span>
                    <span className="text-xl font-bold text-red-600">€37.50</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCheckIn(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={() => {
                    alert('Check-in ολοκληρώθηκε επιτυχώς!');
                    setShowCheckIn(false);
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Ολοκλήρωση Check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Antilia Rent a Car</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="el">Ελληνικά</option>
                <option value="en">English</option>
              </select>
              <span className="text-gray-700">Demo User</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                manager
              </span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Αποσύνδεση
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 min-h-screen border-r border-gray-200">
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      activeTab === item.id
                        ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h1 className="text-2xl font-semibold text-gray-900">Κεντρικό Ταμπλό</h1>
              
              {/* Today Stats */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Σήμερα</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Κρατήσεις</dt>
                            <dd className="text-lg font-medium text-gray-900">{todayStats.reservations}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyEuroIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Έσοδα</dt>
                            <dd className="text-lg font-medium text-gray-900">€{todayStats.revenue}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TruckIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Παραλαβές</dt>
                            <dd className="text-lg font-medium text-gray-900">{todayStats.pickups}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Παραδόσεις</dt>
                            <dd className="text-lg font-medium text-gray-900">{todayStats.returns}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fleet Occupancy */}
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Πληρότητα Στόλου - Επόμενες 7 Ημέρες</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Ημερομηνία</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">A</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">B</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">C</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">SUV</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">7-seater</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { date: '15/01', data: [6, 9, 4, 8, 2], totals: [8, 12, 6, 10, 4] },
                          { date: '16/01', data: [7, 10, 5, 7, 3], totals: [8, 12, 6, 10, 4] },
                          { date: '17/01', data: [5, 8, 3, 9, 1], totals: [8, 12, 6, 10, 4] },
                          { date: '18/01', data: [8, 11, 6, 10, 4], totals: [8, 12, 6, 10, 4] },
                          { date: '19/01', data: [4, 7, 2, 6, 2], totals: [8, 12, 6, 10, 4] },
                          { date: '20/01', data: [6, 9, 4, 8, 3], totals: [8, 12, 6, 10, 4] },
                          { date: '21/01', data: [7, 10, 5, 9, 2], totals: [8, 12, 6, 10, 4] }
                        ].map((day, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium text-gray-900">{day.date}</td>
                            {day.data.map((occupied, catIndex) => {
                              const total = day.totals[catIndex];
                              const percentage = (occupied / total) * 100;
                              return (
                                <td key={catIndex} className="text-center py-3">
                                  <div className="flex items-center justify-center space-x-2">
                                    <span className="text-sm text-gray-900">{occupied}/{total}</span>
                                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-300 ${
                                          percentage < 50 ? 'bg-green-500' : 
                                          percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
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
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Κρατήσεις</h1>
                <button
                  onClick={() => setShowBookingWizard(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Νέα Κράτηση
                </button>
              </div>
              <ReservationsList refreshTrigger={reservationRefresh} />
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Πελάτες</h1>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Customers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {customers.map((customer) => (
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
                          {customer.source === 'walk-in' ? 'Κατάστημα' : 
                           customer.source === 'phone' ? 'Τηλέφωνο' : 'Instagram'}
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
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
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
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Στόλος</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Προσθήκη Οχήματος
                </button>
              </div>

              {/* Fleet Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => {
                  const StatusIcon = getStatusIcon(vehicle.status);
                  const isDocumentExpiring = (date: string) => {
                    const expiry = new Date(date);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30;
                  };

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
                            {vehicle.status === 'available' ? 'Διαθέσιμο' : 
                             vehicle.status === 'reserved' ? 'Κρατημένο' : 'Συντήρηση'}
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
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Τιμές & Σεζόν</h1>
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
                    {[
                      { name: 'Low Season', start: '01/11/2024', end: '31/03/2025', multiplier: 1.0 },
                      { name: 'Mid Season', start: '01/04/2025', end: '31/05/2025', multiplier: 1.3 },
                      { name: 'High Season', start: '01/06/2025', end: '30/09/2025', multiplier: 1.8 }
                    ].map((season, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{season.name}</h3>
                          <span className="text-sm font-medium text-blue-600">x{season.multiplier}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {season.start} - {season.end}
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
                          <th className="text-center py-3 text-sm font-medium text-gray-500">Low Season</th>
                          <th className="text-center py-3 text-sm font-medium text-gray-500">Mid Season</th>
                          <th className="text-center py-3 text-sm font-medium text-gray-500">High Season</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { category: 'A', base: 25 },
                          { category: 'B', base: 35 },
                          { category: 'C', base: 45 },
                          { category: 'SUV', base: 65 },
                          { category: '7-seater', base: 85 }
                        ].map((cat) => (
                          <tr key={cat.category}>
                            <td className="py-4 text-sm font-medium text-gray-900">{cat.category}</td>
                            <td className="text-center py-4">
                              <div className="inline-flex items-center">
                                <CurrencyEuroIcon className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm font-medium text-gray-900">{cat.base}</span>
                                <span className="text-xs text-gray-500 ml-1">/ημέρα</span>
                              </div>
                            </td>
                            <td className="text-center py-4">
                              <div className="inline-flex items-center">
                                <CurrencyEuroIcon className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm font-medium text-gray-900">{Math.round(cat.base * 1.3)}</span>
                                <span className="text-xs text-gray-500 ml-1">/ημέρα</span>
                              </div>
                            </td>
                            <td className="text-center py-4">
                              <div className="inline-flex items-center">
                                <CurrencyEuroIcon className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm font-medium text-gray-900">{Math.round(cat.base * 1.8)}</span>
                                <span className="text-xs text-gray-500 ml-1">/ημέρα</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    {[
                      { name: 'Παιδικό Κάθισμα', nameEn: 'Child Seat', price: 5, type: 'daily' },
                      { name: 'Δεύτερος Οδηγός', nameEn: 'Additional Driver', price: 25, type: 'one-time' },
                      { name: 'GPS Πλοήγηση', nameEn: 'GPS Navigation', price: 8, type: 'daily' },
                      { name: 'Φορτιστής Κινητού', nameEn: 'Phone Charger', price: 3, type: 'daily' }
                    ].map((extra, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{extra.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            extra.type === 'daily' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {extra.type === 'daily' ? 'Ημερήσιο' : 'Εφάπαξ'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{extra.nameEn}</p>
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
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Αναφορές</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      defaultValue="2025-01-08"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">έως</span>
                    <input
                      type="date"
                      defaultValue="2025-01-15"
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
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
                        {[
                          { date: '10/01/2025', reservations: 8, revenue: 1240, avg: 155 },
                          { date: '11/01/2025', reservations: 12, revenue: 1850, avg: 154 },
                          { date: '12/01/2025', reservations: 6, revenue: 920, avg: 153 },
                          { date: '13/01/2025', reservations: 15, revenue: 2100, avg: 140 },
                          { date: '14/01/2025', reservations: 10, revenue: 1560, avg: 156 }
                        ].map((day, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-4 text-sm font-medium text-gray-900">{day.date}</td>
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
                              <span className="text-sm text-gray-600">€{day.avg}</span>
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
                    {[
                      { channel: 'Κατάστημα', reservations: 25, revenue: 3850, percentage: 45, color: 'bg-blue-500' },
                      { channel: 'Τηλέφωνο', reservations: 18, revenue: 2940, percentage: 35, color: 'bg-green-500' },
                      { channel: 'Instagram', reservations: 8, revenue: 1680, percentage: 20, color: 'bg-purple-500' }
                    ].map((channel, index) => (
                      <div key={index} className="text-center">
                        <div className="mb-4">
                          <div className={`w-16 h-16 ${channel.color} rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold`}>
                            {channel.percentage}%
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{channel.channel}</h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{channel.reservations} κρατήσεις</p>
                          <p className="text-lg font-semibold text-green-600">€{channel.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Χρήστες</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
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
                            {user.role === 'admin' ? 'Διαχειριστής' : 
                             user.role === 'manager' ? 'Μάνατζερ' : 'Πράκτορας'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ενεργός
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Δικαιώματα:</h4>
                        <div className="flex flex-wrap gap-1">
                          {user.role === 'admin' ? 
                            ['Πλήρη δικαιώματα', 'Διαχείριση χρηστών', 'Ρυθμίσεις συστήματος'].map((perm, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                {perm}
                              </span>
                            )) :
                            ['Κρατήσεις', 'Αναφορές', 'Τιμές & Σεζόν', 'Στόλος'].map((perm, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                {perm}
                              </span>
                            ))
                          }
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Δημιουργήθηκε:</span>
                          <p className="font-medium">01/01/2024</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Τελευταία σύνδεση:</span>
                          <p className="font-medium">15/01/2025</p>
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
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Ρυθμίσεις</h1>
              </div>

              <div className="bg-white shadow-sm rounded-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: 'company', label: 'Εταιρικά Στοιχεία' },
                      { id: 'stations', label: 'Σταθμοί' },
                      { id: 'financial', label: 'Οικονομικά' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Επωνυμία Εταιρείας
                        </label>
                        <input
                          type="text"
                          defaultValue="Antilia Rent a Car"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ΑΦΜ
                        </label>
                        <input
                          type="text"
                          defaultValue="123456789"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Διεύθυνση
                        </label>
                        <input
                          type="text"
                          defaultValue="Πλατανιάς, Χανιά, Κρήτη"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Τηλέφωνο
                        </label>
                        <input
                          type="text"
                          defaultValue="+30 28210 12345"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue="info@antilia-rentacar.gr"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <CogIcon className="h-4 w-4 mr-2" />
                    Αποθήκευση Ρυθμίσεων
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;