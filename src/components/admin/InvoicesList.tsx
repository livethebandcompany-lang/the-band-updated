'use client';

import { useState } from 'react';
import { FileText, Download, Send, Search, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Edit2 } from 'lucide-react';
import EditBookingModal from './EditBookingModal';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  billingName?: string;
  eventType: string;
  eventDate: string;
  city: string;
  venueName: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMode?: string;
  razorpayPaymentId?: string;
}

interface InvoicesListProps {
  invoices: Invoice[];
  isAdmin: boolean;
}

export default function InvoicesList({ invoices, isAdmin }: InvoicesListProps) {
  const router = useRouter();
  const { showToast: toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const search = searchTerm.toLowerCase();
    const searchMatch =
      inv.invoiceNumber?.toLowerCase().includes(search) ||
      inv.clientName?.toLowerCase().includes(search) ||
      inv.clientEmail?.toLowerCase().includes(search) ||
      inv.city?.toLowerCase().includes(search);
      
    const statusMatch = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    const typeMatch = eventTypeFilter === 'all' || inv.eventType.toLowerCase() === eventTypeFilter.toLowerCase();

    return searchMatch && statusMatch && typeMatch;
  });

  const handleDownload = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}/download?t=${Date.now()}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoices.find(i => i._id === id)?.invoiceNumber || 'TBC'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast('Invoice downloaded successfully', 'success');
    } catch {
      toast('Failed to download invoice', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleResend = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}/resend-invoice`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to resend');
      toast(data.message || 'Invoice resent successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to resend invoice', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black tracking-widest text-white uppercase text-left">
              Generated Invoices
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {filteredInvoices.length} document{filteredInvoices.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-xl px-4 py-3 min-w-[140px] focus:outline-none focus:border-zinc-500 transition-colors"
            >
              <option value="all">Any Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-xl px-4 py-3 min-w-[140px] focus:outline-none focus:border-zinc-500 transition-colors"
            >
              <option value="all">Any Event</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="sangeet">Sangeet</option>
              <option value="private_party">Private Party</option>
              <option value="haldi">Haldi</option>
              <option value="birthday">Birthday</option>
            </select>

            <div className="relative flex-grow sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-zinc-900">
          <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-3xl flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No invoices found</h3>
          <p className="text-xs text-zinc-500 font-medium">
            {searchTerm || statusFilter !== 'all' || eventTypeFilter !== 'all' 
              ? 'Try adjusting your filters or search terms.' 
              : 'Awaiting finalized bookings to generate invoices.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Invoice No.
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Client Details
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                  Controls
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 bg-zinc-900">
              {filteredInvoices.map((invoice) => (
                <tr 
                  key={invoice._id}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-800/50 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                        <FileText className="w-4 h-4 text-zinc-400" />
                      </div>
                      <span className="font-bold text-white tracking-tight">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-bold text-white">
                        {invoice.billingName || invoice.clientName}
                      </p>
                      <p className="text-[12px] font-medium text-zinc-500 mt-0.5">{invoice.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="inline-flex px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-black uppercase text-yellow-500 tracking-widest mb-1.5 align-middle">
                        {invoice.eventType}
                      </p>
                      <p className="text-[12px] font-medium text-zinc-400 truncate max-w-[150px]">
                        {invoice.venueName}, {invoice.city}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-zinc-300">
                        {formatDate(invoice.eventDate)}
                      </p>
                      <p className="text-[11px] font-medium text-zinc-500">
                        <strong className="text-zinc-600">ISSUED:</strong> {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="font-black text-white text-[15px] italic tracking-tight">
                      {formatCurrency(invoice.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`inline-flex px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${
                        invoice.paymentStatus === 'paid'
                          ? 'text-emerald-500 border border-emerald-500/20 bg-emerald-500/10'
                          : 'text-amber-500 border border-amber-500/20 bg-amber-500/10'
                      }`}>
                        {invoice.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      {invoice.paymentStatus === 'paid' && invoice.paymentMode && (
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          ({invoice.paymentMode})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {isAdmin && (
                        <button
                          onClick={() => setEditingBookingId(invoice._id)}
                          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800/50 border border-transparent hover:border-zinc-700 rounded-full transition-all"
                          title="Edit Invoice Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/admin/invoice/${invoice._id}`)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800/50 border border-transparent hover:border-zinc-700 rounded-full transition-all"
                        title="View Invoice UI"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice._id)}
                        disabled={loadingId === invoice._id}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-amber-500 bg-zinc-800/50 border border-transparent hover:border-amber-500/30 rounded-full transition-all disabled:opacity-50"
                        title="Download PDF"
                      >
                        {loadingId === invoice._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleResend(invoice._id)}
                        disabled={loadingId === invoice._id}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-blue-400 bg-zinc-800/50 border border-transparent hover:border-blue-400/30 rounded-full transition-all disabled:opacity-50"
                        title="Resend Invoice"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingBookingId && (
        <EditBookingModal
          bookingId={editingBookingId}
          onClose={() => setEditingBookingId(null)}
          onRefresh={() => router.refresh()}
        />
      )}
    </div>
  );
}

