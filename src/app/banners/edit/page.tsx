'use client';

import { useGetBanners } from '@/services/core.service';
import Loading from '@/components/loading/Loading';
import BannerEditForm from './BannerEditForm';

const BannerEditPage = () => {
  const { data, isLoading, isError } = useGetBanners();

  if (isLoading) return <Loading />;
  if (isError) throw new Error('배너 조회에 실패했습니다.');
  return <BannerEditForm banners={data?.banners || []} />;
};

export default BannerEditPage;
