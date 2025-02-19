'use client';

import { useState } from 'react';
import { useUpdateBanner, useGetBanners } from '@/services/core.service';
import Loading from '@/components/loading/Loading';
import { useQueryClient } from '@tanstack/react-query';
import BannerList from './components/BannerList';
import BannerEditForm from './components/BannerEditForm';

const BannerPage = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading, isError, refetch } = useGetBanners();
  const { mutate: updateBanner, isPending } = useUpdateBanner({
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      alert('배너 수정이 완료되었습니다.');
    },
    onError: (error) => {
      console.error(error);
      alert('배너 수정에 실패했습니다.');
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!isUpdating)
    return (
      <BannerList
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        banners={data?.banners || []}
      />
    );
  return (
    <BannerEditForm
      banners={data?.banners || []}
      setIsUpdating={setIsUpdating}
      isPending={isPending}
      updateBanner={updateBanner}
    />
  );
};

export default BannerPage;
