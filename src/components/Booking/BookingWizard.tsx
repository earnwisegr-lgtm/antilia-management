import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { reservationService, customerService } from '../../lib/database';
import type { Customer, Reservation } from '../../types';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// --- helpers (πάνω από το component) ---
const pad = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

// UTC-midnight, όχι local ούτε toISOString
const daysBetweenUTC = (start: string, end: string) => {
  if (!start || !end) return 1;
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const s = Date.UTC(sy, sm - 1, sd);
  const e = Date.UTC(ey, em - 1, ed);
  return Math.max(1, Math.round((e - s) / 86400000));
};

// Seasonal full-insurance rate based on pickup month
// Apr-Jun, Sep-Oct = €10/day; Jul-Aug = €15/day
const getFullInsuranceRate = (pickupDate: string): number => {
  if (!pickupDate) return 10;
  const month = parseInt(pickupDate.split('-')[1], 10);
  if (month === 7 || month === 8) return 15;
  return 10;
};

interface BookingData {
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupStation: string;
  returnStation: string;
  category: string;
  vehicleId?: string;
  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  dailyRate: number;
  insuranceType: 'basic' | 'full';
  insuranceRate: number;
  extras: { [key: string]: number };
  customer: {
    name: string;
    phone: string;
    email: string;
    country: string;
    licenseNumber: string;
    birthDate: string;
    source: string;
  };
  notes: string;
}

interface BookingWizardProps {
  onComplete?: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  // Σήμερα & Αύριο
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const pickupStr = formatDate(today);
    return {
      pickupDate: pickupStr,
      returnDate: formatDate(tomorrow),
      pickupTime: '09:00',
      returnTime: '09:00',
      pickupStation: '',
      returnStation: '',
      category: '',
      dailyRate: 0,
      insuranceType: 'full',
      insuranceRate: getFullInsuranceRate(pickupStr),
      extras: {},
      customer: {
        name: '',
        phone: '',
        email: '',
        country: '',
        licenseNumber: '',
        birthDate: '',
        source: 'store'
      },
      notes: ''
    };
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => {
      const next = {
        ...prev,
        ...updates,
        customer: {
          ...prev.customer,
          ...(updates.customer || {})
        },
        extras: {
          ...prev.extras,
          ...(updates.extras || {})
        }
      };
      // Recalculate insurance rate when pickupDate or insuranceType changes
      if (updates.pickupDate || updates.insuranceType) {
        const rate = getFullInsuranceRate(next.pickupDate);
        next.insuranceRate = next.insuranceType === 'full' ? rate : 0;
      }
      return next;
    });
  };

  // Pricing calculations with useMemo
  const pricing = useMemo(() => {
    const days = daysBetweenUTC(bookingData.pickupDate, bookingData.returnDate);
    const rate = Number.isFinite(bookingData.dailyRate) ? bookingData.dailyRate : 0;

    let dailyTotal = rate * days;
    let insuranceTotal = 0;
    if (bookingData.insuranceType === 'full') {
      const insuranceRate = Number.isFinite(bookingData.insuranceRate) ? bookingData.insuranceRate : 0;
      insuranceTotal = insuranceRate * days;
    }

    const extrasDef = {
      childSeat: { price: 5, type: 'daily' as const },
      additionalDriver: { price: 25, type: 'one-time' as const }
    };
    
    let extrasTotal = 0;
    Object.entries(bookingData.extras || {}).forEach(([key, quantity]) => {
      const def = (extrasDef as any)[key];
      if (!def || !quantity) return;
      extrasTotal += def.type === 'daily' 
        ? def.price * (quantity as number) * days 
        : def.price * (quantity as number);
    });

    return {
      days,
      rate,
      dailyTotal,
      insuranceTotal,
      extrasTotal,
      grandTotal: dailyTotal + insuranceTotal + extrasTotal
    };
  }, [bookingData.pickupDate, bookingData.returnDate, bookingData.dailyRate, bookingData.insuranceType, bookingData.insuranceRate, bookingData.extras]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          bookingData.pickupDate && bookingData.returnDate &&
          bookingData.pickupStation && bookingData.returnStation
        );
      case 2:
        return !!(bookingData.category && bookingData.vehicleId);
      case 3:
        return !!(bookingData.customer.name && bookingData.customer.phone);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleComplete = () => {
    const saveBooking = async () => {
      setSaving(true);
      setSaveError('');
      try {
        // Final overlap check before saving
        if (bookingData.vehicleId) {
          const allReservations: Reservation[] = await reservationService.getAll();
          const newStart = new Date(bookingData.pickupDate).getTime();
          const newEnd = new Date(bookingData.returnDate).getTime();
          const hasConflict = allReservations.some(r => {
            if (r.vehicle_id !== bookingData.vehicleId) return false;
            if (r.status !== 'upcoming' && r.status !== 'active') return false;
            const rStart = new Date(r.pickup_date).getTime();
            const rEnd = new Date(r.return_date).getTime();
            return newStart < rEnd && newEnd > rStart;
          });
          if (hasConflict) {
            setSaveError('Το όχημα δεν είναι διαθέσιμο για τις επιλεγμένες ημερομηνίες');
            setSaving(false);
            return;
          }
        }

        // 1) Customer
        const customer = await customerService.create({
          name: bookingData.customer.name,
          phone: bookingData.customer.phone,
          email: bookingData.customer.email,
          country: bookingData.customer.country,
          license_number: bookingData.customer.licenseNumber,
          birth_date: bookingData.customer.birthDate,
          source: bookingData.customer.source as Customer['source']
        });

        // 2) Reservation
        await reservationService.create({
          customer_id: customer.id,
          vehicle_id: bookingData.vehicleId || undefined,
          category: bookingData.category,
          pickup_date: `${bookingData.pickupDate}T${bookingData.pickupTime}:00`,
          return_date: `${bookingData.returnDate}T${bookingData.returnTime}:00`,
          pickup_station_id: bookingData.pickupStation,
          return_station_id: bookingData.returnStation,
          daily_rate: pricing.rate,
          insurance_type: bookingData.insuranceType,
          insurance_rate: bookingData.insuranceRate,
          total_amount: pricing.grandTotal,
          notes: bookingData.notes,
          status: 'upcoming'
        });

        onComplete?.();
      } catch (error) {
        console.error('Booking creation failed:', error);
        setSaveError('Αποτυχία δημιουργίας κράτησης. Παρακαλώ δοκιμάστε ξανά.');
      } finally {
        setSaving(false);
      }
    };

    saveBooking();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{t('newBooking')}</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {t('step')} {currentStep} / 3
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 && (
            <BookingStep1 data={bookingData} updateData={updateBookingData} />
          )}
          {currentStep === 2 && (
            <BookingStep2 data={bookingData} updateData={updateBookingData} />
          )}
          {currentStep === 3 && (
            <BookingStep3 data={bookingData} pricing={pricing} updateData={updateBookingData} />
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            {t('previous')}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('next')}
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {saveError && (
                <span className="text-sm text-red-600">{saveError}</span>
              )}
              <button
                onClick={handleComplete}
                disabled={!canProceed() || saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Αποθήκευση...' : t('complete')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;