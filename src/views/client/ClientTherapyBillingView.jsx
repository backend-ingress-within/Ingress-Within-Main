import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  FileText,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  X,
  Calendar,
  User,
  Info,
} from 'lucide-react';

export default function ClientTherapyBillingView({
  billingData,
  loading = false,
  error = null,
  onRefresh,
}) {
  const [filter, setFilter] = useState('all'); // all | paid | refunded | pending
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const transactions = billingData?.transactions || billingData?.sessionBookings || [];
  const invoices = billingData?.invoices || [];
  const summary = billingData?.summary || { totalPaid: 0, outstanding: 0, totalRefunded: 0, currency: 'INR' };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'paid') return t.paymentStatus === 'paid' || t.paymentStatus === 'captured';
    if (filter === 'refunded') return t.refundStatus === 'full' || t.refundStatus === 'partial';
    if (filter === 'pending') return t.paymentStatus === 'pending';
    return true;
  });

  const handlePrintReceipt = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            <ShieldCheck size={12} className="text-emerald-700" /> Authorized Client Billing Ledger
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] font-medium">
            Billing &amp; Payment History
          </h1>
          <p className="text-xs text-[#66747A] mt-1">
            Authoritative records of verified Razorpay session payments, official invoices, and automated refunds.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#132A24] bg-white border border-[#263238]/15 rounded-xl hover:bg-[#F4F1EC] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* 2. Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-red-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-900">Failed to load billing history</h4>
              <p className="text-xs text-red-800">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-semibold px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Paid */}
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#66747A] uppercase tracking-wider">
              Total Settled Payments
            </div>
            <div className="font-serif text-2xl font-bold text-[#132A24] mt-0.5">
              ₹{summary.totalPaid?.toLocaleString('en-IN') || 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified via Razorpay
            </div>
          </div>
        </div>

        {/* Total Refunded */}
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0">
            <RotateCcw size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#66747A] uppercase tracking-wider">
              Refunded to Source
            </div>
            <div className="font-serif text-2xl font-bold text-[#132A24] mt-0.5">
              ₹{summary.totalRefunded?.toLocaleString('en-IN') || 0}
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5 flex items-center gap-1">
              <Clock size={12} /> Standard 5–7 bank days
            </div>
          </div>
        </div>

        {/* Outstanding / Pending */}
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#66747A] uppercase tracking-wider">
              Pending Session Holds
            </div>
            <div className="font-serif text-2xl font-bold text-[#132A24] mt-0.5">
              ₹{summary.outstanding?.toLocaleString('en-IN') || 0}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              Awaiting checkout completion
            </div>
          </div>
        </div>
      </div>

      {/* 4. Transactions List with Filters */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Session Transactions &amp; Receipts
            </h3>
            <p className="text-xs text-[#66747A] mt-0.5">
              Itemized history of therapy sessions with clinical providers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4F1EC] rounded-xl self-start sm:self-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'paid', label: 'Paid' },
              { id: 'refunded', label: 'Refunded' },
              { id: 'pending', label: 'Pending' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#132A24] text-white shadow-2xs'
                    : 'text-[#66747A] hover:text-[#132A24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Content */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#66747A] flex flex-col items-center justify-center gap-2">
            <RefreshCw size={20} className="animate-spin text-emerald-800" />
            <span>Retrieving authoritative transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F4F1EC] text-[#66747A] flex items-center justify-center mx-auto">
              <CreditCard size={20} />
            </div>
            <h4 className="text-sm font-semibold text-[#132A24]">No transactions recorded</h4>
            <p className="text-xs text-[#66747A] max-w-sm mx-auto">
              {filter === 'all'
                ? 'When you schedule and complete consultation payments, receipts will appear here automatically.'
                : `No transactions matching the "${filter}" filter were found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263238]/10 text-[10px] uppercase font-bold text-[#66747A]">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Session Date</th>
                  <th className="pb-3">Clinician</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Refund Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263238]/6">
                {filteredTransactions.map((tx) => {
                  const isPaid = tx.paymentStatus === 'paid' || tx.paymentStatus === 'captured';
                  const isRefunded = tx.refundStatus === 'full' || tx.refundStatus === 'partial';

                  return (
                    <tr key={tx.id} className="hover:bg-[#F4F1EC]/40 transition-colors">
                      <td className="py-3.5">
                        <div className="font-mono font-semibold text-[#132A24]">
                          #{tx.bookingReference}
                        </div>
                        <div className="text-[10px] text-[#66747A]">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                        </div>
                      </td>

                      <td className="py-3.5 text-[#263238]">
                        <div className="font-medium">
                          {new Date(tx.slotStart).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#66747A]">
                          {new Date(tx.slotStart).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-semibold text-[#132A24]">{tx.therapistName}</div>
                        <div className="text-[10px] text-[#66747A]">{tx.therapistTitle}</div>
                      </td>

                      <td className="py-3.5">
                        <span className="font-bold text-sm text-[#132A24]">₹{tx.amountRupees}</span>
                        <div className="text-[10px] text-[#66747A]">{tx.currency}</div>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : tx.paymentStatus === 'pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {isPaid && <CheckCircle2 size={10} />}
                          {tx.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5">
                        {isRefunded ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                              <RotateCcw size={10} /> {tx.refundStatus} refund
                            </span>
                            <div className="text-[10px] text-blue-700 font-medium">
                              ₹{tx.refundAmountRupees} credited
                            </div>
                          </div>
                        ) : tx.refundEligible ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                              Eligible (&gt;48h)
                            </span>
                            <div className="text-[10px] text-[#66747A]">100% refundable</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#66747A] uppercase font-bold">
                            {tx.bookingStatus === 'cancelled' ? 'Cancelled (No Refund)' : 'Standard Policy'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right">
                        {isPaid && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(tx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#263238]/15 bg-white hover:bg-[#F4F1EC] text-xs font-semibold text-[#132A24] transition-all cursor-pointer shadow-2xs"
                          >
                            <FileText size={12} className="text-emerald-800" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Platform Invoices Section (if available) */}
      {invoices.length > 0 && (
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-[#263238]/10 pb-3">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Official Tax Invoices
            </h3>
            <p className="text-xs text-[#66747A] mt-0.5">
              GST-compliant platform invoices generated for consultations and wellness plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263238]/10 text-[10px] uppercase font-bold text-[#66747A]">
                  <th className="pb-2.5">Invoice #</th>
                  <th className="pb-2.5">Issued Date</th>
                  <th className="pb-2.5">Subtotal</th>
                  <th className="pb-2.5">GST (18%)</th>
                  <th className="pb-2.5">Total Amount</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263238]/6">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F4F1EC]/40">
                    <td className="py-3 font-mono font-medium text-[#132A24]">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 text-[#66747A]">
                      {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 text-[#263238]">₹{inv.amount_subtotal}</td>
                    <td className="py-3 text-[#263238]">₹{inv.amount_gst}</td>
                    <td className="py-3 font-bold text-[#132A24]">₹{inv.amount_total}</td>
                    <td className="py-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Refund Policy & Guidelines Card */}
      <div className="bg-[#F4F1EC] border border-[#263238]/10 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#132A24]">
          <ShieldCheck size={18} className="text-emerald-800" />
          <span>Ingress Within Official Cancellation &amp; Refund Policy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#66747A] leading-relaxed pt-1">
          <div className="space-y-1.5 bg-white/70 p-4 rounded-xl border border-[#263238]/8">
            <span className="font-bold text-[#132A24] block">48-Hour Cancellation Window</span>
            <p>
              Cancellations initiated at least 48 hours prior to the scheduled consultation start time
              qualify for a 100% automated refund credited directly back to the original payment source.
            </p>
          </div>

          <div className="space-y-1.5 bg-white/70 p-4 rounded-xl border border-[#263238]/8">
            <span className="font-bold text-[#132A24] block">Late Cancellations &amp; No-Shows</span>
            <p>
              Cancellations made within 48 hours of consultation are non-refundable to respect the
              clinician's reserved calendar. If a clinician is unable to attend, a 100% refund is
              immediately credited.
            </p>
          </div>
        </div>
      </div>

      {/* 7. RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-gray-200 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#263238]/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800">
                  Ingress Within Healthcare
                </span>
                <h3 className="font-serif text-xl font-medium text-[#132A24]">
                  Official Consultation Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-[#F4F1EC] p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#66747A]">Booking Reference</span>
                <span className="font-mono font-bold text-[#132A24]">
                  #{selectedReceipt.bookingReference}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#66747A]">Razorpay Payment Reference</span>
                <span className="font-mono text-[11px] text-[#263238]">
                  {selectedReceipt.razorpayPaymentId || 'Verified Online Payment'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#66747A]">Consultation Date &amp; Time</span>
                <span className="font-medium text-[#132A24]">
                  {new Date(selectedReceipt.slotStart).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  at{' '}
                  {new Date(selectedReceipt.slotStart).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#66747A]">Licensed Clinician</span>
                <span className="font-semibold text-[#132A24]">
                  {selectedReceipt.therapistName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#66747A]">Payment Method</span>
                <span className="font-medium text-[#263238]">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="border border-[#263238]/10 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[#66747A]">
                <span>Clinical Consultation (50 min)</span>
                <span>₹{Math.round(selectedReceipt.amountRupees / 1.18)}</span>
              </div>
              <div className="flex justify-between items-center text-[#66747A]">
                <span>Integrated GST (18%)</span>
                <span>₹{selectedReceipt.amountRupees - Math.round(selectedReceipt.amountRupees / 1.18)}</span>
              </div>
              <div className="border-t border-[#263238]/10 pt-2 flex justify-between items-center text-sm font-bold text-[#132A24]">
                <span>Total Paid</span>
                <span className="font-serif text-base">₹{selectedReceipt.amountRupees}</span>
              </div>
            </div>

            {/* Refund info if applicable */}
            {(selectedReceipt.refundStatus === 'full' || selectedReceipt.refundStatus === 'partial') && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center gap-2">
                <RotateCcw size={14} className="text-blue-700 shrink-0" />
                <span>
                  Refund of ₹{selectedReceipt.refundAmountRupees} credited back to original source.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-[#132A24] text-white hover:bg-[#1C3E35] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Printer size={13} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
