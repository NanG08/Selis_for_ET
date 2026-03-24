import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/currency';

export default function BudgetBuilder({ user }: { user: any }) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bgs, txs] = await Promise.all([
          api.budgets.getAll(),
          api.transactions.getAll()
        ]);
        setBudgets(bgs);
        setTransactions(txs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newLimit) return;

    try {
      const budget = await api.budgets.create({
        category: newCategory,
        limitAmount: parseFloat(newLimit),
        planContext: user.plan
      });
      setBudgets([...budgets, budget]);
      setNewCategory('');
      setNewLimit('');
    } catch (err) {
      console.error(err);
    }
  };

  const getSpentForCategory = (category: string) => {
    return transactions
      .filter(t => t.category.toLowerCase() === category.toLowerCase() && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

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

  const suggestions = getSuggestedCategories(user.plan);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Create New Budget</h3>
        <form onSubmit={handleAddBudget} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              list="category-suggestions"
              placeholder="e.g. Groceries"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
            <datalist id="category-suggestions">
              {suggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Monthly Limit</label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Budget
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const spent = getSpentForCategory(budget.category);
          const percent = Math.min((spent / budget.limitAmount) * 100, 100);
          const isOver = spent > budget.limitAmount;

          return (
            <motion.div 
              key={budget.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                    <Wallet size={20} />
                  </div>
                  <h4 className="font-semibold text-neutral-800">{budget.category}</h4>
                </div>
                <button className="text-neutral-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Spent: {formatCurrency(spent)}</span>
                  <span className="text-neutral-900 font-medium">Limit: {formatCurrency(budget.limitAmount)}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className={`text-xs flex items-center gap-1 ${isOver ? 'text-red-500' : 'text-neutral-400'}`}>
                  <AlertCircle size={12} />
                  {isOver 
                    ? `You've exceeded your limit by ${formatCurrency(spent - budget.limitAmount)}`
                    : `You have ${formatCurrency(budget.limitAmount - spent)} remaining`
                  }
                </p>
              </div>
            </motion.div>
          );
        })}
        {budgets.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-neutral-500">
            No budgets created yet. Start by adding one above!
          </div>
        )}
      </div>
    </div>
  );
}
