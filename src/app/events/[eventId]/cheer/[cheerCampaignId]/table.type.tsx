'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { formatDateString } from '@/utils/date.util';
import { EventCheerCampaignsViewEntity } from '@/types/cheer.type';
import { DEFAULT_EVENT_IMAGE } from '@/constants/common';
import Stringifier from '@/utils/stringifier.util';

const columnHelper = createColumnHelper<EventCheerCampaignsViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'image',
    header: '캠페인 이미지',
    cell: (props) => (
      <div className="relative m-4 h-112 w-100">
        <Image
          src={props.row.original.imageUrl || DEFAULT_EVENT_IMAGE}
          alt="Cheer Campaign"
          fill
          className="object-contain"
        />
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: '상태',
    cell: (info) => {
      const status = info.getValue();
      const statusText = Stringifier.eventCheerCampaignStatus(status);
      const style =
        {
          READY: 'text-basic-grey-700',
          RUNNING: 'text-brand-primary-400',
          ENDED: 'text-basic-grey-500',
          INACTIVE: 'text-basic-grey-500',
        }[status] || 'text-basic-grey-700';
      return <span className={`${style} font-500`}>{statusText}</span>;
    },
  }),
  columnHelper.display({
    id: 'campaignInfo',
    header: '캠페인 정보',
    cell: (info) => {
      const {
        buttonText,
        buttonImageUrl,
        cheerCampaignParticipationTotalCount,
        cheerCampaignParticipationTotalUserCount,
      } = info.row.original;
      return (
        <div className="flex flex-col gap-8 p-8 text-16">
          {buttonText && <p className="font-700">{buttonText}</p>}
          <p className="font-400 text-basic-grey-700">
            총 참여 수: {cheerCampaignParticipationTotalCount.toLocaleString()}
            명
          </p>
          <p className="font-400 text-basic-grey-700">
            총 참여 유저 수:{' '}
            {cheerCampaignParticipationTotalUserCount.toLocaleString()}명
          </p>
          {buttonImageUrl && (
            <div className="relative mt-8 h-60 w-100">
              <Image
                src={buttonImageUrl}
                alt="Button Image"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'discountPolicies',
    header: '할인 정책',
    cell: (info) => {
      const { discountPolicies } = info.row.original;
      if (!discountPolicies || discountPolicies.length === 0) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className="flex h-full flex-col justify-between">
          {discountPolicies.map((policy) => (
            <div
              key={policy.eventCheerDiscountPolicyId}
              className="flex h-[58px] grow items-center justify-center whitespace-nowrap break-keep border-b border-basic-grey-100 px-8 last:border-b-0"
            >
              <div className="flex flex-col gap-4">
                <p className="text-14 font-500">
                  {policy.minParticipationCount.toLocaleString()}명 이상 →{' '}
                  {policy.discountRate}% 할인
                </p>
                <p
                  className={`text-12 font-400 ${
                    policy.isActive
                      ? 'text-brand-primary-400'
                      : 'text-basic-grey-500'
                  }`}
                >
                  {policy.isActive ? '활성' : '비활성'}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'result',
    header: '결과',
    cell: (info) => {
      const { result } = info.row.original;
      if (!result) {
        return <div className="text-center">-</div>;
      }
      return (
        <div className="flex flex-col gap-4 p-8">
          <p className="text-14 font-500">
            최종 할인율: {result.finalDiscountRate}%
          </p>
          <p className="text-14 font-400 text-basic-grey-700">
            총 참여 수: {result.totalParticipationCount.toLocaleString()}명
          </p>
          <p className="text-12 font-400 text-basic-grey-600">
            결정일: {formatDateString(result.decidedAt, 'datetime')}
          </p>
        </div>
      );
    },
  }),
  columnHelper.accessor('endDate', {
    header: '종료 날짜 및 시간',
    cell: (info) => {
      const endDate = info.getValue();
      return endDate ? formatDateString(endDate, 'datetime') : '-';
    },
  }),
  columnHelper.accessor('createdAt', {
    header: '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('updatedAt', {
    header: '수정일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
];
