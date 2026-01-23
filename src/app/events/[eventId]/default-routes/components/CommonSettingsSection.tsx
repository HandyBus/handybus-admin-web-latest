'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import Form from '@/components/form/Form';
import NumberInput from '@/components/input/NumberInput';
import TimeInput from '@/components/input/TimeInput';
import Dropdown from '@/components/input/Dropdown';

const CommonSettingsSection = () => {
  const { control } = useFormContext<BulkRouteFormValues>();

  return (
    <>
      <Form.section>
        <Form.label required>공통 설정</Form.label>
        <section className="grid grid-cols-2 gap-8">
          <div>
            <h5 className="text-16 font-500">
              예약 마감일 <br />
              <span className="text-12 text-basic-grey-600">
                며칠 전까지 예약 가능
              </span>
            </h5>
            <Controller
              control={control}
              name="reservationDeadlineDays"
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 5}
                  setValue={onChange}
                  placeholder="예약 마감일 상대일수 (기본값: 5일)"
                />
              )}
            />
          </div>
          <div>
            <h5 className="text-16 font-500">
              성수기/비수기 <br />
              <span className="text-12 text-basic-grey-600">
                *비수기(12-2월, 7-8월), 성수기(3-6월, 9-11월)
              </span>
            </h5>
            <Controller
              control={control}
              name="season"
              render={({ field: { onChange, value } }) => {
                const seasonOptions: Array<'성수기' | '비수기'> = [
                  '성수기',
                  '비수기',
                ];
                return (
                  <Dropdown
                    value={value || null}
                    onChange={(selected) => onChange(selected || '성수기')}
                    options={seasonOptions}
                    getOptionLabel={(option) => option}
                    getOptionValue={(option) => option}
                    placeholder="성수기/비수기를 선택해주세요"
                    searchable={false}
                  />
                );
              }}
            />
          </div>
          <div>
            <h5 className="text-16 font-500">도착지 행사장행 도착 시간</h5>
            <Controller
              control={control}
              name="toDestinationArrivalTime"
              render={({ field: { onChange, value } }) => (
                <TimeInput value={value} setValue={onChange} />
              )}
            />
          </div>
          <div>
            <h5 className="text-16 font-500">도착지 귀가행 출발 시간</h5>
            <Controller
              control={control}
              name="fromDestinationDepartureTime"
              render={({ field: { onChange, value } }) => (
                <TimeInput value={value} setValue={onChange} />
              )}
            />
          </div>
        </section>
      </Form.section>
    </>
  );
};

export default CommonSettingsSection;
