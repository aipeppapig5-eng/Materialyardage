import { jsPDF } from 'jspdf';
import { BOMItem } from '../types';

interface PDFEstimateData {
  projectName: string;
  items: BOMItem[];
  deliveryFee: number;
  taxRatePercent: number;
}

export function generateBOMPDF({
  projectName,
  items,
  deliveryFee,
  taxRatePercent,
}: PDFEstimateData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const emeraldPrimary = [6, 95, 70]; // #065f46
  const emeraldLight = [236, 253, 245]; // #ecfdf5
  const slate900 = [15, 23, 42]; // #0f172a
  const slate600 = [71, 85, 105]; // #475569
  const slate400 = [148, 163, 184]; // #94a3b8
  const tableHeaderBg = [15, 23, 42]; // #0f172a

  let currentY = 0;

  // 1. Header Banner
  doc.setFillColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MATERIAL YARDAGE', margin, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('Professional Material Estimation & Project Bill of Materials', margin, 58);
  doc.text('www.materialyardage.com', margin, 70);

  // Estimate badge on right
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const estimateNo = `EST-${Date.now().toString().slice(-6)}`;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT ESTIMATE', pageWidth - margin, 42, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text(`Reference: #${estimateNo}`, pageWidth - margin, 58, { align: 'right' });
  doc.text(`Date: ${dateStr}`, pageWidth - margin, 70, { align: 'right' });

  currentY = 120;

  // 2. Project Title Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 54, 4, 4, 'FD');

  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(projectName || 'Project Material Estimate', margin + 14, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(
    `Total Line Items: ${items.length} · Pricing basis: Delivered / Jobsite Quote`,
    margin + 14,
    currentY + 38
  );

  currentY += 75;

  // 3. Table Column Headers
  const colX = {
    idx: margin + 8,
    desc: margin + 30,
    qty: margin + 280,
    price: margin + 370,
    subtotal: margin + contentWidth - 14,
  };

  doc.setFillColor(tableHeaderBg[0], tableHeaderBg[1], tableHeaderBg[2]);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  doc.text('#', colX.idx, currentY + 16);
  doc.text('Item Description & Details', colX.desc, currentY + 16);
  doc.text('Quantity', colX.qty, currentY + 16);
  doc.text('Unit Price', colX.price, currentY + 16);
  doc.text('Total ($)', colX.subtotal, currentY + 16, { align: 'right' });

  currentY += 24;

  // 4. Item Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  let subtotal = 0;

  items.forEach((item, idx) => {
    const itemTotal = item.primaryQuantity * item.unitPrice;
    subtotal += itemTotal;

    const rowHeight = item.notes || item.secondarySummary ? 32 : 24;

    // Check if new page is needed
    if (currentY + rowHeight > pageHeight - 160) {
      doc.addPage();
      currentY = 40;
    }

    // Zebra striping
    if (idx % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');

    // Bottom row border line
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    // Index
    doc.setTextColor(slate400[0], slate400[1], slate400[2]);
    doc.text(`${idx + 1}`, colX.idx, currentY + 15);

    // Name & Sub-details
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.setFont('helvetica', 'bold');

    // Truncate name if too long
    const cleanName = doc.splitTextToSize(item.name, 235);
    doc.text(cleanName[0], colX.desc, currentY + 14);

    doc.setFont('helvetica', 'normal');
    if (item.secondarySummary || item.notes) {
      doc.setFontSize(7.5);
      doc.setTextColor(slate600[0], slate600[1], slate600[2]);
      const subText = item.secondarySummary || item.notes || '';
      const cleanSub = doc.splitTextToSize(subText, 235);
      doc.text(cleanSub[0], colX.desc, currentY + 25);
      doc.setFontSize(9);
    }

    // Quantity
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(`${item.primaryQuantity} ${item.primaryUnit}`, colX.qty, currentY + 15);

    // Unit Price
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(`$${item.unitPrice.toFixed(2)}`, colX.price, currentY + 15);

    // Subtotal
    doc.setTextColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${itemTotal.toFixed(2)}`, colX.subtotal, currentY + 15, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    currentY += rowHeight;
  });

  // Table bottom border
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 20;

  // 5. Totals & Financial Box
  const taxAmount = (subtotal + deliveryFee) * (taxRatePercent / 100);
  const totalBudget = subtotal + deliveryFee + taxAmount;

  const totalsBoxWidth = 240;
  const totalsBoxX = margin + contentWidth - totalsBoxWidth;

  // Background box for totals
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsBoxX, currentY, totalsBoxWidth, 90, 4, 4, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Materials Subtotal:', totalsBoxX + 14, currentY + 18);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(`$${subtotal.toFixed(2)}`, totalsBoxX + totalsBoxWidth - 14, currentY + 18, { align: 'right' });

  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Estimated Delivery Fee:', totalsBoxX + 14, currentY + 34);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(`$${deliveryFee.toFixed(2)}`, totalsBoxX + totalsBoxWidth - 14, currentY + 34, { align: 'right' });

  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`Estimated Tax (${taxRatePercent}%):`, totalsBoxX + 14, currentY + 50);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(`$${taxAmount.toFixed(2)}`, totalsBoxX + totalsBoxWidth - 14, currentY + 50, { align: 'right' });

  // Total highlight bar
  doc.setFillColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.roundedRect(totalsBoxX + 6, currentY + 60, totalsBoxWidth - 12, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL ESTIMATED BUDGET:', totalsBoxX + 14, currentY + 76);
  doc.text(`$${totalBudget.toFixed(2)}`, totalsBoxX + totalsBoxWidth - 14, currentY + 76, { align: 'right' });

  // 6. Notes on the left side of totals
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Important Ordering & Field Notes:', margin, currentY + 18);
  doc.setFontSize(7.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  const notesText = [
    '• Quantities include stated jobsite loss margins & fabric repeat allowances.',
    '• Confirm bulk access path clearance for tandem/tri-axle delivery trucks.',
    '• Soil & gravel tonnage is estimated based on standard dry-to-damp density.',
    '• Fabric cuts exclude outer woven selvedge edges (trim before assembly).',
  ];
  notesText.forEach((note, nIdx) => {
    doc.text(note, margin, currentY + 32 + nIdx * 12);
  });

  // 7. Footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 10, margin + contentWidth, footerY - 10);

  doc.setFontSize(7.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text('Generated with Material Yardage — www.materialyardage.com', margin, footerY);
  doc.text(`Page 1 of 1 · Reference #${estimateNo}`, margin + contentWidth, footerY, { align: 'right' });

  // Trigger download
  const cleanFilename = (projectName || 'Material_Yardage_Estimate')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  doc.save(`${cleanFilename}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export interface JobSheetPDFData {
  jobTitle: string;
  category: string;
  clientName: string;
  siteAddress: string;
  contractorName: string;
  referenceNo: string;
  workDate: string;
  dimensions: { label: string; value: string }[];
  primaryQuantity: { label: string; value: string; unit: string };
  secondaryBreakdown: { label: string; value: string }[];
  allowanceNote?: string;
  costEstimate?: {
    unitPrice: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  jobSiteNotes?: string;
}

export function generateJobSheetPDF(data: JobSheetPDFData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  const emeraldPrimary = [6, 95, 70];
  const slate900 = [15, 23, 42];
  const slate600 = [71, 85, 105];
  const slate400 = [148, 163, 184];

  // 1. Header Banner
  doc.setFillColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MATERIAL YARDAGE', margin, 36);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('Engineering Takeoff & Field Specification Sheet', margin, 50);
  doc.text('www.materialyardage.com', margin, 62);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('JOB-SITE SPEC SHEET', pageWidth - margin, 36, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text(`Ref: ${data.referenceNo}`, pageWidth - margin, 50, { align: 'right' });
  doc.text(`Date: ${data.workDate}`, pageWidth - margin, 62, { align: 'right' });

  let currentY = 100;

  // 2. Project & Site Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 54, 4, 4, 'FD');

  const halfWidth = contentWidth / 2;
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.setFontSize(7.5);
  doc.text('PROJECT / CLIENT:', margin + 12, currentY + 16);
  doc.text('SITE ADDRESS:', margin + 12, currentY + 38);
  doc.text('CONTRACTOR / PREPARED BY:', margin + halfWidth + 8, currentY + 16);
  doc.text('CATEGORY / WORK ORDER:', margin + halfWidth + 8, currentY + 38);

  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(data.clientName || 'General Project', margin + 12, currentY + 28);
  doc.text(data.siteAddress || 'Job Site Location', margin + 12, currentY + 48);
  doc.text(data.contractorName || 'Material Yardage User', margin + halfWidth + 8, currentY + 28);
  doc.text(data.category.toUpperCase(), margin + halfWidth + 8, currentY + 48);

  currentY += 70;

  // 3. Calculator Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text(data.jobTitle, margin, currentY);
  currentY += 16;

  // 4. Primary Quantity Highlight Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, currentY, contentWidth, 50, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.text('TOTAL MATERIAL REQUIREMENT (INCL. JOB-SITE BUFFER)', margin + 14, currentY + 20);

  doc.setFontSize(18);
  doc.setTextColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.text(`${data.primaryQuantity.value} ${data.primaryQuantity.unit}`, margin + 14, currentY + 40);

  if (data.allowanceNote) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(data.allowanceNote, margin + contentWidth - 14, currentY + 36, { align: 'right' });
  }

  currentY += 66;

  // 5. Dimension Specifications Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('1. Dimensional Input Specifications', margin, currentY);
  currentY += 10;

  doc.setFillColor(slate900[0], slate900[1], slate900[2]);
  doc.rect(margin, currentY, contentWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('PARAMETER', margin + 12, currentY + 13);
  doc.text('SPECIFIED VALUE', margin + contentWidth - 14, currentY + 13, { align: 'right' });
  currentY += 20;

  data.dimensions.forEach((dim, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 18, margin + contentWidth, currentY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(dim.label, margin + 12, currentY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(dim.value, margin + contentWidth - 14, currentY + 12, { align: 'right' });
    currentY += 18;
  });

  currentY += 14;

  // 6. Packaging & Unit Breakdown
  if (data.secondaryBreakdown.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text('2. Packaging, Logistics & Delivery Breakdown', margin, currentY);
    currentY += 10;

    doc.setFillColor(slate900[0], slate900[1], slate900[2]);
    doc.rect(margin, currentY, contentWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('PACKAGING / UNIT EQUIVALENT', margin + 12, currentY + 13);
    doc.text('ESTIMATED QUANTITY', margin + contentWidth - 14, currentY + 13, { align: 'right' });
    currentY += 20;

    data.secondaryBreakdown.forEach((sec, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(margin, currentY, contentWidth, 18, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY + 18, margin + contentWidth, currentY + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slate600[0], slate600[1], slate600[2]);
      doc.text(sec.label, margin + 12, currentY + 12);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(slate900[0], slate900[1], slate900[2]);
      doc.text(sec.value, margin + contentWidth - 14, currentY + 12, { align: 'right' });
      currentY += 18;
    });

    currentY += 14;
  }

  // 7. Cost Breakdown (if included)
  if (data.costEstimate && data.costEstimate.total > 0) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 42, 3, 3, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(`Unit Price: $${data.costEstimate.unitPrice.toFixed(2)} / unit`, margin + 14, currentY + 16);
    doc.text(`Subtotal: $${data.costEstimate.subtotal.toFixed(2)}  ·  Tax (8%): $${data.costEstimate.tax.toFixed(2)}`, margin + 14, currentY + 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
    doc.text(`Estimated Total: $${data.costEstimate.total.toFixed(2)}`, margin + contentWidth - 14, currentY + 24, { align: 'right' });

    currentY += 52;
  }

  // 8. Job Site Notes
  if (data.jobSiteNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text('Job-Site Delivery & Access Notes:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(data.jobSiteNotes, margin, currentY + 12);
    currentY += 28;
  }

  // 9. Signatures Block
  const sigBoxY = pageHeight - 95;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, sigBoxY, margin + 220, sigBoxY);
  doc.line(margin + contentWidth - 220, sigBoxY, margin + contentWidth, sigBoxY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Authorized By (Contractor / Foreman)', margin, sigBoxY + 12);
  doc.text('Date', margin + 180, sigBoxY + 12);

  doc.text('Accepted / Verified By (Owner / Client)', margin + contentWidth - 220, sigBoxY + 12);
  doc.text('Date', margin + contentWidth - 40, sigBoxY + 12);

  // 10. Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(7.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text('Generated with Material Yardage — www.materialyardage.com', margin, footerY);
  doc.text(`Job Sheet #${data.referenceNo}`, margin + contentWidth, footerY, { align: 'right' });

  doc.save(`JobSite_SpecSheet_${data.referenceNo}.pdf`);
}
