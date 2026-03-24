import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Download
} from 'lucide-react';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/currency';

export default function InvoiceManager({ user }: { user: any }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking invoices for now as I haven't added the API endpoint yet
    setInvoices([
      { id: 1, client: 'Acme Corp', amount: 1200, status: 'paid', date: '2024-03-15' },
      { id: 2, client: 'Global Tech', amount: 3500, status: 'pending', date: '2024-03-20' },
      { id: 3, client: 'Startup X', amount: 800, status: 'overdue', date: '2024-03-10' },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  const totalOutstanding = invoices.filter(inv => inv.status !== 'paid').reduce((acc, inv) => acc + inv.amount, 0);
  const paidThisMonth = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0);
  const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-neutral-900">Invoice Manager</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm">
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Paid this Month</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(paidThisMonth)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(overdue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-100">
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-neutral-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-100 p-2 rounded-lg text-neutral-500">
                      <FileText size={18} />
                    </div>
                    <span className="font-medium text-neutral-900">{inv.client}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-neutral-900">{formatCurrency(inv.amount)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit",
                    inv.status === 'paid' ? "bg-emerald-50 text-emerald-600" : 
                    inv.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                  )}>
                    {inv.status === 'paid' ? <CheckCircle2 size={12} /> : 
                     inv.status === 'pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">{inv.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-neutral-400 hover:text-emerald-500 rounded-lg transition-colors">
                      <Send size={18} />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
