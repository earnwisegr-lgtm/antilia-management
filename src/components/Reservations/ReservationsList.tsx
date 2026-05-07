import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { reservationService } from '../../lib/database';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import {
  EyeIcon,
  DocumentTextIcon,
  TruckIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import ContractGenerator from '../PDF/ContractGenerator';

interface ReservationRow {
  id: string;
  customer_id: string;
  vehicle_id?: string;
  category: string;
  pickup_date: string;
  return_date: string;
  pickup_station_id: string;
  return_station_id: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  daily_rate: number;
  insurance_type: string;
  insurance_rate: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    country?: string;
    license_number?: string;
    birth_date?: string;
  } | null;
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    category: string;
  } | null;
  pickup_station: {
    name: string;
    name_en: string;
  } | null;
  return_station: {
    name: string;
    name_en: string;
  } | null;
}

interface ReservationsListProps {
  onCheckOut?: (reservationId: string) => void;
  onCheckIn?: (reservationId: string) => void;
  refreshTrigger?: number;
}

const statusOptions: { value: string; labelEl: string }[] = [
  { value: 'upcoming', labelEl: 'Επερχόμενη' },
  { value: 'active', labelEl: 'Ενεργή' },
  { value: 'completed', labelEl: 'Ολοκληρωμένη' },
  { value: 'cancelled', labelEl: 'Ακυρωμένη' }
];

