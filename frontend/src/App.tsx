import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BudgetBuilder from './components/BudgetBuilder';
import AIChat from './components/AIChat';
import TransactionList from './components/TransactionList';
import GoalTracker from './components/GoalTracker';
import InvoiceManager from './components/InvoiceManager';
import PlanFeature from './components/PlanFeature';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('selis_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: any, token: string) => {
    localStorage.setItem('selis_user', JSON.stringify(userData));
    localStorage.setItem('selis_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('selis_user');
    localStorage.removeItem('selis_token');
    setUser(null);
  };

  const updateUser = (userData: any) => {
    localStorage.setItem('selis_user', JSON.stringify(userData));
    setUser(userData);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Auth onLogin={login} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Layout user={user} onLogout={logout} onUpdateUser={updateUser} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="budgets" element={<BudgetBuilder user={user} />} />
          <Route path="transactions" element={<TransactionList user={user} />} />
          <Route path="goals" element={<GoalTracker user={user} />} />
          <Route path="invoices" element={<InvoiceManager user={user} />} />
          <Route path="ai" element={<AIChat user={user} />} />
          
          {/* Plan Specific Routes */}
          <Route path="subscriptions" element={<PlanFeature user={user} feature="subscriptions" />} />
          <Route path="allowance" element={<PlanFeature user={user} feature="allowance" />} />
          <Route path="income" element={<PlanFeature user={user} feature="income" />} />
          <Route path="tax" element={<PlanFeature user={user} feature="tax" />} />
          <Route path="retirement" element={<PlanFeature user={user} feature="retirement" />} />
          <Route path="gst" element={<PlanFeature user={user} feature="gst" />} />
          <Route path="vendors" element={<PlanFeature user={user} feature="vendors" />} />
          <Route path="approvals" element={<PlanFeature user={user} feature="approvals" />} />
          <Route path="reports" element={<PlanFeature user={user} feature="reports" />} />
          <Route path="audit" element={<PlanFeature user={user} feature="audit" />} />
        </Route>
      </Routes>
    </Router>
  );
}
