'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import BlueButton from '../link/BlueButton';
import { RegionHub } from '@/types/hub.type';
import dayjs from 'dayjs';
import { useGetRegionHub } from '@/services/location.service';

interface Props {
  regionId: number;
  regionHubId: number;
}

// TODO use v2 api when available
const RegionHubViewerModal = ({ regionId, regionHubId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetRegionHub(regionId, regionHubId);

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>{data?.name}</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="p-8">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {data && <RegionHubViewer regionHub={data} />}
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default RegionHubViewerModal;

////////////////// regionHubViewer //////////////////

const RegionHubViewer = ({ regionHub }: { regionHub: RegionHub }) => {
  return (
    <div className="bg-white p-8 rounded-lg">
      <div>지역 ID: {regionHub.regionId}</div>
      <div>지역 거점지 ID: {regionHub.regionHubId}</div>
      <div>이름: {regionHub.name}</div>
      <div>주소: {regionHub.address}</div>
      <div>
        생성: {dayjs(regionHub.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      </div>
      <div>
        수정: {dayjs(regionHub.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
      </div>
    </div>
  );
};
