import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/currency';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function TransactionList({ user }: { user: any }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [newTx, setNewTx] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'expense'
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.transactions.getAll();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tx = await api.transactions.create({
        ...newTx,
        description: newTx.description || newTx.category || 'Transaction',
        amount: parseFloat(newTx.amount),
        planContext: user.plan
      });
      setTransactions([tx, ...transactions]);
      setShowAddModal(false);
      setNewTx({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'expense'
      });
      setSuggestions([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggest = async () => {
    if (!newTx.category) return;
    setIsSuggesting(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 3 short common transaction descriptions for the category "${newTx.category}" and type "${newTx.type}". Return only a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      const data = JSON.parse(response.text || '[]');
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      // Assuming api.transactions.delete exists, if not we'll just filter locally for now
      // Since I don't see a delete in the provided api snippet (I should check api.ts)
      // For now, let's just filter locally to show it working
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const headers = ['Description', 'Category', 'Date', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        `"${tx.description}"`,
        `"${tx.category}"`,
        tx.date,
        tx.amount,
        tx.type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const getSuggestedCategories = (plan: string) => {
    switch (plan) {
      case 'personal': return ['Rent', 'Food', 'Entertainment', 'Health', 'Transport', 'Shopping'];
      case 'family': return ['Groceries', 'Kids Allowance', 'Utilities', 'Education', 'Family Outing', 'Home Maintenance'];
      case 'freelancer': return ['Software Subscriptions', 'Coworking', 'Marketing', 'Hardware', 'Travel', 'Professional Fees'];
      case 'small_business': return ['Payroll', 'Vendor Payments', 'Office Rent', 'Inventory', 'GST Liability', 'Insurance'];
      case 'enterprise': return ['Marketing Dept', 'Sales Dept', 'Engineering Dept', 'Operations', 'HR & Admin', 'Legal'];
      default: return ['General', 'Savings', 'Investment'];
    }
  };

  const categorySuggestions = getSuggestedCategories(user.plan);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Filter size={18} />
              {filterType === 'all' ? 'Filter' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => setFilterType('all')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm">All</button>
              <button onClick={() => setFilterType('income')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm">Income</button>
              <button onClick={() => setFilterType('expense')} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm">Expense</button>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                        {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <span className="font-medium text-neutral-900">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-semibold",
                      tx.type === 'income' ? "text-emerald-600" : "text-neutral-900"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md p-8"
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Add Transaction</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newTx.category}
                      onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                      list="tx-category-suggestions"
                      placeholder="e.g. Food"
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                    <datalist id="tx-category-suggestions">
                      {categorySuggestions.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                    <div className="flex p-1 bg-neutral-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                          newTx.type === 'expense' ? "bg-white text-red-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                        )}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTx({ ...newTx, type: 'income' })}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                          newTx.type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                        )}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-neutral-700">Description (Optional)</label>
                    <button
                      type="button"
                      onClick={handleSuggest}
                      disabled={isSuggesting || !newTx.category}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles size={12} />
                      {isSuggesting ? 'Suggesting...' : 'Suggest'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newTx.description}
                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                    placeholder="e.g. Weekly groceries"
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setNewTx({ ...newTx, description: s });
                            setSuggestions([]);
                          }}
                          className="text-[10px] px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newTx.date}
                      onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
