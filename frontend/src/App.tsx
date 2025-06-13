import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import TransactionTable from './components/TransactionTable';
import Dashboard from './components/Dashboard';
import Copilot from './components/Copilot';
import { apiService } from './services/api';
import { Transaction, DashboardSummary } from './types';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'transactions' | 'copilot'>('upload');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, summaryData] = await Promise.all([
        apiService.getTransactions(),
        apiService.getDashboardSummary()
      ]);
      
      setTransactions(transactionsData);
      setDashboardSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadData();
    setActiveTab('dashboard');
  };

  const handleTransactionUpdate = () => {
    loadData();
  };

  const tabs = [
    { id: 'upload', label: '📁 Upload', component: <FileUpload onUploadSuccess={handleUploadSuccess} /> },
    { id: 'dashboard', label: '📊 Dashboard', component: <Dashboard summary={dashboardSummary} /> },
    { id: 'transactions', label: '💳 Transactions', component: <TransactionTable transactions={transactions} onTransactionUpdate={handleTransactionUpdate} /> },
    { id: 'copilot', label: '🤖 Copilot', component: <Copilot /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Finance Copilot</h1>
              <p className="text-gray-600">Analyze your expenses with AI-powered insights</p>
            </div>
            {dashboardSummary && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${dashboardSummary.total_expenses.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>Personal Finance Copilot - Built with React + TypeScript & FastAPI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 