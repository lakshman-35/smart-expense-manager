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

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [monthlySpending, setMonthlySpending] = useState({ amount: 0, change: 0 });

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
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-sm transform lg:transform-none lg:opacity-100 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ExpenseAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <div className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Main</div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const base = 'flex items-center px-3 py-2 rounded-lg transition-colors';
              const active = 'bg-blue-50 text-blue-700 border border-blue-100';
              const inactive = 'text-gray-700 hover:bg-gray-100';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${base} ${isActive ? active : inactive}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <div className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">More</div>
            <div className="space-y-1">
              {secondaryItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const base = 'flex items-center px-3 py-2 rounded-lg transition-colors';
                const active = 'bg-blue-50 text-blue-700 border border-blue-100';
                const inactive = 'text-gray-700 hover:bg-gray-100';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${base} ${isActive ? active : inactive}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">This Month</div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(monthlySpending.amount)}
              </span>
              {formatChangePercent(monthlySpending.change)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;