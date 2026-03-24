import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  IndianRupee, 
  TrendingUp, 
  Target, 
  FileText, 
  Users, 
  CheckCircle, 
  History,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import { api } from '../lib/api';

interface PlanFeatureProps {
  user: any;
  feature: string;
}

export default function PlanFeature({ user, feature }: PlanFeatureProps) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    nextBillingDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (feature === 'subscriptions') {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [feature]);

  const fetchSubscriptions = async () => {
    try {
      const data = await api.subscriptions.getAll();
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sub = await api.subscriptions.create({
        ...newSub,
        amount: parseFloat(newSub.amount),
        planContext: user.plan
      });
      setSubscriptions([...subscriptions, sub]);
      setShowAddModal(false);
      setNewSub({
        name: '',
        amount: '',
        frequency: 'monthly',
        nextBillingDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await api.subscriptions.delete(id);
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (feature) {
      case 'subscriptions':
        const totalMonthly = subscriptions.reduce((acc, sub) => {
          const amount = sub.amount;
          return acc + (sub.frequency === 'annual' ? amount / 12 : amount);
        }, 0);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <p className="text-sm text-neutral-500 mb-1">Monthly Total</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalMonthly)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <p className="text-sm text-neutral-500 mb-1">Active Subscriptions</p>
                <p className="text-2xl font-bold text-neutral-900">{subscriptions.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <p className="text-sm text-neutral-500 mb-1">Potential Savings</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalMonthly * 0.15)}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <Plus size={18} />
                Add Subscription
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-900">Service</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-900">Next Billing</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-900">Amount</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-900">Frequency</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-900 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-neutral-900">{sub.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-500">{sub.nextBillingDate}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{formatCurrency(sub.amount)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium capitalize">{sub.frequency}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                        No subscriptions tracked yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Subscription Modal */}
            <AnimatePresence>
              {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-neutral-900">Add Subscription</h3>
                      <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleAddSubscription} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={newSub.name}
                          onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                          placeholder="e.g. Netflix"
                          className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Amount</label>
                          <input
                            type="number"
                            value={newSub.amount}
                            onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Frequency</label>
                          <select
                            value={newSub.frequency}
                            onChange={(e) => setNewSub({ ...newSub, frequency: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Next Billing Date</label>
                        <input
                          type="date"
                          value={newSub.nextBillingDate}
                          onChange={(e) => setNewSub({ ...newSub, nextBillingDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
                        >
                          Save Subscription
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'allowance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Aarav', balance: 1200, limit: 2000, spent: 800 },
                { name: 'Priya', balance: 450, limit: 500, spent: 50 },
              ].map((kid) => (
                <div key={kid.name} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-neutral-900">{kid.name}'s Allowance</h4>
                    <button className="text-emerald-600 text-sm font-medium hover:underline">Manage</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Spent this month</span>
                      <span className="text-neutral-900 font-medium">{formatCurrency(kid.spent)} / {formatCurrency(kid.limit)}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(kid.spent / kid.limit) * 100}%` }} 
                      />
                    </div>
                    <div className="pt-2 border-t border-neutral-50 flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Current Balance</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(kid.balance)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'income':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-6">Income Smoothing Analysis</h4>
              <div className="h-64 flex items-end gap-2 px-4">
                {[45000, 32000, 58000, 29000, 62000, 41000].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-emerald-500/20 rounded-t-lg relative group"
                      style={{ height: `${(val / 70000) * 100}%` }}
                    >
                      <div 
                        className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"
                        style={{ height: '100%' }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">Month {i+1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800">
                  <Zap size={16} className="inline mr-2" />
                  Sally's Advice: Your income is highly variable. We suggest setting aside <span className="font-bold">{formatCurrency(15000)}</span> from this month's peak to cover projected dips in the next quarter.
                </p>
              </div>
            </div>
          </div>
        );
      case 'tax':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h4 className="font-bold text-neutral-900 mb-4">Estimated Tax Liability (FY 25-26)</h4>
                <p className="text-3xl font-bold text-red-500 mb-2">{formatCurrency(84500)}</p>
                <p className="text-sm text-neutral-500">Based on your current income and projected expenses.</p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tax Payable</span>
                    <span className="font-medium">{formatCurrency(112000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">TDS Deducted</span>
                    <span className="font-medium text-emerald-600">-{formatCurrency(27500)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h4 className="font-bold text-neutral-900 mb-4">Tax Saving Suggestions</h4>
                <ul className="space-y-4">
                  {[
                    { title: '80C Investments', desc: 'You have 45k remaining limit.', amount: 45000 },
                    { title: 'Health Insurance', desc: 'Claim up to 25k for self/family.', amount: 25000 },
                    { title: 'NPS Contribution', desc: 'Additional 50k deduction available.', amount: 50000 },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'gst':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-neutral-900">GST Summary (Current Quarter)</h4>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
                  Export GSTR-1
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Output GST</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(145000)}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Input GST Credit</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(82000)}</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider mb-1">Net GST Payable</p>
                  <p className="text-xl font-bold text-emerald-700">{formatCurrency(63000)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                <h4 className="font-bold text-neutral-900">System Audit Trail</h4>
              </div>
              <div className="divide-y divide-neutral-100">
                {[
                  { user: 'Admin', action: 'Budget Reallocation', target: 'Marketing Dept', time: '2 hours ago', status: 'Approved' },
                  { user: 'S. Mehta', action: 'New Invoice Created', target: 'Vendor: AWS', time: '5 hours ago', status: 'Pending' },
                  { user: 'System', action: 'Policy Update', target: 'Travel Limits', time: '1 day ago', status: 'Success' },
                ].map((log, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                        <History size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{log.action}</p>
                        <p className="text-xs text-neutral-500">By {log.user} • {log.target}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 mb-1">{log.time}</p>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.charAt(0).toUpperCase() + feature.slice(1)}</h3>
            <p className="text-neutral-500 max-w-md">
              This feature is currently being tailored for your {user.plan} plan. 
              Check back soon for deep financial insights and specialized tools.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 capitalize">{feature}</h2>
          <p className="text-neutral-500 text-sm">Manage your {user.plan} specific financial operations.</p>
        </div>
      </div>
      {renderContent()}
    </motion.div>
  );
}
