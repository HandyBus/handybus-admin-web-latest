'use client';

import BlueLink from '@/components/link/BlueLink';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/common';
import { ID_TO_REGION } from '@/constants/regions';
import { UsersViewEntity } from '@/types/user.type';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';

const columnHelper = createColumnHelper<UsersViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'image',
    header: '프로필 이미지',
    cell: (props) => (
      <Image
        src={props.row.original.profileImage || DEFAULT_PROFILE_IMAGE}
        alt="프로필 이미지"
        width={20}
        height={20}
        className="overflow-hidden"
      />
    ),
    size: 20,
    minSize: 20,
    maxSize: 20,
  }),
  columnHelper.accessor('nickname', {
    header: () => '닉네임',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: () => '전화번호',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('gender', {
    header: () => '성별',
    cell: (info) => Stringifier.gender(info.getValue()),
  }),
  columnHelper.accessor('ageRange', {
    header: () => '연령대',
    cell: (info) => {
      const ageRange = info.getValue();
      return ageRange === '연령대 미지정' ? '-' : ageRange;
    },
  }),
  columnHelper.accessor('regionId', {
    header: () => '지역',
    cell: (info) => {
      const regionId = info.getValue();
      const region = regionId ? ID_TO_REGION[regionId] : null;
      return region ? `${region.bigRegion} ${region.smallRegion}` : '-';
    },
  }),
  columnHelper.display({
    id: 'authChannel',
    header: () => '소셜 로그인',
    cell: (info) => {
      const { isConnectedKakao, isConnectedNaver } = info.row.original;
      const value =
        isConnectedKakao && isConnectedNaver
          ? '카카오, 네이버'
          : isConnectedKakao
            ? '카카오'
            : isConnectedNaver
              ? '네이버'
              : '-';
      return value;
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime', '-'),
  }),
  columnHelper.display({
    id: 'detail',
    header: () => '상세',
    cell: (info) => (
      <BlueLink href={`/users/${info.row.original.userId}`}>상세 보기</BlueLink>
    ),
  }),
];
