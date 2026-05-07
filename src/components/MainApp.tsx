import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoginForm from './Login/LoginForm';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import DashboardStats from './Dashboard/DashboardStats';
import FleetOccupancy from './Dashboard/FleetOccupancy';
import BookingWizard from './Booking/BookingWizard';
import ReservationsList from './Reservations/ReservationsList';
import CustomerManagement from './Customers/CustomerManagement';
import FleetManagement from './Fleet/FleetManagement';
import PricingManagement from './Pricing/PricingManagement';
import ReportsPage from './Reports/ReportsPage';
import UserManagement from './Users/UserManagement';
import SettingsPage from './Settings/SettingsPage';
import CheckOutForm from './CheckOut/CheckOutForm';
import CheckInForm from './CheckIn/CheckInForm';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [checkOutReservation, setCheckOutReservation] = useState<string | null>(null);
  const [checkInReservation, setCheckInReservation] = useState<string | null>(null);
  const [reservationRefresh, setReservationRefresh] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleCheckOut = (reservationId: string) => {
    setCheckOutReservation(reservationId);
  };

  const handleCheckIn = (reservationId: string) => {
    setCheckInReservation(reservationId);
  };

  const handleCheckOutComplete = (data: any) => {
    console.log('Check-out completed:', data);
    setCheckOutReservation(null);
    setReservationRefresh(prev => prev + 1);
  };

  const handleCheckInComplete = (data: any) => {
    console.log('Check-in completed:', data);
    setCheckInReservation(null);
    setReservationRefresh(prev => prev + 1);
  };

  // Show check-out form
  if (checkOutReservation) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-8">
          <CheckOutForm
            reservationId={checkOutReservation}
            onComplete={handleCheckOutComplete}
            onCancel={() => setCheckOutReservation(null)}
          />
        </div>
      </div>
    );
  }

  // Show check-in form
  if (checkInReservation) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-8">
          <CheckInForm
            reservationId={checkInReservation}
            onComplete={handleCheckInComplete}
            onCancel={() => setCheckInReservation(null)}
          />
        </div>
      </div>
    );
  }

  // Show booking wizard
  if (showBookingWizard) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <DashboardStats />
            <FleetOccupancy />
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{t('bookings')}</h1>
              <button
                onClick={() => setShowBookingWizard(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {t('newBooking')}
              </button>
            </div>
            <ReservationsList onCheckOut={handleCheckOut} onCheckIn={handleCheckIn} refreshTrigger={reservationRefresh} />
          </div>
        );
      case 'customers':
        return <CustomerManagement />;
      case 'fleet':
        return <FleetManagement />;
      case 'pricing':
        return <PricingManagement />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="space-y-8">
            <DashboardStats />
            <FleetOccupancy />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;