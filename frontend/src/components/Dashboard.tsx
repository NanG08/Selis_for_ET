import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Calendar,
  Filter,
  Users,
  Target,
  History,
  FileText,
  MapPin,
  Loader2,
  Zap,
  Shield
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/currency';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const LocationWidget = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            setAddress(data.display_name);
          } catch (e) {
            console.error("Geocoding failed", e);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <MapPin size={20} />
        </div>
        <h3 className="font-semibold text-neutral-900">Current Location</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-500 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Detecting location...
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-neutral-600 line-clamp-2">{address || "Location detected"}</p>
          <div className="flex gap-4 text-xs font-mono text-neutral-400">
            <span>Lat: {location?.lat.toFixed(4)}</span>
            <span>Lng: {location?.lng.toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard({ user }: { user: any }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txs, bgs] = await Promise.all([
          api.transactions.getAll(),
          api.budgets.getAll()
        ]);
        setTransactions(txs);
        setBudgets(bgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate real category data
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: value as number
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const chartData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
  ];

  const renderPlanSpecificWidgets = () => {
    switch (user.plan) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={20} />
                Spending Discipline Score
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-emerald-600 tracking-tighter">84</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">+5 pts</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Your score improved by 5 points this week! You're doing great on discretionary spending.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <IndianRupee className="text-blue-500" size={20} />
                Emergency Fund Tracker
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Progress</span>
                    <span className="text-lg font-bold text-neutral-900">{formatCurrency(12500)}</span>
                  </div>
                  <span className="text-xs font-medium text-neutral-400">Target: {formatCurrency(25000)}</span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-500 rounded-full shadow-sm shadow-blue-500/20" 
                  />
                </div>
                <p className="text-xs text-neutral-500 font-medium">50% of your 6-month goal reached.</p>
              </div>
            </div>
            <LocationWidget />
          </div>
        );
      case 'family':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="text-purple-500" size={20} />
                Kid Allowance Tracker
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Aarav</span>
                  <span className="text-sm font-bold text-red-500">{formatCurrency(200)} / {formatCurrency(500)} left</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Priya</span>
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(450)} / {formatCurrency(500)} left</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-orange-500" size={20} />
                Joint Expense Splitter
              </h4>
              <div className="text-sm text-neutral-600">
                You owe <span className="font-bold text-red-500">{formatCurrency(1250)}</span> for shared household expenses this month.
              </div>
            </div>
            <LocationWidget />
          </div>
        );
      case 'freelancer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <TrendingDown className="text-red-500" size={20} />
                Cash Flow Gap Detector
              </h4>
              <div className="text-sm text-neutral-600">
                <p className="mb-2">Warning: Your projected expenses for next month exceed your confirmed income by <span className="font-bold text-red-500">{formatCurrency(8500)}</span>.</p>
                <p className="text-xs text-neutral-400">Average last 6 months income: {formatCurrency(45000)}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Target className="text-emerald-500" size={20} />
                Self-Employed Retirement Planner
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">Suggested NPS contribution this month: <span className="font-bold text-emerald-600">{formatCurrency(5000)}</span></p>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
            <LocationWidget />
          </div>
        );
      case 'small_business':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <History className="text-blue-500" size={20} />
                Cash Flow Runway
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">4.2</div>
                <div className="text-sm text-neutral-500">
                  Months of runway at current burn rate. Consider reducing fixed costs to extend to 6 months.
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FileText className="text-emerald-500" size={20} />
                GST Input Credit Tracker
              </h4>
              <div className="text-sm text-neutral-600">
                You have <span className="font-bold text-emerald-600">{formatCurrency(34000)}</span> in unclaimed GST input credit from recent vendor payments.
              </div>
            </div>
            <LocationWidget />
          </div>
        );
      case 'enterprise':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Filter className="text-orange-500" size={20} />
                Spend Policy Enforcement
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Policy Violations</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">3 Flagged</span>
                </div>
                <p className="text-xs text-neutral-400 italic">Travel expenses for Dept: Marketing exceed policy limits by 15%.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="text-blue-500" size={20} />
                Headcount Cost Tracker
              </h4>
              <div className="text-sm text-neutral-600">
                Salary costs are currently <span className="font-bold text-blue-600">62%</span> of total departmental budgets.
              </div>
            </div>
            <LocationWidget />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={user.plan === 'enterprise' ? "Total Dept Balance" : "Total Current Balance"}
          value={balance} 
          icon={<IndianRupee size={20} />} 
          trend="+12.5%" 
          isPositive={true}
        />
        <StatCard 
          title={user.plan === 'freelancer' ? "Projected Income" : "Monthly Total Income"}
          value={totalIncome} 
          icon={<TrendingUp size={20} />} 
          trend="+8.2%" 
          isPositive={true}
        />
        <StatCard 
          title={user.plan === 'small_business' ? "Operating Expenses" : "Monthly Total Expenses"}
          value={totalExpenses} 
          icon={<TrendingDown size={20} />} 
          trend="-2.4%" 
          isPositive={false}
        />
      </div>

      {renderPlanSpecificWidgets()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-neutral-800">Cashflow Overview</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400"><Calendar size={18} /></button>
              <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400"><Filter size={18} /></button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="font-semibold text-neutral-800 mb-8">Expenses by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.length > 0 ? categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : <Cell fill="#f3f4f6" />}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-neutral-600">{item.name}</span>
                </div>
                <span className="font-medium text-neutral-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
            {categoryData.length === 0 && (
              <div className="text-center py-4 text-neutral-400 text-xs italic">No expense data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-neutral-800">Recent Transactions</h3>
          <button className="text-emerald-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{tx.description}</p>
                  <p className="text-xs text-neutral-500">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <p className={cn(
                "font-semibold",
                tx.type === 'income' ? "text-emerald-600" : "text-neutral-900"
              )}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-neutral-400">No transactions yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isPositive }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-500">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-neutral-900">{formatCurrency(value)}</p>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