const ReservationsList: React.FC<ReservationsListProps> = ({ onCheckOut, onCheckIn, refreshTrigger }) => {
  const { t, language } = useLanguage();
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewReservation, setViewReservation] = useState<ReservationRow | null>(null);
  const [actionError, setActionError] = useState('');
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reservationService.getAll();
      setReservations((data as ReservationRow[]) || []);
    } catch (err) {
      console.error('Failed to load reservations:', err);
      setError('Αποτυχία φόρτωσης κρατήσεων.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations, refreshTrigger]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setChangingStatus(id);
    setActionError('');
    try {
      await reservationService.update(id, { status: newStatus as ReservationRow['status'] });
      setReservations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus as ReservationRow['status'] } : r))
      );
      if (viewReservation?.id === id) {
        setViewReservation(prev => prev ? { ...prev, status: newStatus as ReservationRow['status'] } : null);
      }
    } catch (err) {
      console.error('Status change failed:', err);
      setActionError('Αποτυχία αλλαγής κατάστασης.');
    } finally {
      setChangingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setActionError('');
    try {
      await reservationService.delete(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      if (viewReservation?.id === id) {
        setViewReservation(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setActionError('Αποτυχία διαγραφής κράτησης.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const found = statusOptions.find(s => s.value === status);
    return found ? found.labelEl : status;
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter !== 'all' && reservation.status !== filter) return false;
    if (dateFilter && !reservation.pickup_date.startsWith(dateFilter)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const name = reservation.customer?.name?.toLowerCase() || '';
      const phone = reservation.customer?.phone || '';
      const cat = reservation.category?.toLowerCase() || '';
      if (!name.includes(term) && !phone.includes(term) && !cat.includes(term)) return false;
    }
    return true;
  });

  const getContractData = (reservation: ReservationRow) => ({
    reservation: {
      id: reservation.id,
      customer: {
        name: reservation.customer?.name || '',
        phone: reservation.customer?.phone || '',
        email: reservation.customer?.email || '',
        country: reservation.customer?.country || '',
        license_number: reservation.customer?.license_number || '',
        birth_date: reservation.customer?.birth_date || ''
      },
      vehicle: {
        plate: reservation.vehicle?.plate || '',
        brand: reservation.vehicle?.brand || '',
        model: reservation.vehicle?.model || reservation.category,
        category: reservation.category
      },
      pickup_date: reservation.pickup_date,
      return_date: reservation.return_date,
      pickup_station: reservation.pickup_station?.name || '',
      return_station: reservation.return_station?.name || '',
      daily_rate: Number(reservation.daily_rate) || 0,
      insurance_type: reservation.insurance_type || 'basic',
      insurance_rate: Number(reservation.insurance_rate) || 0,
      total_amount: Number(reservation.total_amount) || 0,
      extras: []
    }
  });

  const formatDateStr = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', {
        locale: language === 'el' ? el : undefined
      });
    } catch {
      return dateStr;
    }
  };

  // Loading state
  if (loading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-600">Φόρτωση κρατήσεων...</span>
      </div>
    );
  }

  // Error state
  if (error && reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <XMarkIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchReservations}
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
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Αναζήτηση
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Όνομα, τηλέφωνο, κατηγορία..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Κατάσταση
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Όλες</option>
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.labelEl}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ημερομηνία Παραλαβής
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilter('all'); setDateFilter(''); setSearchTerm(''); }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              Καθαρισμός
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredReservations.length === 0 && (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {reservations.length === 0
              ? 'Δεν υπάρχουν κρατήσεις ακόμα.'
              : 'Δεν βρέθηκαν κρατήσεις με τα επιλεγμένα φίλτρα.'}
          </p>
        </div>
      )}

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {reservation.customer?.name || 'Άγνωστος πελάτης'}
                  </h3>
                  <p className="text-sm text-gray-600">{reservation.customer?.phone || '-'}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Κατηγορία</p>
                  <p className="text-sm text-gray-900">{reservation.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Σύνολο</p>
                  <p className="text-sm font-semibold text-green-600">
                    {'\u20AC'}{Number(reservation.total_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Παραλαβή</p>
                  <p className="text-sm text-gray-900">{formatDateStr(reservation.pickup_date)}</p>
                  <p className="text-xs text-gray-500">{reservation.pickup_station?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Παράδοση</p>
                  <p className="text-sm text-gray-900">{formatDateStr(reservation.return_date)}</p>
                  <p className="text-xs text-gray-500">{reservation.return_station?.name || '-'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewReservation(reservation)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Προβολή
                  </button>
                  <ContractGenerator data={getContractData(reservation)} language="el" />
                  {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                      disabled={changingStatus === reservation.id}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      {changingStatus === reservation.id ? '...' : 'Ακύρωση'}
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  {reservation.status === 'upcoming' && (
                    <button
                      onClick={() => onCheckOut?.(reservation.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <TruckIcon className="h-4 w-4 mr-1" />
                      Check-out
                    </button>
                  )}
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => onCheckIn?.(reservation.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Check-in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Reservation Modal */}
      {viewReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setViewReservation(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto z-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Λεπτομέρειες Κράτησης</h2>
                <button onClick={() => setViewReservation(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewReservation.status)}`}>
                    {getStatusLabel(viewReservation.status)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Αλλαγή κατάστασης:</label>
                    <select
                      value={viewReservation.status}
                      onChange={(e) => handleStatusChange(viewReservation.id, e.target.value)}
                      disabled={changingStatus === viewReservation.id}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(s => (
                        <option key={s.value} value={s.value}>{s.labelEl}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Πελάτης</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm text-gray-900 font-medium">{viewReservation.customer?.name || '-'}</p>
                    <p className="text-sm text-gray-600">{viewReservation.customer?.phone || '-'}</p>
                    <p className="text-sm text-gray-600">{viewReservation.customer?.email || '-'}</p>
                    <p className="text-sm text-gray-600">{viewReservation.customer?.country || '-'}</p>
                    {viewReservation.customer?.license_number && (
                      <p className="text-sm text-gray-600">Άδεια: {viewReservation.customer.license_number}</p>
                    )}
                  </div>
                </div>

                {/* Vehicle / Category */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Όχημα</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm text-gray-900 font-medium">
                      {viewReservation.vehicle
                        ? `${viewReservation.vehicle.brand} ${viewReservation.vehicle.model} (${viewReservation.vehicle.plate})`
                        : `Κατηγορία ${viewReservation.category}`}
                    </p>
                  </div>
                </div>

                {/* Dates & Stations */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Παραλαβή</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <p className="text-sm text-gray-900">{formatDateStr(viewReservation.pickup_date)}</p>
                      <p className="text-sm text-gray-600">{viewReservation.pickup_station?.name || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Παράδοση</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <p className="text-sm text-gray-900">{formatDateStr(viewReservation.return_date)}</p>
                      <p className="text-sm text-gray-600">{viewReservation.return_station?.name || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Τιμολόγηση</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ημερήσιο τέλος</span>
                      <span className="text-gray-900">{'\u20AC'}{Number(viewReservation.daily_rate || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ασφάλεια ({viewReservation.insurance_type})</span>
                      <span className="text-gray-900">{'\u20AC'}{Number(viewReservation.insurance_rate || 0).toFixed(2)}/ημέρα</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                      <span>Σύνολο</span>
                      <span className="text-green-600">{'\u20AC'}{Number(viewReservation.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {viewReservation.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Σημειώσεις</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{viewReservation.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <div className="flex space-x-2">
                  <ContractGenerator data={getContractData(viewReservation)} language="el" />
                  {viewReservation.status !== 'cancelled' && viewReservation.status !== 'completed' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Θέλετε σίγουρα να ακυρώσετε αυτή την κράτηση;')) {
                          handleDelete(viewReservation.id);
                        }
                      }}
                      disabled={deleting === viewReservation.id}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      {deleting === viewReservation.id ? 'Διαγραφή...' : 'Διαγραφή'}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setViewReservation(null)}
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

export default ReservationsList;
