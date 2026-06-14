import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * EXCEL EXPORT UTILITY
 * Converts booking data into a professional Excel spreadsheet with performance details.
 */
export const exportBookingsToExcel = (bookings: any[], filename = 'Booking_Registry_Operations') => {
  // 1. Prepare data for export
  const exportData = bookings.map((b) => ({
    'Ref ID': b._id?.slice(-6).toUpperCase() || 'N/A',
    'Status': b.status?.toUpperCase() || 'N/A',
    'Event Date': b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-GB') : 'N/A',
    'Client Name': b.clientName || 'N/A',
    'Contact': b.clientPhone || 'N/A',
    'Email': b.clientEmail || 'N/A',
    'City': b.city || 'N/A',
    'Venue': b.venueName || 'N/A',
    'Event Type': b.eventType?.toUpperCase() || 'N/A',
    'Setup': b.performanceType?.replace('_', ' ').toUpperCase() || 'N/A',
    'Time Slot': `${b.startTime || ''} - ${b.endTime || ''}`,
    
    // Performance Lifecycle Details
    'Actual End Time': b.completionReport?.actualEndTime || 'N/A',
    'Team Members': b.completionReport?.teamMembers?.map((m: any) => `${m.name} (${m.role})`).join(', ') || 'N/A',
    'Completed At': b.completionReport?.completedAt ? new Date(b.completionReport.completedAt).toLocaleString() : 'N/A',
    
    // Financial Details
    'Financial Status': b.paymentStatus?.toUpperCase() || 'N/A',
    'Invoice Number': b.invoiceNumber || 'N/A',
    'Razorpay Payment ID': b.razorpayPaymentId || 'N/A',
    'Base Price (₹)': b.quotedAmount || 0,
    'Discount (₹)': b.discountAmount || 0,
    'Additional Charges (₹)': b.additionalChargesAmount || 0,
    'Tax (₹)': b.taxAmount || 0,
    'Grand Total (₹)': b.totalAmount || 0,
    
    // Admin Details
    'Source': b.source?.toUpperCase() || 'N/A',
    'Sales Lead': b.salesPerson?.toUpperCase() || 'N/A',
    'Created At': b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A',
  }));

  // 2. Create Sheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Operational Ledger');

  // 3. Style (Basic header styling via utility)
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // 4. Save File
  const timestamp = new Date().toISOString().split('T')[0];
  saveAs(data, `${filename}_${timestamp}.xlsx`);
};
