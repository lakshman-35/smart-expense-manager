import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Plus,
  Search,
  Filter,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Investments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [showBalances, setShowBalances] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  // Mock investment data - In a real app, this would come from an API
  useEffect(() => {
    const mockInvestments = [
      {
        id: 1,
        name: 'Mutual Fund - Large Cap',
        type: 'mutual_fund',
        invested: 50000,
        currentValue: 54500,
        returns: 4500,
        returnPercentage: 9.0,
        risk: 'Medium',
        status: 'active'
      },
      {
        id: 2,
        name: 'SIP - HDFC Top 100',
        type: 'sip',
        invested: 25000,
        currentValue: 27250,
        returns: 2250,
        returnPercentage: 9.0,
        risk: 'Medium',
        status: 'active'
      },
      {
        id: 3,
        name: 'Fixed Deposit',
        type: 'fd',
        invested: 100000,
        currentValue: 106000,
        returns: 6000,
        returnPercentage: 6.0,
        risk: 'Low',
        status: 'active'
      },
      {
        id: 4,
        name: 'Gold ETF',
        type: 'etf',
        invested: 30000,
        currentValue: 32100,
        returns: 2100,
        returnPercentage: 7.0,
        risk: 'Medium',
        status: 'active'
      }
    ];
    setInvestments(mockInvestments);
  }, []);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnPercentage = totalInvested > 0 ? (totalReturns / totalInvested * 100) : 0;

  const investmentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'mutual_fund', label: 'Mutual Funds' },
    { value: 'sip', label: 'SIP' },
    { value: 'fd', label: 'Fixed Deposit' },
    { value: 'etf', label: 'ETF' },
    { value: 'stocks', label: 'Stocks' }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'mutual_fund': return '📊';
      case 'sip': return '🔄';
      case 'fd': return '🏦';
      case 'etf': return '📈';
      case 'stocks': return '💹';
      default: return '💰';
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || investment.type === filters.type;
    const matchesStatus = filters.status === 'all' || investment.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600 mt-1">Track and manage your investment portfolio</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="btn-secondary inline-flex items-center"
          >
            {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </button>
          <button className="btn-primary inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {showBalances ? formatCurrency(totalInvested) : '••••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {showBalances ? formatCurrency(totalCurrentValue) : '••••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className={`text-2xl font-bold mt-1 ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {showBalances ? (
                  <>
                    {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)}
                  </>
                ) : '••••••'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              totalReturns >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {totalReturns >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return %</p>
              <p className={`text-2xl font-bold mt-1 ${totalReturnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {showBalances ? (
                  <>
                    {totalReturnPercentage >= 0 ? '+' : ''}{totalReturnPercentage.toFixed(2)}%
                  </>
                ) : '••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search investments..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="input-field pl-10 h-10"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="input-field h-10"
          >
            {investmentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="input-field h-10"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="matured">Matured</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </motion.div>

      {/* Investments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Investments</h2>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary inline-flex items-center">
              <PieChart className="w-4 h-4 mr-2" />
              Portfolio
            </button>
            <button className="btn-secondary inline-flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {filteredInvestments.length > 0 ? (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <div key={investment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTypeIcon(investment.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.risk)}`}>
                          {investment.risk} Risk
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          {investment.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-gray-500">Invested</p>
                        <p className="font-semibold text-gray-900">
                          {showBalances ? formatCurrency(investment.invested) : '••••••'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Value</p>
                        <p className="font-semibold text-gray-900">
                          {showBalances ? formatCurrency(investment.currentValue) : '••••••'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Returns</p>
                        <p className={`font-semibold ${investment.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {showBalances ? (
                            <>
                              {investment.returns >= 0 ? '+' : ''}{formatCurrency(investment.returns)} 
                              ({investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage.toFixed(1)}%)
                            </>
                          ) : '••••••'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">No investments found.</p>
            <button className="btn-primary mt-4">
              Add Your First Investment
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Investments;