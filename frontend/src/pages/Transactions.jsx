import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Edit3,
  Trash2,
  FileText,
  ChevronDown
} from 'lucide-react';
import transactionService from '../services/transactions';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    tags: []
  });

  const categories = {
    expense: ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.current]);

  // Initialize modal form only when opening modal
  useEffect(() => {
    if (showModal && !editingTransaction) {
      // Only reset form for new transactions, and only once
      const initialForm = {
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        tags: []
      };
      setNewTransaction(initialForm);
    }
  }, [showModal]);

  // Handle editing transaction separately
  useEffect(() => {
    if (editingTransaction) {
      setNewTransaction({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        description: editingTransaction.description,
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        paymentMethod: editingTransaction.paymentMethod,
        tags: editingTransaction.tags || []
      });
    }
  }, [editingTransaction]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest('.relative')) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions({
        page: pagination.current,
        limit: 10,
        ...filters
      });

      if (response.success) {
        setTransactions(response.transactions);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await transactionService.createTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      });

      if (response.success) {
        toast.success('Transaction added successfully');
        setShowModal(false);
        resetForm();
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await transactionService.updateTransaction(editingTransaction._id, {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      });

      if (response.success) {
        toast.success('Transaction updated successfully');
        setEditingTransaction(null);
        setShowModal(false);
        resetForm();
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await transactionService.deleteTransaction(id);
        if (response.success) {
          toast.success('Transaction deleted successfully');
          fetchTransactions();
        }
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const resetForm = () => {
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      tags: []
    });
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import for better bundle size
      const jsPDF = (await import('jspdf')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Transaction Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      pdf.text(`Total Transactions: ${transactions.length}`, pageWidth / 2, 35, { align: 'center' });
      
      // Add filters info if any are applied
      let yPosition = 50;
      if (filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.startDate || filters.endDate) {
        pdf.setFontSize(14);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Applied Filters:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        if (filters.search) {
          pdf.text(`Search: ${filters.search}`, 20, yPosition);
          yPosition += 5;
        }
        if (filters.type !== 'all') {
          pdf.text(`Type: ${filters.type}`, 20, yPosition);
          yPosition += 5;
        }
        if (filters.category !== 'all') {
          pdf.text(`Category: ${filters.category}`, 20, yPosition);
          yPosition += 5;
        }
        if (filters.startDate) {
          pdf.text(`Start Date: ${new Date(filters.startDate).toLocaleDateString()}`, 20, yPosition);
          yPosition += 5;
        }
        if (filters.endDate) {
          pdf.text(`End Date: ${new Date(filters.endDate).toLocaleDateString()}`, 20, yPosition);
          yPosition += 5;
        }
        yPosition += 10;
      }
      
      // Add transactions table
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Transactions', 20, yPosition);
      yPosition += 10;
      
      // Table headers
      pdf.setFontSize(9);
      const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
      const colWidths = [25, 20, 25, 65, 25];
      let xPosition = 20;
      
      // Draw header background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 3, 160, 8, 'F');
      
      pdf.setTextColor(40, 40, 40);
      headers.forEach((header, index) => {
        pdf.text(header, xPosition + 2, yPosition + 2);
        xPosition += colWidths[index];
      });
      
      yPosition += 8;
      
      // Table data
      transactions.forEach((transaction, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
          
          // Redraw headers on new page
          pdf.setFillColor(240, 240, 240);
          pdf.rect(20, yPosition - 3, 160, 8, 'F');
          xPosition = 20;
          headers.forEach((header, index) => {
            pdf.text(header, xPosition + 2, yPosition + 2);
            xPosition += colWidths[index];
          });
          yPosition += 8;
        }
        
        xPosition = 20;
        
        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(20, yPosition - 3, 160, 6, 'F');
        }
        
        pdf.setTextColor(60, 60, 60);
        
        // Date
        pdf.text(new Date(transaction.date).toLocaleDateString(), xPosition + 1, yPosition);
        xPosition += colWidths[0];
        
        // Type
        if (transaction.type === 'income') {
          pdf.setTextColor(34, 197, 94);
        } else {
          pdf.setTextColor(239, 68, 68);
        }
        pdf.text(transaction.type.toUpperCase(), xPosition + 1, yPosition);
        xPosition += colWidths[1];
        
        // Category
        pdf.setTextColor(60, 60, 60);
        pdf.text(transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1), xPosition + 1, yPosition);
        xPosition += colWidths[2];
        
        // Description (truncate if too long)
        const description = transaction.description.length > 35 
          ? transaction.description.substring(0, 32) + '...'
          : transaction.description;
        pdf.text(description, xPosition + 1, yPosition);
        xPosition += colWidths[3];
        
        // Amount
        if (transaction.type === 'income') {
          pdf.setTextColor(34, 197, 94);
        } else {
          pdf.setTextColor(239, 68, 68);
        }
        const prefix = transaction.type === 'income' ? '+' : '-';
        pdf.text(prefix + formatCurrency(transaction.amount), xPosition + 1, yPosition);
        
        yPosition += 6;
      });
      
      // Add summary at the end
      if (transactions.length > 0) {
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        yPosition += 10;
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Summary:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setTextColor(34, 197, 94);
        pdf.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, yPosition);
        yPosition += 6;
        
        pdf.setTextColor(239, 68, 68);
        pdf.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, yPosition);
        yPosition += 6;
        
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Net Amount: ${formatCurrency(totalIncome - totalExpenses)}`, 20, yPosition);
      }
      
      // Save the PDF
      const fileName = `transactions-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const exportToExcel = async () => {
    try {
      // Dynamic import for better bundle size
      const XLSX = await import('xlsx');
      
      // Prepare data for Excel
      const excelData = transactions.map(transaction => ({
        Date: new Date(transaction.date).toLocaleDateString(),
        Type: transaction.type.toUpperCase(),
        Category: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
        Description: transaction.description,
        Amount: transaction.amount,
        'Payment Method': transaction.paymentMethod.replace('_', ' ').toUpperCase(),
        'Formatted Amount': formatCurrency(transaction.amount)
      }));
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add summary data
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Add summary rows
      const summaryData = [
        {},
        { Date: 'SUMMARY', Type: '', Category: '', Description: '', Amount: '', 'Payment Method': '', 'Formatted Amount': '' },
        { Date: 'Total Income', Type: '', Category: '', Description: '', Amount: totalIncome, 'Payment Method': '', 'Formatted Amount': formatCurrency(totalIncome) },
        { Date: 'Total Expenses', Type: '', Category: '', Description: '', Amount: totalExpenses, 'Payment Method': '', 'Formatted Amount': formatCurrency(totalExpenses) },
        { Date: 'Net Amount', Type: '', Category: '', Description: '', Amount: totalIncome - totalExpenses, 'Payment Method': '', 'Formatted Amount': formatCurrency(totalIncome - totalExpenses) }
      ];
      
      // Append summary to worksheet
      XLSX.utils.sheet_add_json(worksheet, summaryData, { skipHeader: true, origin: -1 });
      
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
      
      // Save the file
      const fileName = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  // Optimized input handlers to prevent re-render issues
  const handleAmountChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, amount: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleTypeChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, type: e.target.value, category: '' }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const handleDateChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, date: e.target.value }));
  }, []);

  const handlePaymentMethodChange = useCallback((e) => {
    setNewTransaction(prev => ({ ...prev, paymentMethod: e.target.value }));
  }, []);

  // Modal Component - Moved outside to prevent re-creation
  const TransactionModal = React.memo(({ isEdit = false }) => {
    // Local state to prevent parent re-renders from affecting inputs
    const [localFormData, setLocalFormData] = useState(newTransaction);
    
    // Sync with parent state when modal opens
    useEffect(() => {
      setLocalFormData(newTransaction);
    }, [newTransaction]);
    
    // Local handlers to prevent re-renders
    const handleLocalAmountChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, amount: e.target.value }));
    }, []);

    const handleLocalDescriptionChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, description: e.target.value }));
    }, []);

    const handleLocalTypeChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, type: e.target.value, category: '' }));
    }, []);

    const handleLocalCategoryChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, category: e.target.value }));
    }, []);

    const handleLocalDateChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, date: e.target.value }));
    }, []);

    const handleLocalPaymentMethodChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
    }, []);
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      // Update parent state and submit
      setNewTransaction(localFormData);
      if (isEdit) {
        handleUpdateTransaction(e);
      } else {
        handleAddTransaction(e);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
        >
          <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="px-6 pt-5 pb-3 flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill the details below to {isEdit ? 'update' : 'record'} a transaction.
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="px-6 pb-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={localFormData.type}
                  onChange={handleLocalTypeChange}
                  className="input-field h-11 rounded-xl focus:ring-rose-500"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={localFormData.amount}
                  onChange={handleLocalAmountChange}
                  className="input-field h-11 rounded-xl focus:ring-rose-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={localFormData.category}
                onChange={handleLocalCategoryChange}
                className="input-field h-11 rounded-xl focus:ring-rose-500"
                required
              >
                <option value="">Select category</option>
                {categories[localFormData.type].map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={localFormData.description}
                onChange={handleLocalDescriptionChange}
                className="input-field h-11 rounded-xl focus:ring-rose-500"
                placeholder="Enter description"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                maxLength="255"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={localFormData.date}
                  onChange={handleLocalDateChange}
                  className="input-field h-11 rounded-xl focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={localFormData.paymentMethod}
                  onChange={handleLocalPaymentMethodChange}
                  className="input-field h-11 rounded-xl focus:ring-rose-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingTransaction(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center text-white font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 shadow-sm hover:opacity-95">
                {isEdit ? 'Update' : 'Add'} Transaction
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track and manage all your income and expenses</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="btn-secondary inline-flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    exportToPDF();
                    setShowExportDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export to PDF
                </button>
                <button
                  onClick={() => {
                    exportToExcel();
                    setShowExportDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2 -mt-px" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
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
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="input-field h-10"
          >
            <option value="all">All Categories</option>
            {[...categories.expense, ...categories.income].map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            className="input-field h-10"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            className="input-field h-10"
            placeholder="End Date"
          />
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {transaction.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{transaction.category}</td>
                      <td className={`py-3 px-4 font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({...pagination, current: pagination.current - 1})}
                    disabled={pagination.current === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({...pagination, current: pagination.current + 1})}
                    disabled={pagination.current === pagination.pages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">No transactions found.</p>
          </div>
        )}
      </motion.div>

      {showModal && <TransactionModal isEdit={!!editingTransaction} />}
    </div>
  );
};

export default Transactions;
