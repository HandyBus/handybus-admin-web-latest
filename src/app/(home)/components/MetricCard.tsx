'use client';

import IncreaseIcon from './icons/increase.svg';
import DecreaseIcon from './icons/decrease.svg';
import { MetricData } from '../types/types';

interface MetricCardProps {
  metric: MetricData;
  isSelected: boolean;
  onClick: () => void;
}

const MetricCard = ({ metric, isSelected, onClick }: MetricCardProps) => {
  const { title, subtitle, value, unit, percentage, criterionLabel } = metric;

  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col gap-24 rounded-8 p-20 text-left transition-all
       ${
         isSelected
           ? 'bg-basic-black'
           : 'border border-basic-grey-200 bg-basic-white hover:border-basic-grey-400'
       }`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <span
              className={`text-20 font-600 ${
                isSelected ? 'text-basic-white' : 'text-basic-black'
              }`}
            >
              {title}
            </span>
            {subtitle && (
              <span
                className={`text-16 font-500 ${
                  isSelected ? 'text-basic-grey-400' : 'text-basic-grey-600'
                }`}
              >
                {subtitle}
              </span>
            )}
          </div>
          {criterionLabel && (
            <span
              className={`text-14 font-400 ${
                isSelected ? 'text-basic-grey-500' : 'text-basic-grey-500'
              }`}
            >
              {criterionLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-8">
        <div className="flex items-center gap-[6px]">
          {percentage !== '-' && (
            <>
              {parseFloat(percentage) < 0 ? <DecreaseIcon /> : <IncreaseIcon />}
              <span
                className={`text-16 ${parseFloat(percentage) < 0 ? 'text-basic-red-400' : 'text-brand-primary-400'}`}
              >
                {percentage}
              </span>
            </>
          )}
        </div>
        <p
          className={`text-right text-28 font-600 ${
            isSelected ? 'text-basic-white' : 'text-basic-black'
          }`}
        >
          {value}
        </p>
        <p
          className={`text-right text-16 font-500 ${
            isSelected ? 'text-basic-grey-400' : 'text-basic-grey-600'
          }`}
        >
          {unit}
        </p>
      </div>
    </button>
  );
};

export default MetricCard;
