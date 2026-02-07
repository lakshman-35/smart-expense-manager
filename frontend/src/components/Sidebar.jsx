import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  Target,
  FileText,
  Wallet,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactions';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [monthlySpending, setMonthlySpending] = useState({ amount: 0, change: 0 });

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  // Fetch monthly spending data
  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const response = await transactionService.getTransactions({
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0],
          type: 'expense'
        });

        if (response.success) {
          const totalExpenses = response.transactions.reduce((sum, transaction) =>
            sum + transaction.amount, 0
          );

          // Calculate previous month for comparison
          const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
          const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

          const prevResponse = await transactionService.getTransactions({
            startDate: prevMonthStart.toISOString().split('T')[0],
            endDate: prevMonthEnd.toISOString().split('T')[0],
            type: 'expense'
          });

          const prevMonthExpenses = prevResponse.success ?
            prevResponse.transactions.reduce((sum, transaction) => sum + transaction.amount, 0) : 0;

          const changePercent = prevMonthExpenses > 0 ?
            ((totalExpenses - prevMonthExpenses) / prevMonthExpenses * 100) : 0;

          setMonthlySpending({ amount: totalExpenses, change: changePercent });
        }
      } catch (error) {
        console.error('Error fetching monthly spending:', error);
        setMonthlySpending({ amount: 0, change: 0 });
      }
    };

    fetchMonthlySpending();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  const formatChangePercent = (change) => {
    const isPositive = change >= 0;
    const arrow = isPositive ? '↑' : '↓';
    const color = isPositive ? 'text-red-600' : 'text-green-600';
    return (
      <span className={`text-sm ${color}`}>
        {arrow} {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/budget', icon: PieChart, label: 'Budget' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  const secondaryItems = [
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
            <Link to="/dashboard" className="flex items-center space-x-3" onClick={() => window.innerWidth < 1024 && onClose()}>
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">ExpenseAI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <div className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400">Main Menu</div>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const base = 'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden';
                const active = 'bg-blue-50 text-blue-700 shadow-sm';
                const inactive = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${base} ${isActive ? active : inactive}`}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                    )}
                    <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-medium truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Navigation */}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="px-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">More Options</div>
              <div className="space-y-1">
                {secondaryItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  const base = 'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative';
                  const active = 'bg-blue-50 text-blue-700 shadow-sm';
                  const inactive = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${base} ${isActive ? active : inactive}`}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                    >
                      <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="font-medium truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User Stats */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Month</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(monthlySpending.amount)}
                </span>
                {formatChangePercent(monthlySpending.change)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;