import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import Toggle from '@/components/button/Toggle';
import { AgeRangeEnum, GenderEnum } from '@/types/user.type';
import Stringifier from '@/utils/stringifier.util';
import { GetUsersOptions } from '@/services/user.service';
import { UserFilterAction } from '../hooks/useUserFilter';
import { Dispatch, ReactNode } from 'react';
import { ActiveStatusEnum } from '@/types/common.type';
import DebouncedInput from '@/components/input/DebouncedInput';
import DateTimeInput from '@/components/input/DateTimeInput';

interface Props {
  option: GetUsersOptions;
  dispatch: Dispatch<UserFilterAction>;
}

const UserFilter = ({ option, dispatch }: Props) => {
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-fit items-center justify-start gap-4 rounded-[8px] p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100">
        <FilterIcon size={16} />
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="mb-8 flex flex-col gap-4 rounded-[4px] bg-brand-primary-400/50 p-16">
        <div className="grid grid-cols-2 gap-12">
          <article>
            <Label>이름</Label>
            <DebouncedInput
              value={option.name ?? ''}
              setValue={(value) =>
                dispatch({ type: 'SET_NAME', name: value || undefined })
              }
            />
          </article>
          <article>
            <Label>닉네임</Label>
            <DebouncedInput
              value={option.nickname ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_NICKNAME',
                  nickname: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>전화번호</Label>
            <DebouncedInput
              value={option.phoneNumber ?? ''}
              setValue={(value) =>
                dispatch({
                  type: 'SET_PHONE_NUMBER',
                  phoneNumber: value || undefined,
                })
              }
            />
          </article>
          <article>
            <Label>성별</Label>
            <div className="flex flex-row gap-4">
              {GenderEnum.options
                .filter((gender) => gender !== 'NONE')
                .map((gender) => (
                  <Toggle
                    key={gender}
                    label={Stringifier.gender(gender)}
                    value={gender === option.gender}
                    setValue={() =>
                      dispatch({
                        type: 'SET_GENDER',
                        gender: gender === option.gender ? undefined : gender,
                      })
                    }
                  />
                ))}
            </div>
          </article>
          <article>
            <Label>연령대</Label>
            <div className="flex flex-row gap-4">
              {AgeRangeEnum.options
                .filter((ageRange) => ageRange !== '연령대 미지정')
                .map((ageRange) => (
                  <Toggle
                    key={ageRange}
                    label={ageRange}
                    value={ageRange === option.ageRange}
                    setValue={() =>
                      dispatch({
                        type: 'SET_AGE_RANGE',
                        ageRange:
                          ageRange === option.ageRange ? undefined : ageRange,
                      })
                    }
                  />
                ))}
            </div>
          </article>
          <article>
            <Label>소셜 로그인 연동 여부</Label>
            <div className="flex flex-row gap-4">
              <Toggle
                label={'카카오'}
                value={option.isConnectedKakao === true}
                setValue={() =>
                  dispatch({
                    type: 'SET_IS_CONNECTED_KAKAO',
                    isConnectedKakao:
                      option.isConnectedKakao === true ? undefined : true,
                  })
                }
              />
              <Toggle
                label={'네이버'}
                value={option.isConnectedNaver === true}
                setValue={() =>
                  dispatch({
                    type: 'SET_IS_CONNECTED_NAVER',
                    isConnectedNaver:
                      option.isConnectedNaver === true ? undefined : true,
                  })
                }
              />
            </div>
          </article>
          <article>
            <Label>탈퇴 여부</Label>
            <div className="flex flex-row gap-4">
              {ActiveStatusEnum.options.map((status) => (
                <Toggle
                  key={status}
                  label={
                    status === 'ACTIVE' ? '탈퇴하지 않은 회원' : '탈퇴한 회원'
                  }
                  value={status === option.status}
                  setValue={() =>
                    dispatch({
                      type: 'SET_STATUS',
                      status: status === option.status ? undefined : status,
                    })
                  }
                />
              ))}
            </div>
          </article>
          <article>
            <Label>온보딩 완료 여부</Label>
            <div className="flex flex-row gap-4">
              {[true, false].map((onboardingComplete) => (
                <Toggle
                  key={String(onboardingComplete)}
                  label={onboardingComplete ? '완료' : '미완료'}
                  value={onboardingComplete === option.onboardingComplete}
                  setValue={() =>
                    dispatch({
                      type: 'SET_ONBOARDING_COMPLETE',
                      onboardingComplete:
                        onboardingComplete === option.onboardingComplete
                          ? undefined
                          : onboardingComplete,
                    })
                  }
                />
              ))}
            </div>
          </article>
          <article>
            <Label>마케팅 약관 동의 여부</Label>
            <div className="flex flex-row gap-4">
              {[true, false].map((marketingConsent) => (
                <Toggle
                  key={String(marketingConsent)}
                  label={marketingConsent ? '동의' : '미동의'}
                  value={marketingConsent === option.marketingConsent}
                  setValue={() =>
                    dispatch({
                      type: 'SET_MARKETING_CONSENT',
                      marketingConsent:
                        marketingConsent === option.marketingConsent
                          ? undefined
                          : marketingConsent,
                    })
                  }
                />
              ))}
            </div>
          </article>
          <article>
            <Label>마지막 접속 시간</Label>
            <div className="flex flex-row gap-4">
              <DateTimeInput
                value={option.lastLoginFrom ?? null}
                setValue={(value) =>
                  dispatch({
                    type: 'SET_LAST_LOGIN_FROM',
                    lastLoginFrom: value ?? undefined,
                  })
                }
              />
              <DateTimeInput
                value={option.lastLoginTo ?? null}
                setValue={(value) =>
                  dispatch({
                    type: 'SET_LAST_LOGIN_TO',
                    lastLoginTo: value ?? undefined,
                  })
                }
              />
            </div>
          </article>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default UserFilter;

const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-14 font-600 text-basic-grey-700">{children}</label>
  );
};
