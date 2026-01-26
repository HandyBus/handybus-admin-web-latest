import { FILTER_PERIODS, FilterPeriod } from '../types/types';

interface MetricUnitFilterProps {
  selectedPeriod: FilterPeriod;
  onChangePeriod: (period: FilterPeriod) => void;
}

const MetricUnitFilter = ({
  selectedPeriod,
  onChangePeriod,
}: MetricUnitFilterProps) => {
  return (
    <div className="flex h-[46px] w-fit items-center rounded-8 bg-basic-white p-4">
      {FILTER_PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => onChangePeriod(period)}
          className={`flex h-36 w-56 items-center justify-center rounded-8 text-14 font-500 transition-colors ${
            selectedPeriod === period
              ? 'bg-basic-black text-basic-white'
              : 'text-basic-grey-700 hover:bg-basic-grey-50'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default MetricUnitFilter;
