export type ChartType = 'line' | 'bar';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'line', label: '선' },
  { value: 'bar', label: '막대' },
];

interface ChartTypeToggleProps {
  chartType: ChartType;
  onChangeChartType: (type: ChartType) => void;
}

const ChartTypeToggle = ({
  chartType,
  onChangeChartType,
}: ChartTypeToggleProps) => {
  return (
    <div className="inline-flex h-32 w-fit items-center rounded-full border border-basic-grey-200 bg-basic-grey-50 p-4">
      {CHART_TYPES.map(({ value, label }) => (
        <button
          type="button"
          key={value}
          onClick={() => onChangeChartType(value)}
          className={`flex h-24 min-w-40 items-center justify-center rounded-full px-8 text-12 font-600 leading-none transition-colors ${
            chartType === value
              ? 'bg-basic-black text-basic-white shadow-sm'
              : 'text-basic-grey-700 hover:bg-basic-grey-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ChartTypeToggle;
