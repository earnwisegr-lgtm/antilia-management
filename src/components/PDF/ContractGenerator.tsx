import React from 'react';
import jsPDF from 'jspdf';
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
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ data }) => {
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
    doc.text('Chania, Crete | Tel: +30 28210 12345 | info@antilia-rentacar.gr', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CAR RENTAL AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Contract Number: ${data.reservation.id}`, 20, yPosition);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, pageWidth - 60, yPosition);

    yPosition += 20;

    // Customer Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION', 20, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const customerInfo = [
      `Name: ${data.reservation.customer.name}`,
      `Phone: ${data.reservation.customer.phone}`,
      `Email: ${data.reservation.customer.email}`,
      `Country: ${data.reservation.customer.country}`,
      `Driving License: ${data.reservation.customer.license_number}`,
      `Date of Birth: ${new Date(data.reservation.customer.birth_date).toLocaleDateString('en-US')}`
    ];

    customerInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Vehicle Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE INFORMATION', 20, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const vehicleInfo = [
      `License Plate: ${data.reservation.vehicle.plate}`,
      `Vehicle: ${data.reservation.vehicle.brand} ${data.reservation.vehicle.model}`,
      `Vehicle Category: ${data.reservation.vehicle.category}`
    ];

    vehicleInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Rental Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RENTAL DETAILS', 20, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const rentalInfo = [
      `Pickup Date: ${new Date(data.reservation.pickup_date).toLocaleDateString('en-US')} - ${data.reservation.pickup_station}`,
      `Return Date: ${new Date(data.reservation.return_date).toLocaleDateString('en-US')} - ${data.reservation.return_station}`,
      `Daily Rate: EUR ${data.reservation.daily_rate.toFixed(2)}`,
      `Insurance: ${data.reservation.insurance_type === 'full' ? 'Full Coverage' : 'Basic'} (EUR ${data.reservation.insurance_rate}/day)`
    ];

    rentalInfo.forEach((info) => {
      doc.text(info, 20, yPosition);
      yPosition += 6;
    });

    // Extras
    if (data.reservation.extras.length > 0) {
      yPosition += 5;
      doc.text('Extras:', 20, yPosition);
      yPosition += 6;

      data.reservation.extras.forEach((extra) => {
        doc.text(`- ${extra.name}: ${extra.quantity} x EUR ${extra.price.toFixed(2)}`, 25, yPosition);
        yPosition += 6;
      });
    }

    yPosition += 10;

    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL AMOUNT: EUR ${data.reservation.total_amount.toFixed(2)}`, 20, yPosition);

    yPosition += 20;

    // Terms and Conditions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS AND CONDITIONS', 20, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const terms = [
      '1. The vehicle is delivered with a full fuel tank and must be returned at the same level.',
      '2. The renter is fully responsible for any damage incurred during the rental period.',
      '3. Late returns are subject to a charge of EUR 10.00 per hour.',
      '4. Smoking and pets are strictly prohibited inside the vehicle.',
      '5. In the event of an accident, the renter must immediately notify the company and local authorities.'
    ];

    terms.forEach((term) => {
      doc.text(term, 20, yPosition, { maxWidth: pageWidth - 40 });
      yPosition += 8;
    });

    yPosition += 20;

    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Customer Signature:', 20, yPosition);
    doc.text('Company Signature:', pageWidth - 100, yPosition);

    doc.line(20, yPosition + 10, 80, yPosition + 10);
    doc.line(pageWidth - 100, yPosition + 10, pageWidth - 20, yPosition + 10);

    // Save the PDF
    doc.save(`contract-${data.reservation.id}.pdf`);
  };

  return (
    <button
      onClick={generateContract}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
    >
      <DocumentTextIcon className="h-4 w-4 mr-2" />
      Download Contract
    </button>
  );
};

export default ContractGenerator;
