import { ArrowUp, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Card from '../components/Card';
import MonthYearSelect from '../components/MonthYearSelect';
import {
  getTransactionSummary,
  getTransactionsMontlhy, // (mantive como está, mas recomendo corrigir o nome depois)
} from '../services/transactionService';

import type { MonthlyItem, TransactionSummary } from '../types/transactions';
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

  const [loading, setLoading] = useState(false);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const response = await getTransactionSummary(month, year);
        setSummary(response);
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
        setSummary(initialSummary);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadMonthly() {
      try {
        setLoading(true);
        const response = await getTransactionsMontlhy(month, year);

        console.log('MONTHLY RESPONSE:', response);

        setMonthlyItemsData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setMonthlyItemsData([]);
      } finally {
        setLoading(false);
      }
    }

    loadMonthly();
  }, [month, year]);

  const renderPieChatLabel = ({ categoryName, percent }: any): string => {
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  };

  const formatTooTipValue = (value: number | string) => {
    return formatCurrency(typeof value === 'number' ? value : 0);
  };

  return (
    <div className="container-app py-6">
      {/* HEADER */}
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

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title={<span className="text-white">Saldo</span>}
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2 ${
              summary.balance > 0 ? 'text-primary-500' : 'text-red-300'
            }`}
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
          title={<span className="text-amber-50">Despesas</span>}
          hover
        >
          <p className="text-2xl font-semibold mt-2 text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        {/* PIE CHART */}
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title={<span className="text-amber-50">Despesas por Categoria</span>}
          className="min-h-80"
        >
          {loading ? (
            <p className="text-gray-400 mt-4">Carregando...</p>
          ) : summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChatLabel}
                  >
                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada nesse período
            </p>
          )}
        </Card>

        {/* BAR CHART */}
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title={<span className="text-amber-50">Histórico Mensal</span>}
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255, 0.1)"
                  />
                  <XAxis dataKey="name" stroke="#94a3bb" />
                  <YAxis
                    stroke="#94a3bb"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 14 } }}
                  />
                  <Tooltip
                    formatter={formatCurrency}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#2a2a2a',
                    }}
                    labelStyle={{ color: ' #f8f8f8' }}
                  />
                  <Legend />

                  <Bar
                    dataKey="income"
                    name="Receitas"
                    fill="#37e359"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Despesas"
                    fill="#ff6384"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum dado registrado nesse período
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
