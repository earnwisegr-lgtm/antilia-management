import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { company } from '../../lib/company';

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

let cachedFontBase64: string | null = null;
let fontLoadFailed = false;

async function loadUnicodeFont(): Promise<string | null> {
  if (fontLoadFailed) return null;
  if (cachedFontBase64) return cachedFontBase64;

  try {
    const response = await fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/greek-400-normal.ttf'
    );
    if (!response.ok) throw new Error('Font fetch failed');
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    cachedFontBase64 = btoa(binary);
    return cachedFontBase64;
  } catch {
    fontLoadFailed = true;
    return null;
  }
}

function registerFont(doc: jsPDF, fontBase64: string) {
  doc.addFileToVFS('NotoSans-Regular.ttf', fontBase64);
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
}

function hasNonLatinChars(text: string): boolean {
  return /[^\u0000-\u024F]/.test(text);
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ data }) => {
  const [generating, setGenerating] = useState(false);

  const generateContract = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Try to load Unicode font for Greek characters
      let unicodeFontAvailable = false;
      const needsUnicode =
        hasNonLatinChars(data.reservation.customer.name) ||
        hasNonLatinChars(data.reservation.customer.country) ||
        hasNonLatinChars(data.reservation.pickup_station) ||
        hasNonLatinChars(data.reservation.return_station);

      if (needsUnicode) {
        const fontBase64 = await loadUnicodeFont();
        if (fontBase64) {
          registerFont(doc, fontBase64);
          unicodeFontAvailable = true;
        }
      }

      const useUnicodeFont = (text: string) => {
        if (unicodeFontAvailable && hasNonLatinChars(text)) {
          doc.setFont('NotoSans', 'normal');
        } else {
          doc.setFont('helvetica', 'normal');
        }
      };

      const useBoldFont = () => {
        doc.setFont('helvetica', 'bold');
      };

      // Company Header
      doc.setFontSize(20);
      useBoldFont();
      doc.text(company.contractHeader, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${company.contractSubheader} | Tel: ${company.phone} | ${company.email}`, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 20;
      doc.setFontSize(16);
      useBoldFont();
      doc.text('CAR RENTAL AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Contract Number: ${data.reservation.id.substring(0, 8).toUpperCase()}`, 20, yPosition);
      doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, pageWidth - 60, yPosition);

      yPosition += 20;

      // Customer Information
      doc.setFontSize(12);
      useBoldFont();
      doc.text('CUSTOMER INFORMATION', 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);

      const customerFields = [
        { label: 'Name', value: data.reservation.customer.name },
        { label: 'Phone', value: data.reservation.customer.phone },
        { label: 'Email', value: data.reservation.customer.email },
        { label: 'Country', value: data.reservation.customer.country },
        { label: 'Driving License', value: data.reservation.customer.license_number },
        { label: 'Date of Birth', value: data.reservation.customer.birth_date ? new Date(data.reservation.customer.birth_date).toLocaleDateString('en-US') : '' }
      ];

      customerFields.forEach(({ label, value }) => {
        if (!value) return;
        doc.setFont('helvetica', 'normal');
        doc.text(`${label}: `, 20, yPosition);
        const labelWidth = doc.getTextWidth(`${label}: `);
        useUnicodeFont(value);
        doc.text(value, 20 + labelWidth, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Vehicle Information
      doc.setFontSize(12);
      useBoldFont();
      doc.text('VEHICLE INFORMATION', 20, yPosition);

      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      doc.text(`License Plate: ${data.reservation.vehicle.plate}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Vehicle: ${data.reservation.vehicle.brand} ${data.reservation.vehicle.model}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Vehicle Category: ${data.reservation.vehicle.category}`, 20, yPosition);
      yPosition += 6;

      yPosition += 10;

      // Rental Details
      doc.setFontSize(12);
      useBoldFont();
      doc.text('RENTAL DETAILS', 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);

      // Pickup
      const pickupDateStr = data.reservation.pickup_date ? new Date(data.reservation.pickup_date).toLocaleDateString('en-US') : '';
      doc.setFont('helvetica', 'normal');
      doc.text(`Pickup Date: ${pickupDateStr}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text('Pickup Station: ', 20, yPosition);
      const psLabelWidth = doc.getTextWidth('Pickup Station: ');
      useUnicodeFont(data.reservation.pickup_station);
      doc.text(data.reservation.pickup_station || '-', 20 + psLabelWidth, yPosition);
      yPosition += 6;

      // Return
      const returnDateStr = data.reservation.return_date ? new Date(data.reservation.return_date).toLocaleDateString('en-US') : '';
      doc.setFont('helvetica', 'normal');
      doc.text(`Return Date: ${returnDateStr}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text('Return Station: ', 20, yPosition);
      const rsLabelWidth = doc.getTextWidth('Return Station: ');
      useUnicodeFont(data.reservation.return_station);
      doc.text(data.reservation.return_station || '-', 20 + rsLabelWidth, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`Daily Rate: EUR ${data.reservation.daily_rate.toFixed(2)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Insurance: ${data.reservation.insurance_type === 'full' ? 'Full Coverage' : 'Basic'} (EUR ${data.reservation.insurance_rate}/day)`, 20, yPosition);
      yPosition += 6;

      // Extras
      if (data.reservation.extras && data.reservation.extras.length > 0) {
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
      useBoldFont();
      doc.text(`TOTAL AMOUNT: EUR ${data.reservation.total_amount.toFixed(2)}`, 20, yPosition);

      yPosition += 20;

      // Terms and Conditions
      doc.setFontSize(10);
      useBoldFont();
      doc.text('TERMS AND CONDITIONS', 20, yPosition);

      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const terms = [
        '1. The vehicle must be returned with the same fuel level provided at pickup.',
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

      // Save
      doc.save(`contract-${data.reservation.id.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generateContract}
      disabled={generating}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <DocumentTextIcon className="h-4 w-4 mr-2" />
      {generating ? 'Generating...' : 'Download Contract'}
    </button>
  );
};

export default ContractGenerator;
