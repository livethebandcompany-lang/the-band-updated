"use client";

import React, { useState } from 'react';

export default function DownloadButton({ bookingId, invoiceNumber }: { bookingId: string, invoiceNumber: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPdf = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/invoice?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');
      
      const blob = await response.blob();
      
      // Create hidden link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Invoice_${invoiceNumber || 'TBC'}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('PDF fetch failed:', err);
      alert('Could not download PDF. Please try the print button (Ctrl+P) directly on the browser as a fallback.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-center mt-8 mb-4 print:hidden">
      <button
        onClick={downloadPdf}
        disabled={isDownloading}
        className="group relative flex items-center gap-3 px-8 py-3 bg-[#0a0a0a] border border-[#c5a059] text-[#c5a059] text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#c5a059] hover:text-black shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  );
}
