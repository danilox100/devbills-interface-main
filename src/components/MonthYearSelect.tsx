import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const monthNames: readonly string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MonthYearSelect = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();

  const years: number[] = Array.from(
    { length: 11 },
    (_, i) => currentYear - 5 + i,
  );

  const handleNextMonth = (): void => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };

  const handlePrevMonth = (): void => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
      {/* LEFT */}
      <button
        type="button"
        className="group flex items-center justify-center p-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={handlePrevMonth}
      >
        <ChevronLeft className="text-gray-400 group-hover:text-green-500 transition-colors" />
      </button>

      {/* SELECTS */}
      <div className="flex gap-4">
        <div>
          <label htmlFor="month-select" className="sr-only">
            Selecionar Mês
          </label>
          <select
            id="month-select"
            onChange={(event) => onMonthChange(Number(event.target.value))}
            value={month}
            className="bg-gray-800 cursor-pointer border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year-select" className="sr-only">
            Selecionar Ano
          </label>
          <select
            id="year-select"
            onChange={(event) => onYearChange(Number(event.target.value))}
            value={year}
            className="bg-gray-800 cursor-pointer border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {years.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT */}
      <button
        type="button"
        className="group flex items-center justify-center p-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Próximo Mês"
        onClick={handleNextMonth}
      >
        <ChevronRight className="text-gray-400 group-hover:text-green-500 transition-colors" />
      </button>
    </div>
  );
};

export default MonthYearSelect;
