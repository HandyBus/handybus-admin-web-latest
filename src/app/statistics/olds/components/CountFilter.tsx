import Toggle from '@/components/button/Toggle';
import { CountFilterAction, CountFilterOptions } from '../hooks/useCountFilter';
import { Dispatch } from 'react';

interface Props {
  countFilter: CountFilterOptions;
  dispatchCountFilter: Dispatch<CountFilterAction>;
}

const CountFilter = ({ countFilter, dispatchCountFilter }: Props) => {
  return (
    <section className="flex items-center gap-20 pb-12">
      <article className="flex items-center gap-4">
        <Toggle
          label="일일"
          value={countFilter.countType === '일일'}
          setValue={() =>
            dispatchCountFilter({ type: 'SET_TYPE', countType: '일일' })
          }
        />
        <Toggle
          label="누적"
          value={countFilter.countType === '누적'}
          setValue={() =>
            dispatchCountFilter({ type: 'SET_TYPE', countType: '누적' })
          }
        />
      </article>
      <article className="flex items-center gap-4">
        <Toggle
          label="1주"
          value={countFilter.range === '1주'}
          setValue={() =>
            dispatchCountFilter({ type: 'SET_RANGE', range: '1주' })
          }
        />
        <Toggle
          label="3달"
          value={countFilter.range === '3달'}
          setValue={() =>
            dispatchCountFilter({ type: 'SET_RANGE', range: '3달' })
          }
        />
        <Toggle
          label="1년"
          value={countFilter.range === '1년'}
          setValue={() =>
            dispatchCountFilter({ type: 'SET_RANGE', range: '1년' })
          }
        />
      </article>
    </section>
  );
};

export default CountFilter;
