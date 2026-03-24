import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { formatCurrency, getCurrencyInfo } from '../lib/currency';

export default function GoalTracker({ user }: { user: any }) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: ''
  });

  const { symbol } = getCurrencyInfo();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await api.goals.getAll();
        setGoals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const goal = await api.goals.create({
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount),
        planContext: user.plan
      });
      setGoals([...goals, goal]);
      setNewGoal({ name: '', targetAmount: '', currentAmount: '0', deadline: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Set a New Financial Goal</h3>
        <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Goal Name</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="e.g. New Car"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Target ({symbol})</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Deadline</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
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
              Start Saving
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const isCompleted = progress >= 100;

          return (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <Target size={24} />
                </div>
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <Clock size={14} />
                    In Progress
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-neutral-900 mb-1">{goal.name}</h4>
              <p className="text-sm text-neutral-500 mb-6 flex items-center gap-1">
                <Calendar size={14} />
                Target: {goal.deadline}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 font-medium">{formatCurrency(goal.currentAmount)} saved</span>
                  <span className="text-neutral-400">of {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      isCompleted ? "bg-emerald-500" : "bg-emerald-400"
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400">{Math.round(progress)}%</span>
                  <button className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                    <Plus size={12} />
                    Add Funds
                  </button>
                </div>
              </div>

              {isCompleted && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-emerald-500 w-24 h-10" />
                </div>
              )}
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="lg:col-span-3 text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-neutral-500">
            No financial goals set yet. What are you saving for?
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
