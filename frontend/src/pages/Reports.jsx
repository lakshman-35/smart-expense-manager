import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import transactionService from '../services/transactions';

// Lazy load chart components
const BarChart = React.lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const RechartsPieChart = React.lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const ResponsiveContainer = React.lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const XAxis = React.lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = React.lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = React.lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = React.lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const Bar = React.lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const Pie = React.lazy(() => import('recharts').then(module => ({ default: module.Pie })));
const Cell = React.lazy(() => import('recharts').then(module => ({ default: module.Cell })));

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      avgMonthlySpending: 0
    },
    monthlyData: [],
    categoryData: []
  });
  const [hasData, setHasData] = useState(false);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setDataLoading(true);
    try {
      // Fetch transactions for the date range using the transaction service
      const response = await transactionService.getTransactions({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        limit: 1000 // Get more transactions for report
      });
      
      console.log('API Response:', response); // Debug log
      
      // The transaction service returns response.transactions
      const transactions = response.transactions || [];
      
      console.log('Transactions found:', transactions.length); // Debug log
      
      if (transactions.length === 0) {
        // No data available - set empty state
        setReportData({
          summary: {
            totalIncome: 0,
            totalExpenses: 0,
            netIncome: 0,
            avgMonthlySpending: 0
          },
          monthlyData: [],
          categoryData: []
        });
        setHasData(false);
        toast.info('No transactions found for the selected date range');
        return;
      }

      // Process user data
      const processedData = processTransactionData(transactions);
      setReportData(processedData);
      setHasData(true);
      toast.success(`Loaded ${transactions.length} transactions`);
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch transaction data');
      // Set empty state on error
      setReportData({
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          avgMonthlySpending: 0
        },
        monthlyData: [],
        categoryData: []
      });
      setHasData(false);
    } finally {
      setDataLoading(false);
    }
  };

  const processTransactionData = (transactions) => {
    console.log('Processing transactions:', transactions); // Debug log
    
    // Calculate summary
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    console.log('Summary calculated:', { income, expenses }); // Debug log
    
    // Group by month
    const monthlyGroups = {};
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthYear = transactionDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!monthlyGroups[monthYear]) {
        monthlyGroups[monthYear] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyGroups[monthYear].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthlyGroups[monthYear].expenses += transaction.amount;
      }
    });
    
    const monthlyData = Object.entries(monthlyGroups).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
    
    console.log('Monthly data:', monthlyData); // Debug log
    
    // Group by category (for expenses only)
    const categoryGroups = {};
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      categoryGroups[category] = (categoryGroups[category] || 0) + transaction.amount;
    });
    
    const totalExpensesForPercent = Object.values(categoryGroups).reduce((sum, amount) => sum + amount, 0);
    const categoryData = Object.entries(categoryGroups)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpensesForPercent > 0 ? Math.round((value / totalExpensesForPercent) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
    
    console.log('Category data:', categoryData); // Debug log
    
    const processedData = {
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netIncome: income - expenses,
        avgMonthlySpending: monthlyData.length > 0 ? expenses / monthlyData.length : 0
      },
      monthlyData,
      categoryData
    };
    
    console.log('Final processed data:', processedData); // Debug log
    
    return processedData;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Validate that we have data to export
      if (!hasData || reportData.summary.totalIncome === 0 && reportData.summary.totalExpenses === 0) {
        toast.error('No data available to export. Please ensure you have transactions in the selected date range.');
        setLoading(false);
        return;
      }

      // Dynamic import to reduce bundle size
      const jsPDF = (await import('jspdf')).default;
      
      const pdf = new jsPDF();
      let yPosition = 20;
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Financial Report', 20, yPosition);
      yPosition += 20;
      
      // Date range
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Period: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 20;
      
      // Summary section
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Summary', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Total Income: ${formatCurrency(reportData.summary.totalIncome)}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Expenses: ${formatCurrency(reportData.summary.totalExpenses)}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Net Income: ${formatCurrency(reportData.summary.netIncome)}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Avg Monthly Spending: ${formatCurrency(reportData.summary.avgMonthlySpending)}`, 20, yPosition);
      yPosition += 20;
      
      // Monthly breakdown
      if (reportData.monthlyData.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Monthly Breakdown', 20, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        
        // Table headers
        pdf.text('Month', 20, yPosition);
        pdf.text('Income', 60, yPosition);
        pdf.text('Expenses', 100, yPosition);
        pdf.text('Net', 140, yPosition);
        yPosition += 10;
        
        // Draw line under headers
        pdf.line(20, yPosition - 2, 180, yPosition - 2);
        
        reportData.monthlyData.forEach(month => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.text(month.month, 20, yPosition);
          pdf.text(formatCurrency(month.income), 60, yPosition);
          pdf.text(formatCurrency(month.expenses), 100, yPosition);
          pdf.text(formatCurrency(month.net), 140, yPosition);
          yPosition += 8;
        });
        
        yPosition += 10;
      }
      
      // Category breakdown
      if (reportData.categoryData.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Category Breakdown', 20, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        
        // Table headers
        pdf.text('Category', 20, yPosition);
        pdf.text('Amount', 80, yPosition);
        pdf.text('Percentage', 130, yPosition);
        yPosition += 10;
        
        // Draw line under headers
        pdf.line(20, yPosition - 2, 180, yPosition - 2);
        
        reportData.categoryData.forEach(category => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.text(category.name, 20, yPosition);
          pdf.text(formatCurrency(category.value), 80, yPosition);
          pdf.text(`${category.percentage}%`, 130, yPosition);
          yPosition += 8;
        });
      }
      
      // Save the PDF
      pdf.save(`financial-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`);
      toast.success('PDF exported successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      // Validate that we have data to export
      if (!hasData || reportData.summary.totalIncome === 0 && reportData.summary.totalExpenses === 0) {
        toast.error('No data available to export. Please ensure you have transactions in the selected date range.');
        setLoading(false);
        return;
      }

      // Dynamic import for better bundle size
      const XLSX = await import('xlsx');
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Financial Report Summary'],
        ['Period', `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`],
        ['Generated', new Date().toLocaleDateString()],
        [''],
        ['Metric', 'Value'],
        ['Total Income', reportData.summary.totalIncome],
        ['Total Expenses', reportData.summary.totalExpenses],
        ['Net Income', reportData.summary.netIncome],
        ['Avg Monthly Spending', reportData.summary.avgMonthlySpending]
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // Monthly data sheet
      if (reportData.monthlyData.length > 0) {
        const monthlyData = [
          ['Month', 'Income', 'Expenses', 'Net'],
          ...reportData.monthlyData.map(month => [
            month.month,
            month.income,
            month.expenses,
            month.net
          ])
        ];
        
        const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Data');
      }
      
      // Category data sheet
      if (reportData.categoryData.length > 0) {
        const categoryData = [
          ['Category', 'Amount', 'Percentage'],
          ...reportData.categoryData.map(category => [
            category.name,
            category.value,
            category.percentage
          ])
        ];
        
        const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
        XLSX.utils.book_append_sheet(workbook, categorySheet, 'Categories');
      }
      
      // Save the file
      XLSX.writeFile(workbook, `financial-report-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`);
      toast.success('Excel file exported successfully');
      
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">
            Analyze your financial data and export detailed reports
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={exportToPDF}
            disabled={loading || !hasData}
            className="btn-secondary flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            {loading ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={exportToExcel}
            disabled={loading || !hasData}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Date Range</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="input-field"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(reportData.summary.totalIncome)}
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
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(reportData.summary.totalExpenses)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className={`text-2xl font-bold mt-1 ${
                reportData.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(reportData.summary.netIncome)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              reportData.summary.netIncome >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Monthly Spending</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(reportData.summary.avgMonthlySpending)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expense Categories
        </h3>
        {hasData && reportData.categoryData.length > 0 ? (
          <div className="space-y-3">
            {reportData.categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {dataLoading ? 'Loading category data...' : 'No expense categories available for the selected period'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Income vs Expenses
          </h3>
          {hasData && reportData.monthlyData.length > 0 ? (
            <Suspense fallback={<div className="text-center py-10">Loading chart...</div>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="income" fill="#10B981" name="Income" barSize={35} />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          ) : (
            <div className="text-center py-10">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {dataLoading ? 'Loading chart data...' : 'No data available for the selected period'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Add some transactions to see your monthly breakdown
              </p>
            </div>
          )}
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Distribution
          </h3>
          {hasData && reportData.categoryData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2">
                <Suspense fallback={<div className="text-center py-10">Loading chart...</div>}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {reportData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Suspense>
              </div>
              <div className="w-full lg:w-1/2 space-y-2 mt-4 lg:mt-0">
                {reportData.categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(category.value)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {dataLoading ? 'Loading chart data...' : 'No expense data available'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Add some expense transactions to see the distribution
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Breakdown
        </h3>
        {hasData && reportData.monthlyData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Income</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Expenses</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Net</th>
                </tr>
              </thead>
              <tbody>
                {reportData.monthlyData.map((month, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{month.month}</td>
                    <td className="py-3 px-4 text-green-600">{formatCurrency(month.income)}</td>
                    <td className="py-3 px-4 text-red-600">{formatCurrency(month.expenses)}</td>
                    <td className={`py-3 px-4 font-medium ${
                      month.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(month.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {dataLoading ? 'Loading monthly data...' : 'No monthly data available for the selected period'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Add some transactions to see your monthly breakdown
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;