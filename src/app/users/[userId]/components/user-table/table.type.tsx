import { createColumnHelper } from '@tanstack/react-table';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { UsersViewEntity } from '@/types/user.type';
import { ID_TO_REGION } from '@/constants/regions';
import Image from 'next/image';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/common';

const columnHelper = createColumnHelper<UsersViewEntity>();

export const columns = [
  columnHelper.accessor('userId', {
    header: () => '유저 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nickname', {
    header: () => '닉네임',
    cell: (info) => info.getValue(),
  }),
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
  // columnHelper.accessor('authChannelType', {
  //   header: () => '소셜 로그인',
  //   cell: (info) => Stringifier.authChannelType(info.getValue()),
  // }),
  columnHelper.accessor('lastLoginAt', {
    header: () => '마지막 접속 시간',
    cell: (info) => formatDateString(info.getValue(), 'datetime', '-'),
  }),
  columnHelper.accessor('favoriteArtists', {
    header: () => '최애 아티스트',
    cell: (info) => {
      const artists = info.getValue();
      return artists?.length
        ? artists.map((artist) => artist.artistName).join(', ')
        : '-';
    },
  }),
  columnHelper.accessor('status', {
    header: () => '탈퇴 여부',
    cell: (info) => (info.getValue() === 'ACTIVE' ? '-' : '탈퇴'),
  }),
  columnHelper.display({
    id: 'onboarding',
    header: '온보딩 완료 여부',
    cell: (props) =>
      props.row.original.progresses?.find(
        (progress) => progress.progressType === 'ONBOARDING_COMPLETE',
      )?.isCompleted
        ? '완료'
        : '미완료',
  }),
  columnHelper.display({
    id: 'marketingConsent',
    header: '마케팅 동의 여부',
    cell: (props) =>
      props.row.original.progresses?.find(
        (progress) => progress.progressType === 'MARKETING_CONSENT',
      )?.isCompleted
        ? '동의'
        : '미동의',
  }),
];
