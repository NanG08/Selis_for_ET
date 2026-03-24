import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Target, 
  FileText,
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Users, 
  Briefcase, 
  Building2, 
  Settings,
  ChevronRight,
  CheckCircle,
  CreditCard,
  TrendingUp,
  IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ user, onLogout, onUpdateUser }: { user: any, onLogout: () => void, onUpdateUser: (user: any) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const location = useLocation();

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, name: newName });
    setShowSettings(false);
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'family': return <Users size={18} />;
      case 'freelancer': return <Briefcase size={18} />;
      case 'small_business': return <Building2 size={18} />;
      case 'enterprise': return <Building2 size={18} />;
      default: return <User size={18} />;
    }
  };

  const getNavItems = (plan: string) => {
    const baseItems = [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
    ];

    switch (plan) {
      case 'personal':
        return [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'Budgets', path: '/budgets', icon: <Wallet size={20} /> },
          { name: 'Transactions', path: '/transactions', icon: <History size={20} /> },
          { name: 'Subscriptions', path: '/subscriptions', icon: <CreditCard size={20} /> },
          { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
          { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
        ];
      case 'family':
        return [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'Budgets', path: '/budgets', icon: <Wallet size={20} /> },
          { name: 'Transactions', path: '/transactions', icon: <History size={20} /> },
          { name: 'Allowance', path: '/allowance', icon: <IndianRupee size={20} /> },
          { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
          { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
        ];
      case 'freelancer':
        return [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
          { name: 'Income Tracker', path: '/income', icon: <TrendingUp size={20} /> },
          { name: 'Tax Estimator', path: '/tax', icon: <CreditCard size={20} /> },
          { name: 'Retirement', path: '/retirement', icon: <Target size={20} /> },
          { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
        ];
      case 'small_business':
        return [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
          { name: 'Expenses', path: '/transactions', icon: <History size={20} /> },
          { name: 'GST Tracker', path: '/gst', icon: <FileText size={20} /> },
          { name: 'Vendors', path: '/vendors', icon: <Users size={20} /> },
          { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
        ];
      case 'enterprise':
        return [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'Dept Budgets', path: '/budgets', icon: <Wallet size={20} /> },
          { name: 'Approvals', path: '/approvals', icon: <CheckCircle size={20} /> },
          { name: 'P&L Reports', path: '/reports', icon: <FileText size={20} /> },
          { name: 'Audit Trail', path: '/audit', icon: <History size={20} /> },
          { name: 'AI Assistant', path: '/ai', icon: <MessageSquare size={20} /> },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems(user.plan);

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-neutral-200 flex flex-col sticky top-0 h-screen z-50"
      >
        <div className="p-6 flex flex-col items-center gap-4 relative">
          <Link to="/" className="flex flex-col items-center gap-2 overflow-hidden">
            <div className={cn(
              "shrink-0 flex items-center justify-center transition-all duration-300",
              isSidebarOpen ? "w-20 h-20" : "w-10 h-10"
            )}>
              <img 
                src="/logo.png" 
                alt="Selis Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-2xl text-neutral-900 tracking-tight"
              >
                Selis
              </motion.span>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-all",
              isSidebarOpen ? "absolute top-4 right-4" : "mt-2"
            )}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all group",
                location.pathname === item.path 
                  ? "bg-emerald-50 text-emerald-600 font-medium" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <span className={cn(
                "shrink-0",
                location.pathname === item.path ? "text-emerald-600" : "text-neutral-400 group-hover:text-neutral-600"
              )}>
                {item.icon}
              </span>
              {isSidebarOpen && <span>{item.name}</span>}
              {isSidebarOpen && location.pathname === item.path && (
                <motion.div layoutId="active" className="ml-auto">
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-neutral-50 mb-4",
            !isSidebarOpen && "justify-center"
          )}>
            <div className="bg-neutral-200 p-2 rounded-full shrink-0">
              {getPlanIcon(user.plan)}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.plan} Plan</p>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-bottom border-neutral-200 sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800 capitalize">
            {location.pathname === '/' ? 'Overview Dashboard' : location.pathname.slice(1)}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Plan</label>
                  <div className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 capitalize">
                    {user.plan} Plan
                  </div>
                  <p className="mt-1 text-xs text-neutral-400 italic">Contact support to change your plan.</p>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Save Changes
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
