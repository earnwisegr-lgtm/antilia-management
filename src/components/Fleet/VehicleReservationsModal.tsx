import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarDaysIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';
import type { Vehicle } from '../../types';

interface VehicleReservation {
  id: string;
  pickup_date: string;
  return_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  customer: { name: string } | null;
  pickup_station: { name: string } | null;
}

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

const statusOrder: Record<string, number> = { active: 0, upcoming: 1, completed: 2, cancelled: 3 };

const statusLabels: Record<string, string> = {
  active: 'Ενεργή',
  upcoming: 'Επερχόμενη',
  completed: 'Ολοκληρωμένη',
  cancelled: 'Ακυρωμένη',
};

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  upcoming: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
};

const VehicleReservationsModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const [reservations, setReservations] = useState<VehicleReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    supabase
      .from('reservations')
      .select(`
        id, pickup_date, return_date, status,
        customer:customers(name),
        pickup_station:pickup_station_id(name)
      `)
      .eq('vehicle_id', vehicle.id)
      .order('pickup_date', { ascending: false })
      .then(({ data }) => {
        setReservations((data as VehicleReservation[]) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vehicle.id]);

  const visibleReservations = reservations
    .filter(r => r.status !== 'cancelled')
    .sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  const activeOrUpcoming = reservations.find(r => r.status === 'active' || r.status === 'upcoming');

  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{vehicle.plate}</h2>
            <p className="text-sm text-gray-500">{vehicle.brand} {vehicle.model} &middot; {vehicle.category}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Availability badge */}
        <div className="px-6 py-3 border-b bg-gray-50">
          {vehicle.status === 'service' ? (
            <span className="text-sm font-medium text-red-700">Σε συντήρηση</span>
          ) : activeOrUpcoming ? (
            <div className="flex items-center text-sm text-yellow-800">
              <ClockIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>
                {activeOrUpcoming.status === 'active' ? 'Ενοικιασμένο' : 'Κρατημένο'} από {formatDate(activeOrUpcoming.pickup_date).split(' ')[0]} έως {formatDate(activeOrUpcoming.return_date).split(' ')[0]}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-700">
              <CheckCircleIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>Διαθέσιμο τώρα</span>
            </div>
          )}
        </div>

        {/* Reservation list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
            Κρατήσεις ({visibleReservations.length})
          </h3>

          {loading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Φόρτωση...</p>
          ) : visibleReservations.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Δεν υπάρχουν κρατήσεις.</p>
          ) : (
            <div className="space-y-3">
              {visibleReservations.map(r => (
                <div key={r.id} className="border rounded-md p-3 text-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-gray-900">{r.customer?.name || 'Άγνωστος'}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || ''}`}>
                      {statusLabels[r.status] || r.status}
                    </span>
                  </div>
                  <div className="text-gray-500 space-y-0.5">
                    <p>Παραλαβή: {formatDate(r.pickup_date)}</p>
                    <p>Επιστροφή: {formatDate(r.return_date)}</p>
                    {r.pickup_station?.name && <p>Σταθμός: {r.pickup_station.name}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleReservationsModal;
