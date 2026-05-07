import React from 'react';
import jsPDF from 'jspdf';
import { useLanguage } from '../../contexts/LanguageContext';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ContractData {
  reservation: {
    id: string;
    customer: {
      name: string;
      phone: string;
      email: string;
      country: string;
      license_number: string;
      birth_date: string;
    };
    vehicle: {
      plate: string;
      brand: string;
      model: string;
      category: string;
    };
    pickup_date: string;
    return_date: string;
    pickup_station: string;
    return_station: string;
    daily_rate: number;
    insurance_type: string;
    insurance_rate: number;
    total_amount: number;
    extras: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

interface ContractGeneratorProps {
  data: ContractData;
  language?: 'el' | 'en';
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ data, language = 'el' }) => {
  const { t } = useLanguage();

  const generateContract = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Company Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ANTILIA RENT A CAR', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Χανιά, Κρήτη | Tel: +30 28210 12345 | info@antilia-rentacar.gr', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'el' ? 'ΣΥΜΒΟΛΑΙΟ ΕΝΟΙΚΙΑΣΗΣ ΑΥΤΟΚΙΝΗΤΟΥ' : 'CAR RENTAL AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${language === 'el' ? 'Αριθμός Συμβολαίου' : 'Contract Number'}: ${data.reservation.id}`, 20, yPosition);
    doc.text(`${language === 'el' ? 'Ημερομηνία' : 'Date'}: ${new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}`, pageWidth - 60, yPosition);
    
    yPosition += 20;

    // Customer Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'el' ? 'ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ' : 'CUSTOMER INFORMATION', 20, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const customerInfo = [
      `${language === 'el' ? 'Όνομα' : 'Name'}: ${data.reservation.customer.name}`,
      `${language === 'el' ? 'Τηλέφωνο' : 'Phone'}: ${data.reservation.customer.phone}`,
      `Email: ${data.reservation.customer.email}`,
      `${language === 'el' ? 'Χώρα' : 'Country'}: ${data.reservation.customer.country}`,
      `${language === 'el' ? 'Άδεια Οδήγησης' : 'Driving License'}: ${data.reservation.customer.license_number}`,
      `${language === 'el' ? 'Ημ. Γέννησης' : 'Birth Date'}: ${new Date(data.reservation.customer.birth_date).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')}`
    ];

    customerInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Vehicle Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'el' ? 'ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ' : 'VEHICLE INFORMATION', 20, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const vehicleInfo = [
      `${language === 'el' ? 'Πινακίδα' : 'License Plate'}: ${data.reservation.vehicle.plate}`,
      `${language === 'el' ? 'Όχημα' : 'Vehicle'}: ${data.reservation.vehicle.brand} ${data.reservation.vehicle.model}`,
      `${language === 'el' ? 'Κατηγορία' : 'Category'}: ${data.reservation.vehicle.category}`
    ];

    vehicleInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Rental Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'el' ? 'ΛΕΠΤΟΜΕΡΕΙΕΣ ΕΝΟΙΚΙΑΣΗΣ' : 'RENTAL DETAILS', 20, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const rentalInfo = [
      `${language === 'el' ? 'Παραλαβή' : 'Pickup'}: ${new Date(data.reservation.pickup_date).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')} - ${data.reservation.pickup_station}`,
      `${language === 'el' ? 'Παράδοση' : 'Return'}: ${new Date(data.reservation.return_date).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US')} - ${data.reservation.return_station}`,
      `${language === 'el' ? 'Ημερήσιο Τέλος' : 'Daily Rate'}: €${data.reservation.daily_rate}`,
      `${language === 'el' ? 'Ασφάλεια' : 'Insurance'}: ${data.reservation.insurance_type} (€${data.reservation.insurance_rate}/day)`
    ];

    rentalInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    // Extras
    if (data.reservation.extras.length > 0) {
      yPosition += 5;
      doc.text(language === 'el' ? 'Έξτρα:' : 'Extras:', 20, yPosition);
      yPosition += 6;
      
      data.reservation.extras.forEach((extra) => {
        doc.text(`- ${extra.name}: ${extra.quantity} x €${extra.price}`, 25, yPosition);
        yPosition += 6;
      });
    }

    yPosition += 10;

    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${language === 'el' ? 'ΣΥΝΟΛΟ' : 'TOTAL'}: €${data.reservation.total_amount}`, 20, yPosition);

    yPosition += 20;

    // Terms and Conditions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'el' ? 'ΟΡΟΙ ΚΑΙ ΠΡΟΫΠΟΘΕΣΕΙΣ' : 'TERMS AND CONDITIONS', 20, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const terms = language === 'el' ? [
      '1. Το όχημα παραδίδεται με πλήρες ντεπόζιτο καυσίμου και πρέπει να επιστραφεί με το ίδιο επίπεδο.',
      '2. Ο ενοικιαστής είναι υπεύθυνος για όλες τις ζημιές που προκαλούνται κατά τη διάρκεια της ενοικίασης.',
      '3. Η καθυστέρηση επιστροφής χρεώνεται με €10/ώρα.',
      '4. Απαγορεύεται το κάπνισμα και τα κατοικίδια στο όχημα.',
      '5. Σε περίπτωση ατυχήματος, ειδοποιήστε αμέσως την εταιρεία και την αστυνομία.'
    ] : [
      '1. The vehicle is delivered with a full fuel tank and must be returned with the same level.',
      '2. The renter is responsible for all damages caused during the rental period.',
      '3. Late return is charged at €10/hour.',
      '4. Smoking and pets are prohibited in the vehicle.',
      '5. In case of accident, immediately notify the company and police.'
    ];

    terms.forEach((term) => {
      doc.text(term, 20, yPosition, { maxWidth: pageWidth - 40 });
      yPosition += 8;
    });

    yPosition += 20;

    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(language === 'el' ? 'Υπογραφή Πελάτη:' : 'Customer Signature:', 20, yPosition);
    doc.text(language === 'el' ? 'Υπογραφή Εταιρείας:' : 'Company Signature:', pageWidth - 100, yPosition);
    
    doc.line(20, yPosition + 10, 80, yPosition + 10);
    doc.line(pageWidth - 100, yPosition + 10, pageWidth - 20, yPosition + 10);

    // Save the PDF
    doc.save(`contract-${data.reservation.id}-${language}.pdf`);
  };

  return (
    <button
      onClick={generateContract}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
    >
      <DocumentTextIcon className="h-4 w-4 mr-2" />
      {language === 'el' ? 'Συμβόλαιο (ΕΛ)' : 'Contract (EN)'}
    </button>
  );
};

export default ContractGenerator;