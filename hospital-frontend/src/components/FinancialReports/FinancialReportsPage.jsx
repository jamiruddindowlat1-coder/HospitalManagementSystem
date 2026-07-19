import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DateRangeFilter from './DateRangeFilter';
import ProfitLossSummary from './ProfitLossSummary';
import IncomeByCategory from './IncomeByCategory';
import ExpenseByCategory from './ExpenseByCategory';
import LedgerAdvancedFilter from './LedgerAdvancedFilter';
import ExportButtons from './ExportButtons';
import './FinancialReports.css';

function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = new Date().toISOString().split('T')[0]
    ? useState(new Date().toISOString().split('T')[0])
    : useState('');

  const [summary, setSummary] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);

    try {
      const params = { startDate, endDate };

      const [
        summaryRes,
        incomeRes,
        expenseRes,
        topExpRes,
        ledgerRes,
      ] = await Promise.all([
        api.get('/FinancialReports/profit-loss', { params }),
        api.get('/FinancialReports/income-by-category', { params }),
        api.get('/FinancialReports/expense-by-category', { params }),
        api.get('/FinancialReports/top-expenses', { params }),
        api.post('/FinancialReports/ledger', { startDate, endDate }),
      ]);

      console.log('Income API Response:', incomeRes.data);
      console.log('Top Expense First Row:', topExpRes.data[0]);
      console.log('Ledger API Response:', ledgerRes.data);

      setSummary(summaryRes.data);
      setIncomeData(incomeRes.data);
      setExpenseData(expenseRes.data);
      setTopExpenses(topExpRes.data);
      setLedgerData(ledgerRes.data.entries || []);
    } catch (err) {
      console.error('Failed to fetch financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLedgerFilter = async ({ type, category }) => {
    setLoading(true);

    try {
      const res = await api.post('/FinancialReports/ledger', {
        startDate,
        endDate,
        type,
        category,
      });

      setLedgerData(res.data.entries || res.data);
    } catch (err) {
      console.error('Ledger filter failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financial-reports-page">
      <div className="page-header">
        <h2>Financial Reports</h2>

        <ExportButtons
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={fetchAllData}
      />

      <div className="tabs">
        <button
          className={activeTab === 'summary' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>

        <button
          className={activeTab === 'income' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('income')}
        >
          Income
        </button>

        <button
          className={activeTab === 'expense' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('expense')}
        >
          Expense
        </button>

        <button
          className={activeTab === 'ledger' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('ledger')}
        >
          Ledger
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && (
          <ProfitLossSummary
            data={summary}
            loading={loading}
          />
        )}

        {activeTab === 'income' && (
          <IncomeByCategory
            data={incomeData}
            loading={loading}
          />
        )}

        {activeTab === 'expense' && (
          <ExpenseByCategory
            categoryData={expenseData}
            topExpenses={topExpenses}
            loading={loading}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerAdvancedFilter
            ledgerData={ledgerData}
            loading={loading}
            onFilterChange={handleLedgerFilter}
          />
        )}
      </div>
    </div>
  );
}

export default FinancialReportsPage;