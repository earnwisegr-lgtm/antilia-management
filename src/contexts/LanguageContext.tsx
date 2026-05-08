import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  el: {
    // Navigation
    dashboard: 'Κεντρικό Ταμπλό',
    bookings: 'Κρατήσεις',
    customers: 'Πελάτες',
    fleet: 'Στόλος',
    pricing: 'Τιμές & Σεζόν',
    reports: 'Αναφορές',
    users: 'Χρήστες',
    settings: 'Ρυθμίσεις',
    
    // Dashboard
    today: 'Σήμερα',
    todayReservations: 'Κρατήσεις',
    todayRevenue: 'Έσοδα',
    todayPickups: 'Παραλαβές',
    todayReturns: 'Παραδόσεις',
    fleetOccupancy: 'Πληρότητα Στόλου - Επόμενες 7 Ημέρες',
    
    // Booking
    newBooking: 'Νέα Κράτηση',
    step: 'Βήμα',
    next: 'Επόμενο',
    previous: 'Προηγούμενο',
    complete: 'Ολοκλήρωση',
    
    // Step 1
    pickupDateTime: 'Ημερομηνία & Ώρα Παραλαβής',
    returnDateTime: 'Ημερομηνία & Ώρα Παράδοσης',
    pickupStation: 'Σταθμός Παραλαβής',
    returnStation: 'Σταθμός Παράδοσης',
    platanias: 'Πλατανιάς',
    agiamarina: 'Αγία Μαρίνα',
    airport: 'Αεροδρόμιο',
    
    // Step 2
    selectCategory: 'Επιλογή Κατηγορίας',
    availableVehicles: 'Διαθέσιμα Οχήματα',
    
    // Step 3
    pricingSection: 'Τιμολόγηση',
    dailyRate: 'Ημερήσιο Τέλος',
    insurance: 'Ασφάλεια',
    basic: 'Βασική',
    full: 'Πλήρης',
    extras: 'Έξτρα',
    childSeat: 'Παιδικό Κάθισμα',
    additionalDriver: 'Δεύτερος Οδηγός',
    total: 'Σύνολο',
    
    // Customer
    customerInfo: 'Στοιχεία Πελάτη',
    name: 'Όνομα',
    phone: 'Τηλέφωνο',
    email: 'Email',
    country: 'Χώρα',
    licenseNumber: 'Αριθμός Άδειας',
    birthDate: 'Ημερομηνία Γέννησης',
    source: 'Προέλευση',
    walkIn: 'Κατάστημα',
    telephone: 'Τηλέφωνο',
    instagram: 'Instagram',
    
    // Actions
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    edit: 'Επεξεργασία',
    delete: 'Διαγραφή',
    checkOut: 'Check-out',
    checkIn: 'Check-in',
    createAgreement: 'Δημιουργία Συμβολαίου',
    payment: 'Πληρωμή',
    
    // Status
    upcoming: 'Προσεχής',
    active: 'Ενεργή',
    completed: 'Ολοκληρωμένη',
    cancelled: 'Ακυρωμένη',
    available: 'Διαθέσιμο',
    reserved: 'Κρατημένο',
    service: 'Συντήρηση',
    
    // Common
    date: 'Ημερομηνία',
    time: 'Ώρα',
    days: 'Ημέρες',
    notes: 'Σημειώσεις',
    photos: 'Φωτογραφίες',
    damages: 'Ζημιές',
    fuelLevel: 'Επίπεδο Καυσίμου',
    odometer: 'Χιλιομετρητής'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    customers: 'Customers',
    fleet: 'Fleet',
    pricing: 'Pricing & Seasons',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    
    // Dashboard
    today: 'Today',
    todayReservations: 'Reservations',
    todayRevenue: 'Revenue',
    todayPickups: 'Pickups',
    todayReturns: 'Returns',
    fleetOccupancy: 'Fleet Occupancy - Next 7 Days',
    
    // Booking
    newBooking: 'New Booking',
    step: 'Step',
    next: 'Next',
    previous: 'Previous',
    complete: 'Complete',
    
    // Step 1
    pickupDateTime: 'Pickup Date & Time',
    returnDateTime: 'Return Date & Time',
    pickupStation: 'Pickup Station',
    returnStation: 'Return Station',
    platanias: 'Platanias',
    agiamarina: 'Agia Marina',
    airport: 'Airport',
    
    // Step 2
    selectCategory: 'Select Category',
    availableVehicles: 'Available Vehicles',
    
    // Step 3
    pricingSection: 'Pricing',
    dailyRate: 'Daily Rate',
    insurance: 'Insurance',
    basic: 'Basic',
    full: 'Full',
    extras: 'Extras',
    childSeat: 'Child Seat',
    additionalDriver: 'Additional Driver',
    total: 'Total',
    
    // Customer
    customerInfo: 'Customer Information',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    country: 'Country',
    licenseNumber: 'License Number',
    birthDate: 'Birth Date',
    source: 'Source',
    walkIn: 'Walk-in',
    telephone: 'Telephone',
    instagram: 'Instagram',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    checkOut: 'Check-out',
    checkIn: 'Check-in',
    createAgreement: 'Create Agreement',
    payment: 'Payment',
    
    // Status
    upcoming: 'Upcoming',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    available: 'Available',
    reserved: 'Reserved',
    service: 'Service',
    
    // Common
    date: 'Date',
    time: 'Time',
    days: 'Days',
    notes: 'Notes',
    photos: 'Photos',
    damages: 'Damages',
    fuelLevel: 'Fuel Level',
    odometer: 'Odometer'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('el');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};