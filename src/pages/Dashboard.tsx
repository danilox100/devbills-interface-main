import { ArrowUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import MonthYearSelect from '../components/MonthYearSelect';
import { getTransactionSummary } from '../services/transactionService';
import type { TransactionSummary } from '../types/transactions';
import { formatCurrency } from '../utils/formatters';

const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
  expensesByCategory: [],
};

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionSummary(month, year);

      setSummary(response);
    }
    loadTransactionsSummary();
  }, [month, year]);

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl text-amber-50 font-bold mb-4 md:mb-0">
          Dashboard
        </h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title={<span className="text-white">Saldo</span>}
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2 
          ${summary.balance > 0 ? 'text-primary-500' : 'text-red-300'}
          `}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card
          icon={<ArrowUp size={20} className="text-primary-500" />}
          title={<span className="text-white">Receitas</span>}
          hover
        >
          <p className="text-2xl font-semibold mt-2 text-primary-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        <Card
          icon={<Wallet size={20} className="text-red-600" />}
          title={<span className="text-white">Despesas</span>}
          hover
        >
          <p className="text-2xl font-semibold mt-2 text-red-600">
            {formatCurrency(summary.balance)}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
